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

const OtherForm = withFormState((props) => {
	return(
		<form>
			<Sections>
				<Section>
					<Chunk>
						<Text type="pageHead">Settings</Text>
					</Chunk>

					<Chunk>
						<Text type="sectionHead">Basic info</Text>
					</Chunk>
					<Chunk>
						<Label htmlFor="theseoptions">Pick one of these</Label>
						<Picker
							onValueChange={(itemValue, itemIndex) => props.setFieldValue('pickone', itemValue)}
							selectedValue={props.getFieldValue('pickone')}
							>
							<Picker.Item label="One" value="one" />
							<Picker.Item label="Two" value="two" />
							<Picker.Item label="Three" value="three" />
							<Picker.Item label="Four" value="four" />
						</Picker>
					</Chunk>
					<Chunk>
						<Label htmlFor="bestmemory">Best memory</Label>
						<TextInput
							id="bestmemory"
							value={props.getFieldValue('bestmemory')}
							onChangeText={text => props.setFieldValue('bestmemory', text)}
							autoComplete="off"
							/>
					</Chunk>

					<Chunk>
						<Label htmlFor="worstmemory">Worst memory</Label>
						<TextInput
							id="worstmemory"
							defaultValue={props.getFieldValue('worstmemory')}
							onChangeText={text => props.setFieldValue('worstmemory', text)}
							autoComplete="off"
							/>
						<Text type="small" color="hint">Sucks, doesn't it?</Text>
					</Chunk>
					<Chunk>
						<Label htmlFor="clean">Tell me about yourself</Label>
						<TextInput
							id="clean"
							multiline
							numberOfLines={4}
							showCounter={false}
							defaultValue={props.getFieldValue('clean')}
							onChangeText={text => props.setFieldValue('clean', text)}
							/>
					</Chunk>
					<Chunk>
						<Label htmlFor="tellMe">Tell me about yourself</Label>
						<TextInput
							id="tellMe"
							multiline
							numberOfLines={4}
							maxLength={1000}
							showCounter={true}
							defaultValue={props.getFieldValue('tellMe')}
							onChangeText={text => props.setFieldValue('tellMe', text)}
							/>
					</Chunk>
					<Chunk>
						<Label htmlFor="description">This input updates</Label>
						<TextInput
							id="description"
							multiline
							numberOfLines={4}
							maxLength={1000}
							showCounter={true}
							onChangeText={text => props.setFieldValue('description', text)}
							defaultValue={props.getFieldValue('description')}
							/>
					</Chunk>
					<Chunk>
						<CheckBox
							id="lastname"
							value={props.getFieldValue('isRed')}
							onChange={text => props.setFieldValue('isRed', !props.getFieldValue('isRed'))}
							label="It's red"
							/>
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
});



class Other extends React.Component {

	render() {

		const {
			user
		} = this.props;

		return (
			<Page>
				<Stripe>
					<Bounds>
						<OtherForm
							initialFields={{firstName: 'Joe', lastName: 'Schmo', whatisthis: 'three'}}
							onSubmit={(fields) => {
								alert(`in theory we are submitting... ${JSON.stringify(fields)}`);
							}}
							/>
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