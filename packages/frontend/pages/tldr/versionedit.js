import React, {Fragment, useState, useCallback, useEffect, useRef} from 'react';

import {
	fetcher,
	patchTldr,
	getTldrUrl,
} from '@/swr';

import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast, addDelayedToast } from '@/actions';

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
	Tabs,
	Text,
	TextInput,
	Touch,
	View,
	useFormState
} from '@/components/cinderblock';
import styles from '@/components/cinderblock/styles/styles';
import swatches from '@/components/cinderblock/styles/swatches';
import {METRICS} from '@/components/cinderblock/designConstants';

import Page from '@/components/Page';
import TldrHeader from '@/components/TldrHeader';
import {TldrCardSmall, TldrCard} from './components';

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


function VersionEdit(props) {

	const { tldr } = props
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};
	const [previewVersion, setPreviewVersion] = useState({
		version: (tldr.currentTldrVersion.version + 1),
		content: tldr.draftContent
	});
	const [selectedTab, setSelectedTab] = useState('edit');



	const parseDraftContent = (fields) => {
		return {
			title: fields.title,
			blurb: fields.blurb,
			steps: fields.steps.map(item => {
				delete item.id
				return item;
			}).filter(item => (item.head && item.head.length || item.body && item.body.length) )
		}
	};


	const formState = useFormState({
		initialFields: {
			...tldr.draftContent,
			// steps need stable IDs for reordering
			steps: tldr.draftContent.steps?.map( (step,i) => ({...step, id: i}) ), 
			id: tldr.id,
			publish: false
		},
		toastableErrors: {
			BadRequest: 'Something went wrong',
			NotAuthenticated: 'Not signed in'
		},
		onChange: fields => {
			const content = parseDraftContent(fields)
			setPreviewVersion({
				...previewVersion,
				content: content 
			})
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
			id: tldr.id,
			draftContent: parseDraftContent(formState.fields)
		}

		formState.setLoading(true);
		try{
			await patchTldr(tldr.id, patchFields, {token: authentication.accessToken})
			const toastMessage = (patchFields.publish) ? "New TLDR version published!" : "TLDR draft saved!"
			dispatch(addDelayedToast(toastMessage));
			Router.push({pathname:'./tldr', query: {tldrId: tldr.id}})
		}
		catch(error){
			console.log(error);
			formState.setError(error);
			formState.setLoading(false);
		}
	}
	


		return (
			<Page>
				<TldrHeader />
				<Head>
					<title>Edit tldr</title>
				</Head>
				<Stripe>
					<Bounds>
						<Sticky>
							<Section>
								<Tabs 
									selectedValue={selectedTab}
									onChange={ value => setSelectedTab(value) }
									>
									<Tabs.Item 
										label="Edit" 
										value="edit" 
										/>
									<Tabs.Item 
										label="Preview" 
										value="preview" 
										/>
								</Tabs>
							</Section>
						</Sticky>

							<form>

								<Section>

									{ (selectedTab == 'edit') &&
									<>
										<Chunk>
											<TextInput
												style={[styles.textPageHead, inputJoinedTop]}
												id="title"
												placeholder="Title"
												value={formState.getFieldValue('title')}
												onChange={e => formState.setFieldValue('title', e.target.value) }
												/>
											<FieldError error={formState.errors?.fieldErrors?.title} />	
											<TextInput
												style={[{fontStyle: 'italic'}, inputJoinedBottom]}
												id="blurb"
												placeholder="Short description"
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
									</>

									}

									{ (selectedTab == 'preview') &&
										<TldrCard 
											tldr={tldr}
											thisVersion={previewVersion} 
											/>
									}	
								</Section>

								<Section>
									<Chunk border={selectedTab == 'edit'}>
										<Flex >
											<FlexItem shrink>
												<Button
													color="secondary"
													label="Save as draft"
													isLoading={formState.loading && !formState.getFieldValue('publish')}
													onPress={ () => {
														submitForm({publish: false});
													}}				
													/>
											</FlexItem>
											<FlexItem shrink>
												<Button
													color="primary"
													label={`Publish as new version (v.${previewVersion.version})`}
													isLoading={formState.loading && formState.getFieldValue('publish')}
													onPress={ () => {
														submitForm({publish: true});
													}}
													/>						
											</FlexItem>
										</Flex>
									</Chunk>
									</Section>
								</form>

					</Bounds>
				</Stripe>
			</Page>
		);
	
}

VersionEdit.getInitialProps = async(context) => {
	const {store, isServer, pathname, query} = context;
	const tldrId = query.tldrid; // query params become lowercase
	const tldr = await fetcher(getTldrUrl(tldrId));
	return {
		tldrId,
		tldr
	}
}

export default VersionEdit;


import { useInView } from 'react-intersection-observer';
const Sticky = (props) => {
	const [ref, inView, entry] = useInView({threshold: 1});
	return (
		<View 
			ref={ref}
			style={{zIndex: 2, position: 'sticky', top: -1, marginBottom: METRICS.space, backgroundColor: (inView) ? 'white' :'blue'}}
			>
			{props.children}
		</View>
	);
}

