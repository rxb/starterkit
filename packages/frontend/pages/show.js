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
	addPrompt
} from '../actions';


import {
	Avatar,
	Bounds,
	Button,
	Card,
	CheckBox,
	Chunk,
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



const CommentForm = withFormState((props) => {
	return(
		<form>
			<Chunk>
				<TextInput
					id="body"
					value={props.getFieldValue('body')}
					onChange={e => props.setFieldValue('body', e.target.value)}
					placeholder="Post a comment about this show"
					autoComplete="off"
					multiline={true}
					showCounter={true}
					numberOfLines={4}
					maxLength={1000}
					/>
			</Chunk>
			<Chunk>
				<Button
					onPress={props.handleSubmit}
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
		onRequestClose
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
						onRequestClose();
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
					<meta property='og:image' content={this.props.show.photo} />
					<title>{this.props.show.title}</title>
				</Head>
				<Stripe image={show.photo} style={{backgroundColor: '#eee'}}>
				</Stripe>
				<Stripe>
					<Bounds>
						<Sections>
							<Section type="pageHead">
								<Chunk>
									<Text type="pageHead">{show.title}</Text>
								</Chunk>
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

								{showComments && showComments.map((comment, i)=>{
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
									<CommentForm
										onSubmit={ (fields, context) => {
											const data = { ...fields, showId: this.props.show.id };
											this.props.createShowComment(data, { user: this.props.user } );
											context.resetFields();
										}}
										/>
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
	addPrompt
};

export default connect(
	mapStateToProps,
	actionCreators
)(Show);