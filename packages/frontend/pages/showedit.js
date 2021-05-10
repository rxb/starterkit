import React, {Fragment} from 'react';

// SWR
import {
	request,
	pageHelper,
	getShowUrl,
	getTagsUrl
} from '../swr';
import useSWR, { mutate }  from 'swr';

// REDUX
import {connect, useDispatch, useSelector} from 'react-redux';
import { addToast, addDelayedToast } from '../actions';

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
	PhotoInput,
	Picker,
	Section,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch,
	View,
	useFormState
} from 'cinderblock';
import CinderblockPage from '../components/starterkit/CinderblockPage';
import Router from 'next/router'
import Head from 'next/head'

// STYLE
import {styles} from 'cinderblock';

// SCREEN-SPECFIC
import {Utils} from 'cinderblock';
const { runValidations, readFileAsDataUrl } = Utils;


const ShowForm = (props) => {

	const dispatch = useDispatch();

	const {
		showData,
		tagsData,
		authentication,
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
		toastableErrors: {
			BadRequest: 'Something went wrong',
			NotAuthenticated: 'Not signed in'
		},
		addToast: msg => dispatch(addToast(msg))
	});

	const submitEditForm = async ()=> {
		

		// client-side validations
		// just for example here. client-side mostly makes sense for optimistic updates
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
		console.log(error);

		if(!error){
			formState.setLoading(true);

			// photo process
			const {photoNewFile, ...showFields} = formState.fields;
			if(photoNewFile){
				showFields.dataUri = await readFileAsDataUrl(photoNewFile);
			}

			try{
				const response = await request( getShowUrl(showData.id), {
					method: 'PATCH', 
					data: showFields,
					token: authentication.accessToken
				});
				dispatch(addDelayedToast('Show saved; nice work!'));
				Router.push({pathname:'/show', query: {showId: showData.id}})
		  	}
			catch(error){
				formState.setError(error);
				formState.setLoading(false);
			}
		}
		else{
			console.log('error?')
		}
		console.log('end submit')
	}

	

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
				<PhotoInput 
					fileState={{
						preview: formState.getFieldValue('photoUrl'),
						file: formState.getFieldValue('photoNewFile')
					}}
					onChangeFile={(fileState)=>(
						formState.setFieldValues({
							/* comes from server, doesn't get sent back to server */
							photoUrl: fileState.filepreview,
							/* comes from server, gets sent back to server */
							photoId: false,
							/* only exists client -> server */
							photoNewFile: fileState.file
						})
					)}
					/>
				<FieldError error={formState.error?.fieldErrors?.photoUrl} />

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
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

	const show = useSWR( getShowUrl(props.showId) );
	const { data: showData, error: showError } = show;
	
	const tags = useSWR( getTagsUrl() );
	const tagsData = tags.data ? tags.data.items : [];

		return (
			<CinderblockPage>
				<Head>
					<meta property='og:title' content='Scratch' />
					<title>Edit show</title>
				</Head>
				<Stripe>
					<Bounds>

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
											authentication={authentication}
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

					</Bounds>
				</Stripe>
			</CinderblockPage>
		);
}

ShowEdit.getInitialProps = async (context) => {
	const {query} = context;
	return {
		showId: query.showId
	}
}



export default ShowEdit;

