import React, {Fragment, useState} from 'react';

import {
	fetcher,
	patchTldr,
	useTldr
} from '../swr';

import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast } from '../actions';




import Router from 'next/router'
import Head from 'next/head'

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
	Section,
	Sections,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch,
	View,
	useFormState
} from '../components/cinderblock';


import Page from '../components/Page';
import { authentication } from '@feathersjs/client';



const TldrForm = (props) => {

	const {
		tldrData,
		authentication
	} = props;

	const dispatch = useDispatch();

	const formState = useFormState({
		initialFields: {
			draftContent: JSON.stringify(tldrData.draftContent, null, 2),
			id: tldrData.id,
			publish: false
		},
		toastableErrors: {
			BadRequest: 'Something went wrong',
			NotAuthenticated: 'Not signed in'
		},
		addToast: msg => dispatch(addToast(msg))
	})

	const submitForm = async(finalFields={}) => {
		// state set is async, so while we're settings them setFields, we don't know when they'll update
		// so for this function, we'll use a local copy, manually updated.
		formState.setFieldValues(finalFields);
		const fieldsCopy = {
			...formState.fields,
			...finalFields
		}

		// parsing text back into json json
		fieldsCopy.draftContent = JSON.parse(fieldsCopy.draftContent);

		formState.setLoading(true);
		try{
			await patchTldr(tldrData.id, fieldsCopy, {token: authentication.accessToken})
			Router.push({pathname:'/tldr', query: {tldrId: tldrData.id}})
				.then(()=>{
					dispatch(addToast('tldr saved; nice work!'));
				})
		}
		catch(error){
			console.log(error);
			formState.setError(error);
			formState.setLoading(false);
		}
		
	
	}
	
	return(
		<form>
			<Chunk>
				<Label for="description">Card content</Label>
				<TextInput
					id="draftContent"
					value={formState.getFieldValue('draftContent')}
					onChange={e => formState.setFieldValue('draftContent', e.target.value) }
					multiline
					numberOfLines={10}
					showCounter={true}
					/>
				<FieldError error={formState.errors?.fieldErrors?.draftContent} />
			</Chunk>

			<Chunk>
				<Button
					color="primary"
					label="Publish"
					isLoading={formState.loading && formState.getFieldValue('publish')}
					onPress={ () => {
						submitForm({publish: true});
					}}
					/>
				<Button
					color="secondary"
					label="Save draft"
					isLoading={formState.loading && !formState.getFieldValue('publish')}
					onPress={ () => {
						submitForm({publish: false});
					}}				
					/>
			</Chunk>
		</form>
	);
};




function TldrEdit(props) {

	const {data: tldrData, error: tldrError, mutate: tldrMutate} = useTldr(props.tldrId);

	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

		return (
			<Fragment>
			<Page>
				<Head>
					<title>Edit tldr</title>
				</Head>
				<Stripe>
					<Bounds>
						<Sections>
							<Section type="pageHead">
								<Chunk>
									<Text type="pageHead">Edit TLDR</Text>
								</Chunk>
							</Section>
							<Flex direction="column" switchDirection="medium">
								<FlexItem growFactor={2}>
									<Section>
										{ tldrData &&
										<TldrForm
											tldrData={tldrData}
											authentication={authentication}
											/>
										}
									</Section>
								</FlexItem>
								
							</Flex>
						</Sections>
					</Bounds>
				</Stripe>
			</Page>
			</Fragment>
		);
	
}

TldrEdit.getInitialProps = async(context) => {
	const {store, isServer, pathname, query} = context;
	const tldrId = query.tldrId || 2; // hardcode for now
	return {
		tldrId
	}
}


export default TldrEdit;

