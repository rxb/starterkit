import React, { Fragment, useState, useContext } from 'react';

// REDUX
import { useDispatch, useSelector } from 'react-redux';
import { addPrompt, addToast, addDelayedToast, updateUi } from '@/actions';

// SWR
import { request, getUserUrl } from '@/swr';
import useSWR, { mutate } from 'swr';

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
	LoadingBlock,
	Modal,
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
	useFormState, ThemeContext
} from 'cinderblock';

// STYLE


// COMPONENT-SPECIFIC
import { Utils } from 'cinderblock';
const { runValidations, pushError, readFileAsDataUrl } = Utils;
import feathersClient from '../components/FeathersClient';
import Router, { useRouter } from 'next/router'
const apiHost = process.env.NEXT_PUBLIC_API_HOST;

// URLS
import { getProfileEditPageUrl, getRequestPasswordPageUrl, saveLoginRedirect } from 'components/tldr/urls';



export const LoginLocalForm = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	const {
		callbackForNonRedirectFlow = () => { }
	} = props;
	const redirect = getLoginRedirect(props.redirectOverride);

	const dispatch = useDispatch();

	const formState = useFormState({
		'__note': 'LoginForm',
		initialFields: props.initialFields
	});

	const onSubmit = async () => {
		formState.setLoading(true);
		try {
			await feathersClient.authenticate({
				strategy: 'local',
				email: formState.fields.email,
				password: formState.fields.password
			})
			if (props.redirectOnLocalLogin) {
				formState.setLoading(false);
				Router.push(redirect);
			}
			else {
				formState.setLoading(false);
				callbackForNonRedirectFlow();
			}
		}
		catch (error) {
			console.log(error);
			formState.setError(error);
			formState.setLoading(false);
		}
	}

	return (
		<LoadingBlock isLoading={formState.loading}>

			<form name="loginForm">
				<Chunk>
					<TextInput
						id="email"
						autoCompleteType="username"
						value={formState.getFieldValue('email')}
						onChange={e => formState.setFieldValue('email', e.target.value)}
						keyboardType="email-address"
						placeholder="Email"
						onSubmitEditing={onSubmit}
						spellCheck={false}
					/>
					<PasswordInput
						placeholder="Password"
						id="password"
						autoCompleteType="current-password"
						value={formState.getFieldValue('password')}
						onChange={e => formState.setFieldValue('password', e.target.value)}
						onSubmitEditing={onSubmit}
					/>
					<Touch onPress={() => {
						dispatch(updateUi({
							logInModalVisible: false,
							loginModalOptions: {}
						}))
						Router.push({ pathname: getRequestPasswordPageUrl(), query: { email: formState.getFieldValue('email') } })
					}}
					>
						<Text type="small" color="hint">Forgot password?</Text>
					</Touch>
				</Chunk>
				<Chunk>
					<Button
						onPress={onSubmit}
						accessibilityRole="submit"
						isLoading={formState.loading}
						label="Log in"
						style={{ minWidth: 120 }}
					/>

				</Chunk>
			</form>
		</LoadingBlock>
	);
};


export const RegisterLocalForm = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	const redirect = getLoginRedirect(props.redirectOverride);

	const dispatch = useDispatch();

	const formState = useFormState({
		initialFields: {
			email: '',
			password: '',
		},
		toastableErrors: {
			BadRequest: 'Something went wrong',
			NotAuthenticated: 'Not signed in'
		},
		addToast: msg => dispatch(addToast(msg))
	});


	const submitForm = async () => {

		const submitFields = { ...formState.fields, fillTempValues: true };

		let error = runValidations(submitFields, {
			email: {
				notEmpty: {
					msg: "Email can't be blank"
				},
				isEmail: {
					msg: "Email must be a valid email address"
				}
			},
			password: {
				notEmpty: {
					msg: "Password can't be blank"
				},
				len: {
					args: [8, undefined],
					msg: "Password must be at least 8 characters long"
				}
			},
		});


		formState.setError(error);
		if (!error) {
			formState.setLoading(true);
			try {
				// create user
				const user = await request(getUserUrl(), {
					method: 'POST',
					data: submitFields
				});
				// feathers client auth
				feathersClient.authenticate({
					strategy: 'local',
					email: submitFields.email,
					password: submitFields.password
				})

				// save redirect for once reg/auth is done
				saveLoginRedirect(redirect)

				// push to remainder of profile form
				Router.push({ pathname: getProfileEditPageUrl(), query: { isSignup: true } })
			}
			catch (error) {
				console.log(error);
				formState.setError(error);
				formState.setLoading(false);
			}
		}
	}

	return (

		<form>
			<Chunk>
				<TextInput
					placeholder="Email address"
					id="email"
					autoCompleteType="email"
					textContentType="emailAddress"
					keyboardType="email-address"
					spellCheck={false}
					value={formState.getFieldValue('email')}
					onChange={e => formState.setFieldValue('email', e.target.value)}
				/>
				<FieldError error={formState.error?.fieldErrors?.email} />

				<PasswordInput
					placeholder="Pick a password"
					id="password"
					autoCompleteType="new-password"
					value={formState.getFieldValue('password')}
					onChange={e => formState.setFieldValue('password', e.target.value)}
				/>

				<FieldError error={formState.error?.fieldErrors?.password} />
				<Text type="small" color="hint">
					Must be at least 8 characters long
				</Text>
			</Chunk>
			<Chunk>
				<Button
					label="Sign up"
					onPress={submitForm}
					isLoading={formState.loading}
					style={{ minWidth: 120 }}
				/>
			</Chunk>
		</form>

	);

}

