import React, {Fragment} from 'react';
import { useDispatch } from 'react-redux';

import {
	Button,
	Chunk,
	LoadingBlock,
	Text,
	TextInput,
	useFormState,
} from './cinderblock';

import feathersClient from '../components/FeathersClient';


const LoginForm = (props) => {
	
	const dispatch = useDispatch();

	const formState = useFormState({
		intitialState: props.intitialState
	});

	const onSubmit = () =>{
		formState.setLoading(true);
		feathersClient
			.authenticate({
				strategy: 'local', 
				email: formState.fields.email, 
				password: formState.fields.password
			})
			.then(()=>{
				formState.setLoading(false);
			})
			.catch((error)=>{
				console.log(error);
				formState.setLoading(false);
			});
	}

	return(
			<LoadingBlock isLoading={formState.loading}>
											
			<form name="loginForm">
				<Chunk>
					<TextInput
						id="email"
						value={formState.getFieldValue('email')}
						onChange={ e => formState.setFieldValue('email', e.target.value) }
						keyboardType="email-address"
						placeholder="email"
						onSubmitEditing={onSubmit}
						/>
					<TextInput
						id="password"
						value={formState.getFieldValue('password')}
						onChange={ e => formState.setFieldValue('password', e.target.value) }
						secureTextEntry={true}
						placeholder="password"
						onSubmitEditing={onSubmit}
						/>
				</Chunk>
				<Chunk>
					<Button
						onPress={onSubmit}
						accessibilityRole="submit"
						isLoading={formState.loading}
						label="Log in"
						width="full"
						/>
				</Chunk>
			</form>
			</LoadingBlock>
	);
};

export default LoginForm;