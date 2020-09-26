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

import { runValidations, readFileAsDataUrl, checkToastableErrors } from '../components/cinderblock/formUtils';


const TldrForm = withFormState((props) => {

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
				<Label for="description">Card content</Label>
				<TextInput
					id="draftContent"
					value={fields.draftContent}
					onChangeText={text => setFieldState({draftContent: text}) }
					multiline
					numberOfLines={4}
					showCounter={true}
					maxLength={1000}
					/>
				<FieldError error={fieldErrors.draftContent} />
			</Chunk>
			<Chunk>
				<Button
					color="primary"
					label="Publish"
					onPress={ handleSubmit }
					/>
				<Button
					color="secondary"
					label="Save draft"
					onPress={ handleSubmit }
					/>
			</Chunk>
		</form>
	);
});




class TldrEdit extends React.Component {

	static async getInitialProps (context) {
		const {store, isServer, pathname, query} = context;
		const tldrId = query.tldrId;
		return {
			tldrId
		}
	}

	constructor(props){
		super(props);
		this.state = {}
	}

	componentDidMount(){
		this.props.fetchTldr(this.props.tldrId);
	}

	componentDidUpdate(prevProps){

		// watching for toastable errors
		// still feel like maybe this could go with form?
		const messages = {
			tldr: {
				BadRequest: 'Something went wrong',
				NotAuthenticated: 'Not signed in'
			}
		};
		checkToastableErrors(this.props, prevProps, messages);

	}

	render() {

		const {
			tldr,
			tags,
			createtldr,
			patchtldr,
			updateErrortldr
		} = this.props;

		return (
			<Fragment>
			<Page>
				<Head>
					<meta property='og:title' content='Scratch' />
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
										{ tldr.item.id &&
										<TldrForm
											initialFields={{
												draftContent: JSON.stringify(tldr.item.draftContent, null, 2)
											}}
											fieldErrors={tldr.error.fieldErrors}
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
											        		msg: "No tldrs about garbage, please"
											        	}
										        	}
										        }

										        // client-side validation
										        const error = runValidations(fields, validators);
										        updateErrortldr(error);

										        // if not client errors...
										        if(!error.errorCount){

										        	// photo process
													const {photoNewFile, ...tldrFields} = fields;
													if(photoNewFile){
														tldrFields.uri = await readFileAsDataUrl(photoNewFile);
													}

													// patch & redirect & toast (if no server errors)
													patchtldr(tldrFields.id, tldrFields)
														.then( response => {
															if(!response.error){
																Router.push({pathname:'/tldr', query: {tldrId: tldr.item.id}})
																	.then(()=>{
																		this.props.addToast('tldr saved; nice work!');
																	})
															}
														});
										        }
											}}
											onChange={(fields) => {
												this.setState({tldrFormFields: fields});
											}}
											tags={tags}
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
}


const mapStateToProps = (state, ownProps) => {
	return ({
		tldr: state.tldr	
	});
}

const actionCreators = {
	addToast,
	fetchTldr,
	createTldr,
	patchTldr,
	updateErrorTldr
};

export default connect(
	mapStateToProps,
	actionCreators
)(TldrEdit);

