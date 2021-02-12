import React, {Fragment, useState, useCallback} from 'react';

import {
	fetcher,
	patchTldr,
	useTldr
} from '../swr';

import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast, addDelayedToast } from '../actions';

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
	Reorderable,
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
import {METRICS} from '@/components/cinderblock/designConstants';


import Page from '../components/Page';
import { authentication } from '@feathersjs/client';

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

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
			// steps need stable IDs for reordering
			steps: tldrData.draftContent.steps?.map( (step,i) => ({...step, id: i}) ), 
			id: tldrData.id,
			publish: false
		},
		toastableErrors: {
			BadRequest: 'Something went wrong',
			NotAuthenticated: 'Not signed in'
		},
		addToast: msg => dispatch(addToast(msg))
	})

	const moveStep = useCallback((dragIndex, hoverIndex) => {
		const dragItem = formState.getFieldValue('steps')[dragIndex];
		const newSteps = [...formState.getFieldValue('steps')];
		newSteps.splice(dragIndex, 1);
		newSteps.splice(hoverIndex, 0, dragItem);
		formState.setFieldValue('steps', newSteps);
	}, [formState.getFieldValue('steps')]);


	const submitForm = async(finalFields={}) => {
		// state set is async, so while we're settings them setFields, we don't know when they'll update
		// so for this function, we'll use a local copy, manually updated.
		formState.setFieldValues(finalFields);
		
		const patchFields = {
			...finalFields,
			id: tldrData.id,
			draftContent: {
				title: formState.fields.title,
				blurb: formState.fields.blurb,
				steps: formState.fields.steps.map(item => {
						delete item.id
						return item;
					}).filter(item => (item.head && item.head.length || item.body && item.body.length) )
			}
		}

		formState.setLoading(true);
		try{
			await patchTldr(tldrData.id, patchFields, {token: authentication.accessToken})
			const toastMessage = (patchFields.publish) ? "New TLDR version published!" : "TLDR draft saved!"
			dispatch(addDelayedToast(toastMessage));
			Router.push({pathname:'./tldr', query: {tldrId: tldrData.id}})
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

			<DndProvider backend={HTML5Backend}>
				{formState.getFieldValue('steps')?.map((item, i)=>(
					<Reorderable key={item.id} index={i} id={item.id} moveItem={moveStep}>
						<Chunk>
							<View 
								style={{paddingLeft: 16}}
								>
							<View 
								style={{
									position: 'absolute',
									top: 6,
									bottom: 6,
									left: 0,
									width: 12,
									backgroundColor: swatches.border,
									borderRadius: METRICS.borderRadius,
									cursor: 'pointer'
								}}
								/>
								<TextInput
									style={[styles.textBig, inputJoinedTop]}
									id={`step${i}head`}
									value={item.head}
									multiline
									placeholder="Bulletpoint headline"
									onChange={e => formState.setFieldValue('steps', [
										...formState.getFieldValue('steps').slice(0, i),
										{...item, head: e.target.value},
										...formState.getFieldValue('steps').slice(i + 1)
									]) }
									/>
								<TextInput
									style={[inputJoinedBottom]}
									id={`step${i}body`}
									value={item.body}
									multiline
									placeholder="Bulletpoint description"
									onChange={e => formState.setFieldValue('steps', [
										...formState.getFieldValue('steps').slice(0, i),
										{...item, body: e.target.value},
										...formState.getFieldValue('steps').slice(i + 1)
									]) }
									/>
							</View>
						</Chunk>
					</Reorderable>
				))}
			</DndProvider>
			
			<Touch onPress={()=>{
					formState.setFieldValue('steps', [
						...formState.getFieldValue('steps'),
						{title: '', body: '', id: formState.getFieldValue('steps').length},
					])
				}}>
				<Chunk inline>
					<Icon shape="PlusCircle" />
					<Text> Add new item</Text>
				</Chunk>
			</Touch>

			<Chunk border>
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
										<Chunk inline>
											<Avatar size="small" source={{uri: 'https://randomuser.me/api/portraits/women/40.jpg'}} />
											<Text weight="strong"> /rxb/whatever v1.2</Text>
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

