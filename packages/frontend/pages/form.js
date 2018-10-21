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
	withFormState
} from '../components/cinderblock';


import styles from '../components/cinderblock/styles/styles';

import Page from '../components/Page';




const OtherForm = withFormState( (props) => (
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





/*

const OtherFormInner = props => {
	return(
		<form>
		<Sections>
			<Section>
				<Chunk>
					<Text type="pageHead">Form test</Text>
				</Chunk>


				<Chunk>
					<Label htmlFor="theseoptions">Pick one of these</Label>
					<Picker
						>
						<Picker.Item label="One" value="java" />
						<Picker.Item label="Two" value="js" />
						<Picker.Item label="Three" value="js" />
						<Picker.Item label="Four" value="js" />
					</Picker>
				</Chunk>
				<Chunk>
					<Label htmlFor="bestmemory">Best memory</Label>
					<TextInputFormik
						id="bestmemory"
						value={props.values.bestmemory}
						onChangeText={text => props.setFieldValue('worstmemory', text)}
						autoComplete="off"
						/>
				</Chunk>

				<Chunk>
					<Label htmlFor="worstmemory">Worst memory</Label>
					<TextInputFormik
						id="worstmemory"
						defaultValue={props.values.worstmemory}
						onChangeText={text => props.setFieldValue('worstmemory', text)}
						autoComplete="off"
						/>
					<Text type="small" color="hint">Sucks, doesn't it?</Text>
				</Chunk>

			</Section>
			<Section>
				<Chunk>
					<Button
						onPress={props.handleSubmit}
						label="Submit"
						/>
				</Chunk>
			</Section>
		</Sections>
		</form>
	)
}
const OtherForm = withFormik({
	mapPropsToValues: props => ({
		whatisthis: props.data.whatisthis,
		firstName: props.data.firstName,
		lastName: props.data.lastName
	}),
	handleSubmit: (values, { props, setSubmitting, setErrors }) => {
		alert(`in theory we are submitting... ${JSON.stringify(values)}`);
	},
})(OtherFormInner);

*/


class Other extends React.Component {

	render() {

		const {
			user
		} = this.props;

		return (
			<Page>
				<Stripe>
					<Bounds>
						<OtherForm />
					</Bounds>
				</Stripe>
			</Page>
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
)(Other);