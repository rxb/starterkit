import React, React, {Fragment, useState, useEffect, useCallback, useRef } from 'react';

// REDUX
import { useDispatch, useSelector } from 'react-redux';
import { addPrompt, addToast, addDelayedToast, updateUi} from '@/actions';

// SWR
import { request, getUserUrl } from '@/swr';
import useSWR, { mutate }  from 'swr';

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
	useFormState
} from 'modules/cinderblock';

// STYLE
import styles from 'modules/cinderblock/styles/styles';
import swatches from 'modules/cinderblock/styles/swatches';
import {METRICS, EASE} from 'modules/cinderblock/designConstants';

// COMPONENT-SPECIFIC
import { runValidations, pushError, readFileAsDataUrl } from 'modules/cinderblock/utils';
import feathersClient from '../components/FeathersClient';
import Router from 'next/router'

// URLS
import {getProfileEditPageUrl, getRequestPasswordPageUrl} from 'components/tldr/urls';



export const LoginForm = (props) => {
	
	const dispatch = useDispatch();

	const formState = useFormState({
		'__note': 'LoginForm',
		initialFields: props.initialFields
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
					<Touch onPress={()=>{
						Router.push({pathname: getRequestPasswordPageUrl(), query: {email: formState.getFieldValue('email')} })  
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
						style={{minWidth: 120}}
						/>
					
				</Chunk>
			</form>
			</LoadingBlock>
	);
};


export const RegisterForm = (props) => {

	const dispatch = useDispatch();
   const [passwordMasked, setPasswordMasked] = useState(true);

   const formState = useFormState({
      initialFields: {
         email: null,
         password: null,
      },
      toastableErrors: {
         BadRequest: 'Something went wrong',
         NotAuthenticated: 'Not signed in'
      },
      addToast: msg => dispatch(addToast(msg))
   }); 

   
   const submitForm = async () => {
      
      const submitFields = {...formState.fields, fillTempValues: true};

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
            len:{
               args: [8, undefined],
               msg: "Password must be at least 8 characters long"
            }
          },
      });
   

		formState.setError(error);
      if(!error){
         formState.setLoading(true);
         try{
            // create user
            const user = await request( getUserUrl(), {
               method: 'POST', 
               data: submitFields
            });
            // feathers client auth
            feathersClient.authenticate({
               strategy: 'local', 
               email: submitFields.email, 
               password: submitFields.password
            })
            // toast and redirect
            const toastMessage = "Registered!";
            dispatch(addDelayedToast(toastMessage));
            Router.push({pathname: getProfileEditPageUrl(), query: {isSignup: true}})  
         }
         catch(error){
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
					value={formState.getFieldValue('email')}
					onChange={e => formState.setFieldValue('email', e.target.value) }
					/>
				<FieldError error={formState.error?.fieldErrors?.email} />	
	
				{ passwordMasked &&
					<View>
						<TextInput
							placeholder="Pick a password"
							id="password"
							secureTextEntry={true}
							autoCompleteType="new-password"
							value={formState.getFieldValue('password')}
							onChange={e => formState.setFieldValue('password', e.target.value) }
							/>
						<View style={{position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center'}}>
							<Touch onPress={ ()=>setPasswordMasked(!passwordMasked) }>
								<Icon
									shape="EyeOff"
									color={swatches.textHint}
									/>
							</Touch>
						</View>
					</View>
				}
				{ !passwordMasked &&
					<View>
						<TextInput
							placeholder="Pick a password"
							id="password"
							autoCompleteType="new-password"
							value={formState.getFieldValue('password')}
							onChange={e => formState.setFieldValue('password', e.target.value) }
							/>
						<View style={{position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center'}}>
							<Touch onPress={ ()=>setPasswordMasked(!passwordMasked) }>
								<Icon
									shape="Eye"
									color={swatches.textHint}
									/>
							</Touch>
						</View>
					</View>
				}
				<FieldError error={formState.error?.fieldErrors?.password} />	
				<Text type="small" color="hint">
					Must be at least 8 characters long
				</Text>
			</Chunk>
			<Chunk>
				<Button 
					label="Sign up"
					onPress={ submitForm }
					isLoading={formState.loading}
					style={{minWidth: 120}}
					/>
			</Chunk>
		</form>
		  
   );

}




