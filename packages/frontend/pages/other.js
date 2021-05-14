import React, {Fragment, useContext} from 'react';

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
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch,
	useFormState,
	ThemeContext
} from 'cinderblock';


import Page from '../components/Page';

const OtherForm = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	const formState = useFormState({
		initialFields: {}
	});

	const submitForm = () => {
		formState.setLoading(true);
		alert(`In theory, we are submitting: ${JSON.stringify(formState.fields)}`);
		formState.setLoading(false);
	}

	return(
		<form>
				<Section type="pageHead">
					<Chunk>
						<Text type="pageHead">Settings</Text>
					</Chunk>
				</Section>
				<Section>
					<Chunk>
						<Text type="sectionHead">Basic info</Text>
					</Chunk>
					<Chunk>
						<Label htmlFor="theseoptions">Pick one of these</Label>
						<Picker
							onValueChange={(itemValue, itemIndex) => formState.setFieldValue('pickone', itemValue)}
							selectedValue={formState.getFieldValue('pickone')}
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
							value={formState.getFieldValue('bestmemory')}
							onChange={e => formState.setFieldValue('bestmemory', e.target.value)}
							autoComplete="off"
							/>
					</Chunk>

					<Chunk>
						<Label htmlFor="worstmemory">Worst memory</Label>
						<TextInput
							id="worstmemory"
							value={formState.getFieldValue('worstmemory')}
							onChange={e => formState.setFieldValue('worstmemory', e.target.value)}
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
							value={formState.getFieldValue('tellMeAboutYou')}
							onChange={e => formState.setFieldValue('tellMeAboutYou', e.target.value)}
							/>
					</Chunk>
					<Chunk>
						<Label htmlFor="tellMe">Check out this counter</Label>
						<TextInput
							multiline
							numberOfLines={4}
							maxLength={1000}
							showCounter={true}
							value={formState.getFieldValue('counterAnswer')}
							onChange={e => formState.setFieldValue('counterAnswer', e.target.value)}
							/>
					</Chunk>
					<Chunk>
						<CheckBox
							value={formState.getFieldValue('termsOfService')}
							onChange={() => formState.setFieldValue('termsOfService', !formState.getFieldValue('termsOfService'))}
							label="I agree to everything"
							/>
					</Chunk>
				</Section>
				<Section>
					<Chunk>
						<Button
							onPress={submitForm}
							label="Submit"
							width="snap"
							isLoading={formState.loading}
							/>
					</Chunk>
				</Section>
		</form>
	)
};



function Other (props) {
   const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

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


export default Other;