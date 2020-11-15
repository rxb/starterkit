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
					value={props.getFieldValue('draftContent')}
					onChangeText={text => props.setFieldValue('draftContent', text) }
					multiline
					numberOfLines={10}
					showCounter={true}
					/>
				<FieldError error={fieldErrors.draftContent} />
			</Chunk>

			<Chunk>
				<Button
					color="primary"
					label="Publish"
					onPress={ () => {
						props.setFieldValue('publish', true, props.handleSubmit.bind(this));
					}}
					/>
				<Button
					color="secondary"
					label="Save draft"
					onPress={ () => {
						props.setFieldValue('publish', false, props.handleSubmit.bind(this));
					}}				
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
			createTldr,
			patchTldr,
			updateErrorTldr
		} = this.props;

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
										{ tldr.data.id &&
										<TldrForm
											initialFields={{
												draftContent: JSON.stringify(tldr.data.draftContent, null, 2),
												id: tldr.data.id,
												publish: false
											}}
											fieldErrors={tldr.error.fieldErrors}
											onSubmit={ async (fields)=>{

												// client-side validation rules
												// should match up with server rules
												// don't always need both unless speed is paramount
												// or doing something like optimistic UI
 												const validators = {};

										        // client-side validation
										        const error = runValidations(fields, validators);
										        updateErrorTldr(error);

										        // if not client errors...
										        if(!error.errorCount){

													// temporary finesse for json
													const fieldsCopy = {
														...fields,
														draftContent: JSON.parse(fields.draftContent)
													}

													// patch & redirect & toast (if no server errors)
													patchTldr(fields.id, fieldsCopy)
														.then( response => {
															if(!response.error){
																Router.push({pathname:'/tldr', query: {tldrId: tldr.data.id}})
																	.then(()=>{
																		this.props.addToast('tldr saved; nice work!');
																	})
															}
														});
										        }
											}}
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

