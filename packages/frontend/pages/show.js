import React, {Fragment} from 'react';
import { withFormik } from 'formik';
import { connect } from 'react-redux';
import moment from 'moment'

import {
	createShowComment,
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

	static getInitialProps (props) {

		// next router query bits only initially available to getInitialProps
		const { query } = props;
		const { params } = query;
		return {
			show: query.show
		};
	}

	componentDidMount(){
		this.props.fetchShowComments({showId: this.props.show.id});
	}

	_renderForm(){
		const CommentForm = withFormik({
			mapPropsToValues: props => ({}),
			handleSubmit: (values, { props, setSubmitting, setErrors }) => {
				this.props.createShowComment({ ...values, showId: this.props.show.id });
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
				<Stripe image={show.photo} style={{height: 300}}>
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
									comment.user = comment.user || user;
									return (
										<Chunk key={i}>
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
														<Text type="small" color="hint">&middot; {moment(comment.createdAt).fromNow()}</Text>
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
		show: state.shows[ownProps.show],
		showComments: state.showComments,
		user: state.user
	});
}

const actionCreators = {
	createShowComment,
	fetchShowComments
};

export default connect(
	mapStateToProps,
	actionCreators
)(Show);