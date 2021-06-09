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
import Router from 'next/router'
import Head from 'next/head'


// SCREEN-SPECIFIC
import { Utils } from 'cinderblock';
const { runValidations, readFileAsDataUrl } = Utils;


const Edit = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	
	const { tldrId, issueId } = props;

	const dispatch = useDispatch();
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};
	const tldr = useSWR(getTldrUrl(tldrId));


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
			tldrId: tldrId 
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
				// is there even a cause for a full issue edit?
				/*
				// PATCH or POST
				if (issueId != undefined) {
					const issue = await request(getTldrUrl(tldrId), {
						method: 'PATCH',
						data: submitFields,
						token: authentication.accessToken
					});
					const toastMessage = "Settings updated!";
					dispatch(addDelayedToast(toastMessage));
					Router.push({ pathname: getTldrPageUrl(), query: { tldrId: tldr.id } })
				}
				else {
				*/
					const issue = await request(getIssueUrl(), {
						method: 'POST',
						data: submitFields,
						token: authentication.accessToken
					});
					const toastMessage = "Issue posted!";
					dispatch(addDelayedToast(toastMessage));
					Router.push({ pathname: getIssuePageUrl(), query: { issueId: issue.id } })
				/*}*/
			}
			catch (error) {
				console.log(error);
				formState.setError(error);
				formState.setLoading(false);
			}
		}
	}

	// DIVERT TO ERROR PAGE
	if (!authentication.user ) {
		// not logged in or trying to edit something I don't own
		return <ErrorPage statusCode={401} />
	}

	// RENDER
		return (
			<Page>
				<TldrHeader />
				<Stripe>
					<Bounds style={{ maxWidth: 640 }}>
						<Section>
							<Chunk>
								<Text>{tldr.data?.currentTldrVersionContent?.title}</Text>
								<Text type="pageHead">Create issue</Text>
							</Chunk>
						</Section>
						<Section>
							<form>
								
								<Chunk>
									<Label for="category">Title</Label>
									<TextInput
										id="urlKey"
										value={formState.getFieldValue('title')}
										onChange={e => formState.setFieldValue('title', e.target.value)}
										/>
									<FieldError error={formState.error?.fieldErrors?.title} />
								</Chunk>
								<Chunk>
									<Label for="category">Body</Label>
									<TextInput
										multiline={true}
										numberOfLines={4}
										id="urlKey"
										value={formState.getFieldValue('body')}
										onChange={e => formState.setFieldValue('body', e.target.value)}
										/>
									<FieldError error={formState.error?.fieldErrors?.body} />
								</Chunk>
								<Chunk>
									<Button
										label="Post issue"
										onPress={submitForm}
										isLoading={formState.loading}
									/>
								</Chunk>
							</form>
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



