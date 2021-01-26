import React, {Fragment} from 'react';
import Router from 'next/router'
import Head from 'next/head'

import {
	useShow,
	useTags,
	patchShow,
} from '../swr';


// Redux
import {connect, useDispatch, useSelector} from 'react-redux';


import {
	addToast,
	fetchShow,
	fetchTags,
} from '../actions';


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


import styles from '../components/cinderblock/styles/styles';
import Page from '../components/Page';
import ShowCard from '../components/ShowCard';

import { runValidations, readFileAsDataUrl, checkToastableErrors } from '../components/cinderblock/formUtils';
import { authentication } from '@feathersjs/client';


const ShowForm = (props) => {

	const {
		showData,
		tagsData
	} = props;

	const formState = useFormState({ 
		initialFields: {
			title: showData.title,
			photoUrl: showData.photoUrl,
			photoId: showData.photoId,
			id: showData.id,
			genres: showData.genres,
			tags: showData.tags,
			description: showData.description
		},
	});

	const submitEditForm = async ()=> {
		
		// NOTE: if you're going to add client validation rules, they should match up with server rules, but most of the time you don't  need both unless doing optimitstic updates
		const error = runValidations(formState.fields, {
			title: {
				 isLength: {
					 args: {min: 1},
					 msg: "Title can't be blank"
				 },
				 notContains: {
					 args: "garbage",
					 msg: "No shows about garbage, please"
				 }
			 }
		 });
		formState.setError(error);

		if(!error){
			formState.setLoading(true);

			// photo process
			const {photoNewFile, ...showFields} = formState.fields;
			if(photoNewFile){
				showFields.uri = await readFileAsDataUrl(photoNewFile);
			}

			try{
				const response = await patchShow(showFields.id, showFields, authentication.token)
				Router.push({pathname:'/show', query: {showId: showData.id}})
					.then(()=>{
						//props.addToast('Show saved; nice work!');
					})
		  	}
			catch(error){
				formState.setError(error);
				formState.setLoading(false);
			}
	}}

	

	return(
		<form>
			<Chunk>
				<Label for="title">Show title</Label>
				<TextInput
					id="title"
					value={formState.getFieldValue('title')}
					onChange={e => formState.setFieldValue('title', e.target.value) }
					/>
				<FieldError error={formState.error?.fieldErrors?.title} />
			</Chunk>
			<Chunk>
				<Label for="description">Description</Label>
				<TextInput
					id="description"
					value={formState.getFieldValue('description')}
					onChange={e => formState.setFieldValue('description', e.target.value) }
					multiline
					numberOfLines={4}
					showCounter={true}
					maxLength={1000}
					/>
				<FieldError error={formState.error?.fieldErrors?.description} />
			</Chunk>
			<Chunk>
				<Label for="title">Genres</Label>
				{(['Comedy', 'Drama', 'Documentary']).map((item, i)=>{
					const checked = formState.getFieldValue('genres').indexOf(item) != -1;
					return(
						<CheckBox
							key={item}
							label={item}
							value={checked}
							onChange={() => {
								const newItems = (checked) ?  formState.getFieldValue('genres').filter(a => a !== item) : formState.getFieldValue('genres').concat([item]);
								formState.setFieldValue('genres', newItems)
							}}
							/>

					);
				})}
				<View>

				</View>
			</Chunk>
			<Chunk>
				<Label>Your photo</Label>
				<Flex>
					<FlexItem>
						<FileInput
							id="photo"
							placeholder={(formState.getFieldValue('photoUrl')) ? 'Select a new file' : 'Select a file'}
							onChangeFile={(file)=>{
								// comes from server, doesn't get sent back to server
								formState.setFieldValue('photoUrl', URL.createObjectURL(file))
								// comes from server, gets sent back to server
								formState.setFieldValue('photoId', false)
								// only exists client -> server
								formState.setFieldValue('photoNewFile', file)
							}}
							/>
						{ formState.getFieldValue('photoUrl') &&
							<FakeInput
								label="Remove photo"
								shape="X"
								onPress={()=>{
									formState.setFieldValue('photoId', false)
									formState.setFieldValue('photoUrl', false)
								}}
								/>
						}
					</FlexItem>
					{ formState.getFieldValue('photoUrl') &&
						<FlexItem shrink>
							<Image
							    source={{uri: formState.getFieldValue('photoUrl') }}
							    style={[{
							          width: 120,
							          flex: 1,
							          resizeMode: 'cover',
							          borderRadius: 4,
							          boxSizing: 'content-box'
							    }, styles.pseudoLineHeight]}
							    />
						</FlexItem>
					}
				</Flex>
			</Chunk>

			<Chunk>
				<Label for="title">Tags</Label>
				{tagsData && tagsData.map((item, i)=>{
					const checked = formState.getFieldValue('tags').findIndex( tag => tag.id == item.id ) != -1;
					return(
						<CheckBox
							key={String(item.id)}
							label={item.label}
							value={checked}
							onChange={() => {
								const {id, label} = item;
								// keep an obj with id and label
								// with the idea that maybe an obj with label and without id would be created
								const newItems = (checked) ?
									formState.getFieldValue('tags').filter(a => a.id !== id) :
									formState.getFieldValue('tags').concat([{id, label}]);
								formState.setFieldValue('tags', newItems);
							}}
							/>
					);
				})}
			</Chunk>
			<Chunk>
				<Button
					type="primary"
					label="Let's do this"
					onPress={ submitEditForm }
					isLoading={formState.loading}
					/>
			</Chunk>
		</form>
	);
};




function ShowEdit(props) {

	/*
	componentDidMount(){
		this.props.fetchShow(this.props.showId);
		this.props.fetchTags();
	}

	componentDidUpdate(prevProps){

		// watching for toastable errors
		// still feel like maybe this could go with form?
		// ^^^^ oh good, previous me is being proven correct
		const messages = {
			show: {
				BadRequest: 'Something went wrong',
				NotAuthenticated: 'Not signed in'
			}
		};
		checkToastableErrors(this.props, prevProps, messages);

	}
	*/

	const { data: showData, error: showError } = useShow(props.showId);
	const { data: tagsData, error: tagsError } = useTags();

		return (
			<Page>
				<Head>
					<meta property='og:title' content='Scratch' />
					<title>Edit show</title>
				</Head>
				<Stripe>
					<Bounds>
						<Sections>
							<Section type="pageHead">
								<Chunk>
									<Text type="pageHead">Edit show</Text>
								</Chunk>
							</Section>
							{showData && 
								<Flex direction="column" switchDirection="medium">
								<FlexItem growFactor={2}>
									<Section>
										{ showData.id &&
										<ShowForm
											showData={showData}
											tagsData={tagsData}
											/>
										}
									</Section>
								</FlexItem>
								<FlexItem growFactor={1} style={{minWidth: 'inherit'}}>
									<Section>
										<Chunk>
											<Text color="hint" style={{maxWidth: '100%'}}>{JSON.stringify(showData, null, " ")}</Text>
										</Chunk>
									</Section>

								</FlexItem>
							</Flex>
							}
						</Sections>
					</Bounds>
				</Stripe>
			</Page>
		);
}

ShowEdit.getInitialProps = async (context) => {
	const {query} = context;
	return {
		showId: query.showId
	}
}



export default ShowEdit;

