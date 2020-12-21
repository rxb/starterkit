import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import {
	fetchShow,
	createShowComment,
	deleteShowComment,
	fetchShowComments,
	updateErrorShowComment,
	addPrompt,
	addToast
} from '../actions';

import {
	Avatar,
	Bounds,
	Button,
	Card,
	CheckBox,
	Chunk,
	FieldError,
	Flex,
	FlexItem,
	Icon,
	Inline,
	Image,
	ImageSnap,
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

import Page from '../components/Page';
import { runValidations, readFileAsDataUrl, checkToastableErrors } from '../components/cinderblock/formUtils';

import swatches from '../components/cinderblock/styles/swatches';
import { METRICS } from '../components/cinderblock/designConstants';


const CommentForm = withFormState((props) => {

	const {
		getFieldValue,
		setFieldValue,
		handleSubmit,
		resetFields,
		fieldErrors = {}
	} = props;

	return(
		<form>
			<Chunk>
				<TextInput
					id="body"
					value={getFieldValue('body')}
					onChange={e => setFieldValue('body', e.target.value)}
					placeholder="Post a comment about this show"
					autoComplete="off"
					multiline={true}
					showCounter={true}
					numberOfLines={4}
					maxLength={1000}
					/>
				<FieldError error={fieldErrors.body} />
			</Chunk>
			<Chunk>
				<Button
					onPress={handleSubmit}
					label="Post Comment"
					/>
			</Chunk>
		</form>
	);
});


const DeletePrompt = (props) => {
	const {
		comment,
		deleteShowComment,
		onRequestClose,
		onCompleteClose
	} = props;
	return (
		<Sectionless>
			<Chunk>
				<Text type="sectionHead">Are you sure?</Text>
			</Chunk>
			<Chunk>
				<Text>Deleting your comment {comment.id}</Text>
			</Chunk>
			<Chunk>
				<Button
					onPress={()=>{
						deleteShowComment(comment.id);
						onRequestClose(()=>{
							alert('yes!');
						});
					}}
					label="Yes I'm sure"
					width="full"
					/>
				<Button
					onPress={()=>{
						onRequestClose();
					}}
					label="No thanks"
					color="secondary"
					width="full"
					/>
			</Chunk>

		</Sectionless>
	)
};



class Show extends React.Component {

	static async getInitialProps (context) {
		// next router query bits only initially available to getInitialProps
		const {store, req, pathname, query} = context;
		const showId = query.showId;
		const response = await store.dispatch(fetchShow(showId));
		console.log('store');
		console.log(JSON.stringify(store.getState()));
		// theory: this store isn't the store anymore, it's some other smaller store
		// store isn't being set up in the context correctly somehow

		const isServer = !!req;	
		return {
			isServer,
			showId: showId,
		};
	}

	constructor(props){
		super(props);
		this.state = {
		}
	}

	componentDidMount(){
		// this.props.fetchShow(this.props.showId);
		this.props.fetchShowComments({showId: this.props.showId});
	}

	componentDidUpdate(prevProps){

		// watching for toastable errors
		// still feel like maybe this could go with form?
		const messages = {
			showComments: {
				BadRequest: 'Something went wrong',
				GeneralError: 'Something went wrong (GeneralError)',
			}
		};
		checkToastableErrors(this.props, prevProps, messages);

	}

	render() {

		const {
			showId = 0,
			show,
			showComments,
			user,
		} = this.props;

		console.log('render');
		console.log(this.props.showComments);

		return (
			<Page>
				<Head>
					<meta property='og:title' content={`Show: ${show.item.title}`} />
					<meta property='og:image' content={show.item.photoUrl} />
					<title>{show.item.title}</title>
				</Head>


				{/*
					<Stripe image={show.item.photoUrl} style={{backgroundColor: '#eee'}}>
					</Stripe>
				*/}

				<Stripe>
					<Bounds>
						<Sections>
							<ImageSnap
								image={show.item.photoUrl}
								/>
							<Section>
								<View style={{
									/*
									borderBottomWidth: 1,
									borderBottomColor: swatches.border
									*/
								}}>
									<Chunk>
										<View style={{backgroundColor: 'pink', padding: METRICS.space}}>
											<Text>showId: {showId}</Text>
											<Text>isServer: {this.props.isServer ? 'true' : 'false'}</Text>
										</View>
									</Chunk>
									<Flex>
										<FlexItem>
											
											<Chunk>
												<Text type="pageHead">{show.item.title}</Text>

												<Text color="secondary">
													United States &middot;
													1998
													{ show.item.genres && show.item.genres.map((genre, i)=>(
														<Fragment> &middot; {genre}</Fragment>
													))}
												</Text>
											</Chunk>
										</FlexItem>
										<FlexItem
											shrink
											style={{justifyContent: 'flex-end'}}
											>
											<Chunk>
												<Button
													href={{pathname:'/showedit', query: {showId: show.item.id}}}
													shape="Edit"
													label="Edit show"
													color="secondary"
													variant={{
														small: 'iconOnly',
														large: 'shrink'
													}}
													/>
											</Chunk>
										</FlexItem>
									</Flex>
								</View>
						

								<Chunk>
									<Text>{show.item.description}</Text>
								</Chunk>
							</Section>
							<Section>
								<Chunk>
									<Text type="sectionHead">Comments</Text>
								</Chunk>

								{showComments.items.map((comment, i)=>{
									comment.user = comment.user || {};
									return (
										<Chunk key={i} style={{...(comment.optimistic ? {opacity:.5} : {}) }}>
											<Flex>
												<FlexItem shrink>
													<Avatar
														source={{uri: comment.user.photoUrl}}
														size="medium"
														/>
												</FlexItem>
												<FlexItem>
													<Text>{comment.body}</Text>
													<Text>
														<Text type="small" color="secondary">{comment.user.name} </Text>
														<Text type="small" color="hint">&middot; {dayjs(comment.createdAt).fromNow()} </Text>
														{ comment.user.id == user.id &&
															<Fragment>
																<Link onPress={()=>{
																	this.props.addPrompt(
																		<DeletePrompt
																			comment={comment}
																			deleteShowComment={this.props.deleteShowComment}
																			/>
																	);
																}}>
																	<Text type="small" color="hint">&middot; Delete</Text>
																</Link>
															</Fragment>
														}
													</Text>
												</FlexItem>
											</Flex>
										</Chunk>
									);
								})}

								{user.id &&
									<Fragment>
										<CommentForm
											initialFields={{
												body: ''
											}}
											fieldErrors={showComments.error.fieldErrors}
											onSubmit={ (fields, context) => {
												const validators = {
 													body: {
											        	notEmpty: {
											        		msg: "Comment can't be blank"
											        	},
											        	notContains: {
											        		args: "garbage",
											        		msg: "No comments about garbage, please!"
											        	}
										        	}
										        }
										        const error = runValidations(fields, validators);
										        this.props.updateErrorShowComment(error);

										        if(!error.errorCount){
													const data = { ...fields, showId: this.props.show.id };
													this.props.createShowComment(data, { user: this.props.user } );
													context.resetFields();
												}
											}}
											/>
									</Fragment>
								}

							</Section>
						</Sections>
					</Bounds>
				</Stripe>
			</Page>
		);
	}
}


const mapStateToProps = (state, ownProps) => {
	console.log('state 2');
	console.log(JSON.stringify(state.showComments));
	return ({
		show: state.show,
		showComments: state.showComments,
		user: state.user
	});
}

const actionCreators = {
	createShowComment,
	deleteShowComment,
	updateErrorShowComment,
	fetchShowComments,
	fetchShow,
	addPrompt,
	addToast,
};

export default connect(
	mapStateToProps,
	actionCreators
)(Show);