export const PasswordInput = (props) => {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

	const [passwordMasked, setPasswordMasked] = useState(true);

	return (
		<>
			{ passwordMasked &&
				<View>
					<TextInput
						secureTextEntry={true}
						placeholder={props.placeholder}
						id={props.id}
						autoCompleteType={props.autoCompleteType}
						value={props.value}
						onChange={props.onChange}
						style={props.style}
					/>
					<View style={{ position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' }}>
						<Touch onPress={() => setPasswordMasked(!passwordMasked)}>
							<Icon
								shape="EyeOff"
								color={SWATCHES.textHint}
							/>
						</Touch>
					</View>
				</View>
			}
			{ !passwordMasked &&
				<View>
					<TextInput
						placeholder={props.placeholder}
						id={props.id}
						autoCompleteType={props.autoCompleteType}
						value={props.value}
						onChange={props.onChange}
						style={props.style}
					/>
					<View style={{ position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' }}>
						<Touch onPress={() => setPasswordMasked(!passwordMasked)}>
							<Icon
								shape="Eye"
								color={SWATCHES.textHint}
							/>
						</Touch>
					</View>
				</View>
			}
		</>
	);
}

export const SectionWithLabelBorder = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	return (
		<Section border>
			<View style={{ position: 'absolute', top: -13, left: 0, right: 0, alignItems: 'center' }}>
				<Text type="small" weight="strong" style={{ backgroundColor: 'white', paddingHorizontal: 10 }}>OR</Text>
			</View>
			{props.children}
		</Section>
	)
}

export const getLoginRedirect = (redirectOverride = {}) => {
	const router = useRouter();
	return {
		pathname: router.pathname,
		query: router.query,
		...redirectOverride
	}
};

export const OauthButtons = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	const [loadingGoogle, setLoadingGoogle] = useState(false);
	const [loadingApple, setLoadingApple] = useState(false);
	const redirect = getLoginRedirect(props.redirectOverride);

	return (
		<>
			<Button
				isLoading={loadingGoogle}
				width="full"
				color="secondary"
				label="Continue with Google"
				onPress={() => {
					saveLoginRedirect(redirect);
					setLoadingGoogle(true);
					location.href = `${apiHost}/oauth/google/`
				}}
			/>
			<Button
				isLoading={loadingApple}
				width="full"
				color="secondary"
				label="Continue with Apple"
				onPress={() => {
					saveLoginRedirect(redirect);
					setLoadingApple(true);
					location.href = `${apiHost}/oauth/apple/`
				}}
			/>
		</>
	);
}

export const LoginHeader = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	const {
		toggleOnPress,
		toggleHref
	} = props;
	const TouchComponent = toggleHref ? Link : Touch

	return (
		<>
			<Text type="pageHead">Log in</Text>
			<Text color="secondary" type="small" style={{ marginTop: 3 }}>No account yet? <TouchComponent onPress={toggleOnPress} href={toggleHref}><Text color="tint" type="small">Sign up</Text></TouchComponent></Text>
		</>
	);
}

export const RegisterHeader = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	const {
		toggleOnPress = () => { },
		toggleHref = null
	} = props;
	const TouchComponent = toggleHref ? Link : Touch

	return (
		<>
			<Text type="pageHead">Sign up</Text>
			<Text color="secondary" type="small" style={{ marginTop: 3 }}>Already have an account? <TouchComponent onPress={toggleOnPress} href={toggleHref}><Text color="tint" type="small">Log in</Text></TouchComponent></Text>
		</>
	);
}

export const RegisterForm = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	return (
		<>
			<Section>
				<RegisterLocalForm
					redirectOverride={props.redirectOverride}
				/>
			</Section>
			<SectionWithLabelBorder>
				<Chunk>
					<OauthButtons
						redirectOverride={props.redirectOverride}
					/>
				</Chunk>
			</SectionWithLabelBorder>
		</>
	);
}

export const LoginForm = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	return (
		<>
			<Section>
				<LoginLocalForm
					callbackForNonRedirectFlow={props.callbackForNonRedirectFlow}
					redirectOverride={props.redirectOverride}
				/>
			</Section>
			<SectionWithLabelBorder>
				<Chunk>
					<OauthButtons
						redirectOverride={props.redirectOverride}
					/>
				</Chunk>
			</SectionWithLabelBorder>
		</>
	);
}

