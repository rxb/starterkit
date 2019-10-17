import React, {Fragment} from 'react';

import {
	Button,
	Chunk,
	LoadingBlock,
	Text,
	TextInput,
	withFormState
} from './cinderblock';

// TODO: maybe this should be a connected component. it's always used the same way.

const LoginForm = withFormState((props) => {
	return(

			<form name="loginForm">
				<Chunk>
					<TextInput
						id="email"
						value={props.getFieldValue('email')}
						onChange={ e => props.setFieldValue('email', e.target.value) }
						keyboardType="email-address"
						placeholder="email"
						onSubmitEditing={props.handleSubmit}
						/>
					<TextInput
						id="password"
						value={props.getFieldValue('password')}
						onChange={ e => props.setFieldValue('password', e.target.value) }
						secureTextEntry={true}
						placeholder="password"
						onSubmitEditing={props.handleSubmit}
						/>
				</Chunk>
				<Chunk>
					<Button
						onPress={props.handleSubmit}
						accessibilityRole="submit"
						isLoading={props.isLoading}
						label="Log in"
						width="full"
						/>
				</Chunk>
			</form>

	);
});

export default LoginForm;