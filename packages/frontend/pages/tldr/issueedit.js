import React, { Fragment, useState, useEffect, useCallback, useRef, useContext } from 'react';
import ErrorPage from 'next/error'

// SWR
import { request, getTldrUrl, getIssueUrl } from '@/swr';
import useSWR, { mutate } from 'swr';

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addPrompt, addToast, addDelayedToast } from '@/actions';

// URLS
import { getIssuePageUrl } from '../../components/tldr/urls';

// COMPONENTS
import {
	Avatar,
	Bounds,
	Button,
	Card,
	CheckBox,
	Chunk,
	FakeInput,
	FieldError,
	Flex,
	FlexItem,
	FileInput,
	Icon,
	Inline,
	Image,
	Label,
	List,
	Link,
	Modal,
	Picker,
	Reorderable,
	RevealBlock,
	Section,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch,
	View,
	useFormState,
	ThemeContext
} from 'cinderblock';
import Page from '@/components/Page';
import TldrHeader from '@/components/tldr/TldrHeader';
import {LoadingPage} from '@/components/tldr/components';
import Router from 'next/router'
import Head from 'next/head'


// SCREEN-SPECIFIC
import { Utils } from 'cinderblock';
const { runValidations, readFileAsDataUrl } = Utils;





// TODO: move all forms into small components like this
// this way, formstate ONLY re-renders the form, not anything outside it
const EditForm = (props) => {
	const dispatch = useDispatch();
	const { tldr, authentication } = props;
 
	const formState = useFormState({
		initialFields: {
			title: '',
			body: ''
		},
		toastableErrors: {
			BadRequest: 'Something went wrong',
			NotAuthenticated: 'Not signed in'
		},
		addToast: msg => dispatch(addToast(msg))
	});

	const submitForm = async () => {
		
		const submitFields = { 
			...formState.fields,
			tldrId: tldr.id 
		};
		const error = runValidations(submitFields, {
			title: {
				notEmpty: {
					msg: "Title can't be blank"
				},
			},
			body: {
				notNull: {
					msg: "Body can't be blank"
				},
			}
		});
		formState.setError(error);
		if (!error) {
			formState.setLoading(true);
			try {
				const issue = await request(getIssueUrl(), {
					method: 'POST',
					data: submitFields,
					token: authentication.accessToken
				});
				const toastMessage = "Issue posted!";
				dispatch(addDelayedToast(toastMessage));
				Router.push({ pathname: getIssuePageUrl(), query: { issueId: issue.id } })
			}
			catch (error) {
				console.log(error);
				formState.setError(error);
				formState.setLoading(false);
			}
		}
	}


	return(
		<form>
			<Chunk>
				<Label for="title">Title</Label>
				<TextInput
					id="title"
					value={formState.getFieldValue('title')}
					onChange={e => formState.setFieldValue('title', e.target.value)}
					/>
				<FieldError error={formState.error?.fieldErrors?.title} />
			</Chunk>
			<Chunk>
				<Label for="body">Body</Label>
				<TextInput
					multiline={true}
					numberOfLines={4}
					id="body"
					value={formState.getFieldValue('body')}
					onChange={e => formState.setFieldValue('body', e.target.value)}
					/>
				<FieldError error={formState.error?.fieldErrors?.body} />
			</Chunk>
			<Chunk>
				<Button
					label="Post issue"
					onPress={ submitForm }
					isLoading={formState.loading}
					/>
			</Chunk>
		</form>
	)
}

const Edit = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	const { tldrId, issueId, isServer } = props;

	const dispatch = useDispatch();
	const authentication = useSelector(state => state.authentication);
	const tldr = useSWR(getTldrUrl(tldrId));


	// DIVERT PAGE?
	if (!authentication.user ) {
		return (authentication.loading) ? <LoadingPage /> : <ErrorPage statusCode={401} />;
	}

	// RENDER
		return (
			<Page>
				<TldrHeader />
				<Stripe>
					<Bounds style={{ maxWidth: 640 }}>
						<Section>
							<Chunk>
								<Text>{/*tldr.data?.currentTldrVersionContent?.title*/}</Text>
								<Text type="pageHead">Create issue</Text>
							</Chunk>
						</Section>
						<Section>
							<EditForm 
								tldr={tldr}
								authentication={authentication}
								/>
						</Section>
					</Bounds>
				</Stripe>
			</Page>
		);
	
}

Edit.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const { store, req, pathname, query } = context;
	const isServer = !!req;
	const {issueId, tldrId} = query;

	return {
		isServer,
		tldrId,
		issueId
	}
}


export default Edit;



