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
		const {store, isServer, pathname, query} = context;
		const showId = query.showId;
		const show = await store.dispatch(fetchShow(showId));
		return {
			showId: showId,
			show: show.payload
		};
	}

	constructor(props){
		super(props);
		this.state = {
			things: []
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
			}
		};
		checkToastableErrors(this.props, prevProps, messages);

	}

	render() {

		const {
			show = {},
			showComments,
			user,
		} = this.props;


		return (
			<Page>
				<Head>
					<meta property='og:title' content={`Show: ${this.props.show.title}`} />
					<meta property='og:image' content={this.props.show.photoUrl} />
					<title>{this.props.show.title}</title>
				</Head>
				<Stripe image={show.photoUrl} style={{backgroundColor: '#eee'}}>
				</Stripe>
				<Stripe>
					<Bounds>
						<Sections>
							<Section>
								<View style={{
									/*
									borderBottomWidth: 1,
									borderBottomColor: swatches.border
									*/
								}}>
									<Flex
										>
										<FlexItem>
											<Chunk>
												<Text type="pageHead">{show.title}</Text>
											</Chunk>
										</FlexItem>
										<FlexItem
											shrink
											style={{justifyContent: 'flex-end'}}
											>
											<Chunk>
												<Link
													href={{pathname:'/showedit', query: {showId: show.id}}}
													style={{alignItems: 'center'}}
													>
													<Icon
														shape="Edit"
														color={swatches.tint}
														/>
													<Text
														color="tint"
														type="micro"
														>EDIT</Text>
												</Link>
											</Chunk>
										</FlexItem>
									</Flex>
								</View>
							</Section>
							<Section>
								<Chunk>
									<Text color="secondary">
										United States &middot;
										1998
										{ show.genres.map((genre, i)=>(
											<Fragment> &middot; {genre}</Fragment>
										))}
									</Text>
								</Chunk>
								<Chunk>
									<Text>{show.description}</Text>
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
														source={{uri: comment.user.photo}}
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
	return ({
		//show: state.show,
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