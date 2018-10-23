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
	Touch,
	withFormState
} from '../components/cinderblock';


import styles from '../components/cinderblock/styles/styles';

import Page from '../components/Page';



class ListItem extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			visibilityValue: new Animated.Value(0)
		}
	}
	componentWillEnter (callback) {
		Animated.timing(
			this.state.visibilityValue,{
				toValue: 1,
				duration: 250
			}
		).start(()=>{
			callback();
		});

	}
	componentWillLeave (callback) {
		callback();
	}
	render(){
		const {
			thing,
			i
		} = this.props;
		return(
			<Animated.View style={{opacity: this.state.visibilityValue, backgroundColor: 'red', marginBottom: 2}}>
				<Text>{i}. {thing}</Text>
			</Animated.View>
		)
	}
}

import { Animated, Easing, Touchable, View } from '../components/cinderblock/primitives';


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
				<Stripe image={show.photo} style={{height: 300, backgroundColor: '#eee'}}>
				</Stripe>
				<Stripe>
					<Bounds>
						<Sections>
							<Section type="pageHead">
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
														<Text type="small" color="hint">&middot; {dayjs(comment.createdAt).fromNow()} </Text>
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
	fetchShow
};

export default connect(
	mapStateToProps,
	actionCreators
)(Show);