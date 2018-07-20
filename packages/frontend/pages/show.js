import React, {Fragment} from 'react';
import { withFormik } from 'formik';
import { connect } from 'react-redux';

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


class Show extends React.Component {

	static getInitialProps (props) {

		// next router query bits only initially available to getInitialProps
		const { query } = props;
		const { params } = query;
		return {
			show: query.show
		};
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

const actionCreators = {};

export default connect(
	mapStateToProps,
	actionCreators
)(Show);