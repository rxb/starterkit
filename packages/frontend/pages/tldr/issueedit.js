import React, { Fragment, useState, useEffect, useCallback, useRef, useContext } from 'react';
import ErrorPage from 'next/error'

// SWR
import { request, getTldrUrl, getIssueUrl } from '@/swr';
import useSWR, { mutate } from 'swr';

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addPrompt, addToast, addDelayedToast } from '@/actions';

// URLS
import { getIssuePageUrl, getTldrPageUrl, getIssuesPageUrl } from '../../components/tldr/urls';

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
import {LoadingPage, ISSUE_STATUS, ISSUE_TYPES} from '@/components/tldr/components';
import Router from 'next/router'
import Head from 'next/head'


// SCREEN-SPECIFIC
import { Utils } from 'cinderblock';
const { runValidations, readFileAsDataUrl } = Utils;

// turn ISSUE_TYPES into a nice array for form
const issueTypes = Object.keys(ISSUE_TYPES).map( (key) => {
	return {id: key, label: ISSUE_TYPES[key].label}
}).sort( (a,b) => (a.sort > b.sort) ? 1 : -1 );

const TypeField = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	const { 
		formState, 
		onChange = () => {} 
	} = props;

	return (
		<>
			<List
				style={styles.pseudoLineHeight}
				variant={{
					small: 'grid',
				}}
				itemsInRow={{
					medium: 2,
				}}
				items={issueTypes}
				renderItem={(type, i) => {
					const selected = type.id == formState.getFieldValue('type');
					return (
						<Touch onPress={() => {
							formState.setFieldValue('type', type.id);
							onChange();
						}}>
							<View style={[
								styles.input,
								(selected)
									? { backgroundColor: SWATCHES.tint }
									: {}
							]}>
								<Text inverted={selected}>{type.label}</Text>
							</View>
						</Touch>
					)
				}}
			/>
			<FieldError error={formState.error?.fieldErrors?.type} />
		</>
	);
}


// TODO: move all forms into small components like this
// this way, formstate ONLY re-renders the form, not anything outside it
const EditForm = (props) => {
	const dispatch = useDispatch();
	const { tldr, authentication } = props;
 
	const formState = useFormState({
		initialFields: {
			title: '',
			body: '',
			type: null
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
			tldrId: tldr.data.id,
			status: ISSUE_STATUS.OPEN 
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

	const [formStep, setFormStep] = useState(0);

	return(
		<form>
			<RevealBlock visible={formStep >= 0} delay={300}>
				<Chunk>
					<Label>What is busted about this?</Label>
					<TypeField 
						formState={formState} 
						/>
					{(formStep == 0) &&
						<Chunk>
							<Button
								onPress={() => {
									const error = runValidations(formState.fields, {
										type: {
											notNull: {
												msg: "Pick an issue type"
											},
										},
									});
									formState.setError(error);
									if (!error) {
										setFormStep(1);
									}
								}}
								label="Next"
							/>
						</Chunk>
						}	
				</Chunk>
			</RevealBlock>
			<RevealBlock visible={formStep >= 1} scrollIntoView={true}>
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
			</RevealBlock>
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
								<Text type="small" color="secondary">
									<Link href={getTldrPageUrl({tldrId: tldr.data.id})}>
										{tldr.data.author.urlKey}/{tldr.data.urlKey}  
									</Link>
									&nbsp;&raquo;&nbsp;
									<Link href={getIssuesPageUrl({tldrId: tldr.data.id})}>
										issues 
									</Link>
								</Text>
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



