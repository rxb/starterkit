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
	withFormState
} from '../components/cinderblock';

import Page from '../components/Page';
import {checkToastableErrors} from '../components/ConnectedToaster';



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
			user
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
								<Chunk style={{
									/*
									borderBottomWidth: 1,
									borderBottomColor: 'rgba(0,0,0,.15)',
									marginBottom: 20
									*/
								}}>
									<Flex
										direction="column"
										switchDirection="medium"
										align="center"
										>
										<FlexItem>
											<Text type="pageHead">{show.title}</Text>
										</FlexItem>
										<FlexItem shrink>
											<Link
												href={{pathname:'/showedit', query: {showId: show.id}}}
												>
												<Icon
													shape="Edit"
													color="tint"
													/>
												<Text
													color="tint"
													type="small"
													>Edit</Text>
											</Link>
										</FlexItem>
									</Flex>
								</Chunk>
							</Section>
							<Section>
								<Chunk>
									<Text color="secondary">United States &middot; 1998 &middot; Sitcom</Text>
								</Chunk>
								<Chunk>
									<Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</Text>
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
											fieldErrors={showComments.error.fieldErrors}
											onSubmit={ (fields, context) => {
												const data = { ...fields, showId: this.props.show.id };
												this.props.createShowComment(data, { user: this.props.user } );
												context.resetFields();
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
	fetchShowComments,
	fetchShow,
	addPrompt,
	addToast
};

export default connect(
	mapStateToProps,
	actionCreators
)(Show);