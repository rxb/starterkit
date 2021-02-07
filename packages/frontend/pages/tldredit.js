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

	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch,
	View,
	useFormState
} from '../components/cinderblock';
import styles from '@/components/cinderblock/styles/styles';
import swatches from '@/components/cinderblock/styles/swatches';


import Page from '../components/Page';
import { authentication } from '@feathersjs/client';


const inputJoinedTop = {
	marginBottom: 0, 
	borderBottomLeftRadius: 0, 
	borderBottomRightRadius: 0, 
	zIndex: 1
};
const inputJoinedBottom = {
	marginTop: -1, 
	borderTopLeftRadius: 0, 
	borderTopRightRadius: 0,  
	zIndex: 1
};

const TldrForm = (props) => {

	const dispatch = useDispatch();

	const {
		tldrData,
		authentication
	} = props;


	const formState = useFormState({
		initialFields: {
			...tldrData.draftContent,
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
				<TextInput
					style={[styles.textPageHead, inputJoinedTop]}
					id="title"
					value={formState.getFieldValue('title')}
					onChange={e => formState.setFieldValue('title', e.target.value) }
					/>
				<FieldError error={formState.errors?.fieldErrors?.title} />	
				<TextInput
					style={[{fontStyle: 'italic'}, inputJoinedBottom]}
					id="blurb"
					value={formState.getFieldValue('blurb')}
					onChange={e => formState.setFieldValue('blurb', e.target.value) }
					/>
				<FieldError error={formState.errors?.fieldErrors?.blurb} />
			</Chunk>

			{ formState.getFieldValue('steps')?.map((item, i)=>(
				<Chunk>

					<View 
						style={{paddingLeft: 14}}
						>
					<View 
						style={{
							position: 'absolute',
							top: 3,
							bottom: 3,
							left: 0,
							width: 4,
							backgroundColor: swatches.border,
						}}
						/>
						<TextInput
							style={[styles.textBig, inputJoinedTop]}
							id={`step${i}head`}
							value={item.head}
							onChange={e => formState.setFieldValue('steps', [
								...formState.getFieldValue('steps').slice(0, i),
								{...item, head: e.target.value},
								...formState.getFieldValue('steps').slice(i + 1)
							]) }
							/>
						<TextInput
							style={[styles.textSecondary, inputJoinedBottom]}
							id={`step${i}body`}
							value={item.body}
							onChange={e => formState.setFieldValue('steps', [
								...formState.getFieldValue('steps').slice(0, i),
								{...item, body: e.target.value},
								...formState.getFieldValue('steps').slice(i + 1)
							]) }
							/>
					</View>
				</Chunk>
			))}

				
			{/*
			<Chunk>
				<Label for="draftContent">Card content</Label>
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
			*/}

			<Chunk>
				<Flex nbsp>
					<FlexItem nbsp shrink>
						<Button
							color="secondary"
							label="Save draft"
							isLoading={formState.loading && !formState.getFieldValue('publish')}
							onPress={ () => {
								submitForm({publish: false});
							}}				
							/>
					</FlexItem>
					<FlexItem nbsp shrink>
						<Button
							color="primary"
							label="Publish"
							isLoading={formState.loading && formState.getFieldValue('publish')}
							onPress={ () => {
								submitForm({publish: true});
							}}
							/>						
					</FlexItem>
				</Flex>


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
							<Flex direction="column" switchDirection="medium">
								<FlexItem growFactor={2}>
									<Section>
										<Chunk>
											<Text type="big">/rxb/whatever v1.2</Text>
										</Chunk>

										{ tldrData &&
										<TldrForm
											tldrData={tldrData}
											authentication={authentication}
											/>
										}
									</Section>
								</FlexItem>
								
							</Flex>

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

