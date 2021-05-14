import React, {Fragment, useState, useEffect, useCallback, useRef , useContext} from 'react';

// SWR
import { request, getUserUrl } from '@/swr';
import useSWR, { mutate }  from 'swr';

// REDUX
import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast, addDelayedToast } from '@/actions';

// URLS
import { getProfileEditPageUrl} from 'components/tldr/urls';

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
	useFormState,
	ThemeContext
} from 'cinderblock';
import Router from 'next/router'






// SCREEN-SPECIFIC
//import { Animated } from '@/components/cinderblock/primitives';
import {Utils} from 'cinderblock';
const { runValidations, pushError, readFileAsDataUrl } = Utils;
import feathersClient from 'components/FeathersClient';

const cleanUrlKey = (dirtyUrlKey) => {
   return dirtyUrlKey.replace(/[^A-Za-z0-9-\s]+/gi, "")
            .replace(/\s+/gi,"-")
            .replace(/[-]+/gi, "-")
            .toLowerCase();
}


const Register = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

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
      
      /*
      // custom frontend password confirmation match
      if(submitFields["password"] != submitFields["confirm-password"]){
         error = pushError(error, "password", "Your passwords don't match")
      }
      */

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
									color={SWATCHES.textHint}
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
									color={SWATCHES.textHint}
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

export default Register;



