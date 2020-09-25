import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Router from 'next/router'
import Head from 'next/head'


import {
	addToast,
	fetchTldr,
	createTldr,
	patchTldr,
	updateErrorTldr
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
import TldrVersionCard from '../components/TldrVersionCard';

import { runValidations, readFileAsDataUrl, checkToastableErrors } from '../components/cinderblock/formUtils';


const TldrVersionForm = withFormState((props) => {

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
				<Label for="title">TldrVersion title</Label>
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
					tldrVersionCounter={true}
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
				<View>

				</View>
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




class TldrVersionTest extends React.Component {

	static async getInitialProps (context) {
		const {store, isServer, pathname, query} = context;
		const tldrVersionId = query.tldrVersionId;
		return {
			tldrVersionId
		}
	}

	constructor(props){
		  (props);
		this.state = {}
	}

	componentDidMount(){
		this.props.fetchTldrVersion(this.props.tldrVersionId);
		this.props.fetchTags();
	}

	componentDidUpdate(prevProps){

		// watching for toastable errors
		// still feel like maybe this could go with form?
		const messages = {
			tldrVersion: {
				BadRequest: 'Something went wrong',
				NotAuthenticated: 'Not signed in'
			}
		};
		checkToastableErrors(this.props, prevProps, messages);

	}

	render() {

		const {
			tldrVersion,
			tags,
			createTldrVersion,
			patchTldrVersion,
			updateErrorTldrVersion
		} = this.props;

		return (
			<Fragment>
			<Page>
				<Head>
					<meta property='og:title' content='Scratch' />
					<title>Edit tldrVersion</title>
				</Head>
				<Stripe>
					<Bounds>
						<Sections>
							<Section type="pageHead">
								<Chunk>
									<Text type="pageHead">Edit tldrVersion</Text>
								</Chunk>
							</Section>
							<Flex direction="column" switchDirection="medium">
								<FlexItem growFactor={2}>
									<Section>
										{ tldrVersion.item.id &&
										<TldrVersionForm
											initialFields={{
												title: tldrVersion.item.title,
												photoUrl: tldrVersion.item.photoUrl,
												photoId: tldrVersion.item.photoId,
												id: tldrVersion.item.id,
												genres: tldrVersion.item.genres,
												tags: tldrVersion.item.tags,
												description: tldrVersion.item.description
											}}
											fieldErrors={tldrVersion.error.fieldErrors}
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
											        		msg: "No tldrVersions about garbage, please"
											        	}
										        	}
										        }

										        // client-side validation
										        const error = runValidations(fields, validators);
										        updateErrorTldrVersion(error);

										        // if not client errors...
										        if(!error.errorCount){

										        	// photo process
													const {photoNewFile, ...tldrVersionFields} = fields;
													if(photoNewFile){
														tldrVersionFields.uri = await readFileAsDataUrl(photoNewFile);
													}

													// patch & redirect & toast (if no server errors)
													patchTldrVersion(tldrVersionFields.id, tldrVersionFields)
														.then( response => {
															if(!response.error){
																Router.push({pathname:'/tldrVersion', query: {tldrVersionId: tldrVersion.item.id}})
																	.then(()=>{
																		this.props.addToast('TldrVersion saved; nice work!');
																	})
															}
														});
										        }
											}}
											onChange={(fields) => {
												this.setState({tldrVersionFormFields: fields});
											}}
											tags={tags}
											/>
										}


									</Section>
								</FlexItem>
								<FlexItem growFactor={1}>

									<Section>
										<Chunk>
											<Text>{JSON.stringify(tldrVersion.item)}</Text>
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
		tldrVersion: state.tldrVersion,
		tags: state.tags
	});
}

const actionCreators = {
	addToast,
	fetchTldrVersion,
	fetchTags,
	createTldrVersion,
	patchTldrVersion,
	updateErrorTldrVersion
};

export default connect(
	mapStateToProps,
	actionCreators
)(TldrVersionTest);

