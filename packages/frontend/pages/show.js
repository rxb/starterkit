import React, {Fragment} from 'react';
import { withFormik } from 'formik';
import { connect } from 'react-redux';

import {
	createShowComment
} from '../actions';

import {
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
			show = {}
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
								{show.ShowComments && show.ShowComments.map((comment, i)=>(
									<Chunk key={i}>
										<Text>{comment.body}</Text>
									</Chunk>
								))}

								{this._renderForm()}

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
	});
}

const actionCreators = {
	createShowComment
};

export default connect(
	mapStateToProps,
	actionCreators
)(Show);