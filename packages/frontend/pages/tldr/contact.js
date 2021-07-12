import React, { Fragment, useState, useEffect, useCallback, useRef, useContext } from 'react';

// SWR
import { request, getCommunicationUrl } from '@/swr';
import useSWR, { mutate } from 'swr';

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addPrompt, addToast, addDelayedToast, updateUser } from '@/actions';

// COMPONENTS
import {
	Avatar,
	Bounds,
	Button,
	Card,
	CheckBox,
	Chunk,
	FakeInput,
	FieldError,
	Flex,
	FlexItem,
	FileInput,
	Icon,
	Inline,
	Image,
	Label,
	List,
	Link,
	Modal,
	PhotoInput,
	Picker,
	Reorderable,
	RevealBlock,
	Section,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch,
	View,
	useFormState,
	ThemeContext
} from 'cinderblock';
import Page from '@/components/Page';
import TldrHeader from '../../components/tldr/TldrHeader';
import Router from 'next/router'
import Head from 'next/head'





// SCREEN-SPECIFIC
import { Utils } from 'cinderblock';
const { runValidations, pushError, readFileAsDataUrl } = Utils;
import feathersClient from 'components/FeathersClient';


const ContactPage = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	const dispatch = useDispatch();
	const authentication = useSelector(state => state.authentication);

	const { message = '' } = props;
	const [messageSent, setMessageSent] = useState(false);

	const formState = useFormState({
		initialFields: {
			message: message
		},
		toastableErrors: {
			BadRequest: 'Something went wrong',
		},
		addToast: msg => dispatch(addToast(msg))
	});

	const submitForm = async () => {
		const submitFields = { ...formState.fields };
		let error = runValidations(submitFields, {
			message: {
				notEmpty: {
					msg: "Message can't be blank"
				}
			},
		});

		// display errors that exist
		formState.setError(error);

		// if no errors, let's submit
		if (!error) {
			formState.setLoading(true);
			try {
				// update password
				const sendCommunication = await request(getCommunicationUrl(), {
					method: 'POST',
					data: {
						...submitFields,
						type: 'contact'
					},
					token: authentication.accessToken
				});
				formState.setLoading(false);
				setMessageSent(true);
			}
			catch (error) {
				console.log(error);
				formState.setError(error);
				formState.setLoading(false);
			}
		}
	}


	return (
		<Page>
			<TldrHeader />
			<Stripe style={{flex: 1}}>
				<Bounds medium sparse>
					<Section>
						<Chunk>
							<Text type="pageHead">Contact us</Text>
						</Chunk>

					</Section>
					{!messageSent &&
						<>
							<form>
								<Section>
									<Chunk>
										<TextInput
											id="message"
											multiline={true}
											numberOfLines={8}
											value={formState.getFieldValue('message')}
											onChange={e => formState.setFieldValue('message', e.target.value)}
											placeholder="Your message"
										/>
										<FieldError error={formState.error?.fieldErrors?.message} />
									</Chunk>
									<Chunk>
										<Button
											label="Send message"
											onPress={submitForm}
											isLoading={formState.loading}
										/>
									</Chunk>


								</Section>
							</form>
						</>
					}

					<RevealBlock visible={messageSent}>
						<Section border>
							<Chunk>
								<Text>Message sent! We'll get back to you or something</Text>
							</Chunk>
							<Chunk>
								<Button
									color="secondary"
									onPress={() => setMessageSent(false)}
									label="Go back"
								/>
							</Chunk>
						</Section>
					</RevealBlock>


				</Bounds>
			</Stripe>
		</Page>
	);

}

ContactPage.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const { store, req, pathname, query } = context;
	const { message } = query;
	const isServer = !!req;
	return {
		isServer,
		message
	}
}


export default ContactPage;



