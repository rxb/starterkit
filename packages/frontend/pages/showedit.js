import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Router from 'next/router'
import Head from 'next/head'


import {
	addToast,
	fetchShow,
	fetchTags,
	createShow,
	patchShow,
	updateErrorShow
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
	withFormState
} from '../components/cinderblock';


import styles from '../components/cinderblock/styles/styles';
import Page from '../components/Page';
import ShowCard from '../components/ShowCard';

import { runValidations, readFileAsDataUrl, checkToastableErrors } from '../components/cinderblock/formUtils';


const ShowForm = withFormState((props) => {

	const {
		fields,
		setFieldState,
		handleSubmit,
		resetFields,
		fieldErrors = {},
		tags,
	} = props;

	return(
		<form>
			<Chunk>
				<Label for="title">Show title</Label>
				<TextInput
					id="title"
					value={fields.title}
					onChange={e => setFieldState({title: e.target.value}) }
					/>
				<FieldError error={fieldErrors.title} />
			</Chunk>
			<Chunk>
				<Label for="description">Description</Label>
				<TextInput
					id="description"
					value={fields.description}
					onChangeText={text => setFieldState({description: text}) }
					multiline
					numberOfLines={4}
					showCounter={true}
					maxLength={1000}
					/>
				<FieldError error={fieldErrors.description} />
			</Chunk>
			<Chunk>
				<Label for="title">Genres</Label>
				{(['Comedy', 'Drama', 'Documentary']).map((item, i)=>{
					const checked = fields.genres.indexOf(item) != -1;
					return(
						<CheckBox
							key={item}
							label={item}
							value={checked}
							onChange={() => {
								const newItems = (checked) ?  fields.genres.filter(a => a !== item) : fields.genres.concat([item]);
								setFieldState({genres: newItems})
							}}
							/>

					);
				})}
			</Chunk>
			<Chunk>
				<Label>Your photo</Label>
				<Flex>
					<FlexItem>
						<FileInput
							id="photo"
							placeholder={(fields.photoUrl) ? 'Select a new file' : 'Select a file'}
							onChangeFile={(file)=>{
								setFieldState({
									// comes from server, doesn't get sent back to server
									photoUrl:  URL.createObjectURL(file),
									// comes from server, gets sent back to server
									photoId: false,
									// only exists client -> server
									photoNewFile: file
								});
							}}
							/>
						{ fields.photoUrl &&
							<FakeInput
								label="Remove photo"
								shape="X"
								onPress={()=>{
									setFieldState({
										photoId: false,
										photoUrl: false
									});
								}}
								/>
						}
					</FlexItem>
					{ fields.photoUrl &&
						<FlexItem shrink>
							<Image
							    source={{uri: fields.photoUrl }}
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
				{tags.items.map((item, i)=>{
					const checked = fields.tags.findIndex( tag => tag.id == item.id ) != -1;
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
									fields.tags.filter(a => a.id !== id) :
									fields.tags.concat([{id, label}]);
								setFieldState({tags: newItems});
							}}
							/>
					);
				})}
			</Chunk>
			<Chunk>
				<Button
					type="primary"
					label="Let's do this"
					onPress={ handleSubmit }
					/>
			</Chunk>
		</form>
	);
});




class ShowTest extends React.Component {

	static async getInitialProps (context) {
		const {store, isServer, pathname, query} = context;
		const showId = query.showId;
		return {
			showId
		}
	}

	constructor(props){
		super(props);
		this.state = {}
	}

	componentDidMount(){
		this.props.fetchShow(this.props.showId);
		this.props.fetchTags();
	}

	componentDidUpdate(prevProps){

		// watching for toastable errors
		// still feel like maybe this could go with form?
		const messages = {
			show: {
				BadRequest: 'Something went wrong',
			}
		};
		checkToastableErrors(this.props, prevProps, messages);

	}

	render() {

		const {
			show,
			tags,
			createShow,
			patchShow,
			updateErrorShow
		} = this.props;

		console.log(show);

		return (
			<Fragment>
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
							<Flex direction="column" switchDirection="medium">
								<FlexItem growFactor={2}>
									<Section>
										{ show.item.id &&
										<ShowForm
											initialFields={{
												title: show.item.title,
												photoUrl: show.item.photoUrl,
												photoId: show.item.photoId,
												id: show.item.id,
												genres: show.item.genres,
												tags: show.item.tags,
												description: show.item.description
											}}
											fieldErrors={show.error.fieldErrors}
											onSubmit={ async (fields)=>{

												// client-side validation rules
												// should match up with server rules
												// don't always need both unless speed is paramount
												// or doing something like optimistic UI
 												const validators = {
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
										        }

										        // client-side validation
										        const error = runValidations(fields, validators);
										        updateErrorShow(error);

										        // if not client errors...
										        if(!error.errorCount){

										        	// photo process
													const {photoNewFile, ...showFields} = fields;
													if(photoNewFile){
														showFields.uri = await readFileAsDataUrl(photoNewFile);
													}

													// patch & redirect & toast (if no server errors)
													patchShow(showFields.id, showFields)
														.then( response => {
															if(!response.error){
																Router.push({pathname:'/show', query: {showId: show.item.id}})
																	.then(()=>{
																		this.props.addToast('Show saved; nice work!');
																	})
															}
														});
										        }
											}}
											onChange={(fields) => {
												this.setState({showFormFields: fields});
											}}
											tags={tags}
											/>
										}


									</Section>
								</FlexItem>
								<FlexItem growFactor={1}>

									<Section>
										<Chunk>
											<Text>{JSON.stringify(show.item)}</Text>
										</Chunk>
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
}


const mapStateToProps = (state, ownProps) => {
	return ({
		show: state.show,
		tags: state.tags
	});
}

const actionCreators = {
	addToast,
	fetchShow,
	fetchTags,
	createShow,
	patchShow,
	updateErrorShow
};

export default connect(
	mapStateToProps,
	actionCreators
)(ShowTest);

