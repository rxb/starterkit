import React, {Fragment} from 'react';

import {
	Button,
	Chunk,
	LoadingBlock,
	Text,
	TextInput,
	useFormState,
} from './cinderblock';

// TODO: maybe this should be a connected component. it's always used the same way.

const LoginForm = (props) => {
	
	const formState = useFormState(props);

	return(

			<form name="loginForm">
				<Chunk>
					<TextInput
						id="email"
						value={formState.getFieldValue('email')}
						onChange={ e => formState.setFieldValue('email', e.target.value) }
						keyboardType="email-address"
						placeholder="email"
						onSubmitEditing={formState.handleSubmit}
						/>
					<TextInput
						id="password"
						value={formState.getFieldValue('password')}
						onChange={ e => formState.setFieldValue('password', e.target.value) }
						secureTextEntry={true}
						placeholder="password"
						onSubmitEditing={formState.handleSubmit}
						/>
				</Chunk>
				<Chunk>
					<Button
						onPress={formState.handleSubmit}
						accessibilityRole="submit"
						isLoading={props.isLoading}
						label="Log in"
						width="full"
						/>
				</Chunk>
			</form>

	);
};

export default LoginForm;