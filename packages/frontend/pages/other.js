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


const OtherFormInner = props => {
	return(
		<form>
		<Sections>
			<Section>
				<Chunk>
					<Text type="pageHead">Settings</Text>
				</Chunk>
			</Section>
			<Section>
				<Chunk>
					<Text type="sectionHead">Basic info</Text>
				</Chunk>
				<Chunk>
					<Label for="theseoptions">Pick one of these</Label>
					<Picker
						>
						<Picker.Item label="One" value="java" />
						<Picker.Item label="Two" value="js" />
						<Picker.Item label="Three" value="js" />
						<Picker.Item label="Four" value="js" />
					</Picker>
				</Chunk>
				<Chunk>
					<Label for="favoriteshow">Favorite show</Label>
					<TextInput
						id="favoriteshow"
						autoComplete={false}
						defaultValue={props.values.favoriteshow}
						onChangeText={text => props.setFieldValue('favoriteshow', text)}
						/>
				</Chunk>
				<Chunk>
					<Label for="worstmemory">Worst memory</Label>
					<TextInput
						id="worstmemory"
						autoComplete={false}
						defaultValue={props.values.worstmemory}
						onChangeText={text => props.setFieldValue('worstmemory', text)}
						/>
					<Text type="small" color="hint">Sucks, doesn't it?</Text>
				</Chunk>
				<Chunk>
					<Label for="clean">Tell me about yourself</Label>
					<TextInput
						id="clean"
						multiline
						numberOfLines={4}
						maxLength={1000}
						showCounter={false}
						defaultValue={props.values.clean}
						onChangeText={text => props.setFieldValue('clean', text)}
						/>
				</Chunk>
				<Chunk>
					<Label for="tellMe">Tell me about yourself</Label>
					<TextInput
						id="tellMe"
						multiline
						numberOfLines={4}
						maxLength={1000}
						showCounter={true}
						defaultValue={props.values.tellMe}
						onChangeText={text => props.setFieldValue('tellMe', text)}
						/>
				</Chunk>
				<Chunk>
					<Label for="description">This input updates</Label>
					<TextInput
						id="description"
						multiline
						numberOfLines={4}
						maxLength={1000}
						showCounter={true}
						onChangeText={text => props.setFieldValue('description', text)}
						defaultValue={props.values.description}
						/>
				</Chunk>
			</Section>
			<Section>
				<Chunk>
					<Text type="sectionHead">More stuff</Text>
				</Chunk>
				<Chunk>
					<Label for="whatisthis">What is this?</Label>
					<Picker
						id="whatisthis"
						selectedValue={props.values.whatisthis}
						onValueChange={(value, index) => {
							props.setFieldValue('whatisthis', value)}
						}
						>
						<Picker.Item label="One" value="one" />
						<Picker.Item label="Two" value="two" />
						<Picker.Item label="Three" value="three" />
						<Picker.Item label="Four" value="four" />
					</Picker>
				</Chunk>
				<Chunk>
					<Label for="firstname">First name</Label>
					<TextInput
						id="firstname"
						onChangeText={text => props.setFieldValue('firstName', text)}
						defaultValue={props.values.firstName}
						keyboardType="email-address"
						/>
				</Chunk>
				<Chunk>
					<Label for="lastname">Last name</Label>
					<TextInput
						id="lastname"
						onChangeText={text => props.setFieldValue('lastName', text)}
						defaultValue={props.values.lastName}
						/>
				</Chunk>
				<Chunk>
					<CheckBox
						id="lastname"
						value={props.values.isRed}
						onChange={text => props.setFieldValue('isRed', !props.values.isRed)}
						label="It's red"
						/>

				</Chunk>
			</Section>
			<Section>
				<Chunk>
					<Touch onPress={props.handleSubmit}>
						<Button label="Submit" />
					</Touch>
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


class Other extends React.Component {
	constructor(props){
		super(props);
		this.counter = React.createRef();
	}

	render() {

		const {
			user
		} = this.props;

		return (
			<Page user={user}>
				<Stripe>
					<Bounds>
						<OtherForm data={{firstName: 'Joe', lastName: 'Schmo', whatisthis: 'three'}} />
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