import React, {Fragment} from 'react';
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
	Touch,
	View,
	withFormState
} from '../components/cinderblock';


import styles from '../components/cinderblock/styles/styles';

import Page from '../components/Page';

import { METRICS } from '../components/cinderblock/designConstants';


/*
const TextAreaForm = withFormState( (props) => (
	<Fragment>
		<Chunk>
			<Label>First</Label>
			<TextInput
				id="first"
				value={props.getFieldValue('first')}
				onChange={ e => props.setFieldValue('first', e.target.value) }
				autoComplete="off"
				/>
		</Chunk>
		<Chunk>
			<Label>Second</Label>
			<TextInput
				id="second"
				value={props.getFieldValue('second')}
				onChange={ e => props.setFieldValue('second', e.target.value) }
				autoComplete="off"
				/>
		</Chunk>
		<Chunk>
			<Label>Third</Label>
			<TextInput
				id="third"
				value={props.getFieldValue('third')}
				onChange={ e => props.setFieldValue('third', e.target.value) }
				multiline
				numberOfLines={4}
				maxLength={1000}
				showCounter={true}
				/>
		</Chunk>
		<Chunk>
			<Button
				label="Let's do the damn thing"
				onPress={()=>{
					props.handleSubmit();
				}}
				/>
		</Chunk>
	</Fragment>
));
*/

const TextAreaForm = withFormState( (props) => (
			<TextInput
				multiline
				numberOfLines={4}
				placeholder="Let's type some goddamn text"
				id="first"
				value={props.getFieldValue('first')}
				onChange={ e => props.setFieldValue('first', e.target.value) }
				autoComplete="off"
				wrapperStyle={{
					flex: 1,
				}}
				style={{
					borderRadius: 0,
					flex: 1,
					marginVertical: 0,
					overflow: 'hidden',
					borderWidth: 0,
					paddingHorizontal: METRICS.spaceSection
				}}
				/>

));




class TextAreaTest extends React.Component {

	render() {


		const {
			user
		} = this.props;

		return (
			<View style={{
				flex: 1,
				alignItems: 'stretch',
				minHeight: '-webkit-min-content'
			}}>
				<Section>
					<Chunk>
						<Text type="pageHead">Type please</Text>
					</Chunk>
				</Section>
				<TextAreaForm />

			</View>
		);


	}
}


const mapStateToProps = (state, ownProps) => {
	return ({
		user: state.user,
	});
}

const actionCreators = {};

export default connect(
	mapStateToProps,
	actionCreators
)(TextAreaTest);