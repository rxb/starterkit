import React, {Fragment} from 'react';
import { withFormik } from 'formik';
import { connect } from 'react-redux';
import Head from 'next/head'
import moment from 'moment'

import {
	fetchShow,
	createShowComment,
	deleteShowComment,
	fetchShowComments
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
	Touch
} from './cinderblock';

import styles from './cinderblock/styles/styles';

import Page from './components/Page';

const CommentFormInner = props => {
	return(
		<form>
			<Chunk>
				<TextInput
					id="comment"
					placeholder="Post a comment about this show"
					autoComplete={false}
					defaultValue={props.values.body}
					onChangeText={text => props.setFieldValue('body', text)}
					multiline={true}
					showCounter={true}
					numberOfLines={4}
					maxLength={1000}
					/>
			</Chunk>
			<Chunk>
				<Touch onPress={props.handleSubmit}>
					<Button label="Post Comment" />
				</Touch>
			</Chunk>
		</form>
	);
}




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

	componentDidMount(){
		// this.props.fetchShow(this.props.showId);
		this.props.fetchShowComments({showId: this.props.showId});
	}

	_renderForm(){
		const CommentForm = withFormik({
			mapPropsToValues: props => ({}),
			handleSubmit: (values, { props, setSubmitting, setErrors }) => {
				this.props.createShowComment({ ...values, showId: this.props.show.id }, { user: this.props.user } );
			},
		})(CommentFormInner);
		return <CommentForm />;
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
				</Head>
				<Stripe image={show.photo} style={{height: 300, backgroundColor: '#eee'}}>
				</Stripe>
				<Stripe>
					<Bounds>
						<Sections>
							<Section>
								<Chunk>
									<Text type="pageHead">{show.title}</Text>
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
														<Text type="small" color="hint">&middot; {moment(comment.createdAt).fromNow()} </Text>
														{ comment.user.id == user.id &&
															<Fragment>
																<Link onPress={()=>{
																	this.props.deleteShowComment(comment.id);
																}}>
																	<Text type="small" color="tint">&middot; Delete</Text>
																</Link>

																<Link onPress={()=>{
																	alert('edit comment?')
																}}>
																	<Text type="small" color="tint">&middot; Edit</Text>
																</Link>
															</Fragment>
														}
													</Text>
												</FlexItem>
											</Flex>
										</Chunk>
									);
								})}

								{user.id && this._renderForm()}

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
	fetchShow
};

export default connect(
	mapStateToProps,
	actionCreators
)(Show);