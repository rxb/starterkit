import React, {Fragment, useState, useEffect, useCallback, useRef } from 'react';

// SWR
import { request, parsePageObj, getUserUrl } from '@/swr';
import useSWR, { mutate }  from 'swr';

// REDUX
import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast, addDelayedToast } from '@/actions';

// URLS
import { getProfileEditPageUrl} from '../../components/tldr/urls';

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
import Page from '@/components/Page';
import TldrHeader from '../../components/tldr/TldrHeader';
import Router from 'next/router'
import Head from 'next/head'


// STYLE
import styles from 'modules/cinderblock/styles/styles';
import swatches from 'modules/cinderblock/styles/swatches';
import {METRICS, EASE} from 'modules/cinderblock/designConstants';

// SCREEN-SPECIFIC
//import { Animated } from '@/components/cinderblock/primitives';
import { runValidations, pushError, readFileAsDataUrl } from 'modules/cinderblock/utils';
import feathersClient from 'components/FeathersClient';


const cleanUrlKey = (dirtyUrlKey) => {
   return dirtyUrlKey.replace(/[^A-Za-z0-9-\s]+/gi, "")
            .replace(/\s+/gi,"-")
            .replace(/[-]+/gi, "-")
            .toLowerCase();
}


const Register = (props) => {

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
      
      const submitFields = {...formState.fields};

      let error = runValidations(submitFields, {
         /*
         urlKey: {
            // TODO: add client-side uniqueness validation 
            // (server will catch it for now)
            notEmpty: {
                msg: "Username can't be blank"
            },
            is: {
               args: /^[a-zA-Z0-9-]*$/,
               msg: "Username can only include letters, numbers, and dashes"
            },
         },
         name: {
            notEmpty: {
                msg: "Name can't be blank"
            }
         },
         */
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
      <Page>
         <TldrHeader />
         <Stripe>
            <Bounds style={{maxWidth: 640}}>
               <Section>
                  <Chunk>
                     <Text type="pageHead">Register</Text>
                  </Chunk>
               </Section>
               <Section>
                  <form>
                     <Chunk>
                        <Label for="email">Email</Label>
                        <TextInput
                           id="email"
                           autoCompleteType="email"
                           textContentType="emailAddress"
                           keyboardType="email-address"
                           value={formState.getFieldValue('email')}
                           onChange={e => formState.setFieldValue('email', e.target.value) }
                           />
                        <FieldError error={formState.error?.fieldErrors?.email} />	
                     </Chunk>
                     <Chunk>
                        <Label for="password">Pick a password</Label>
                        { passwordMasked &&
                        <TextInput
                           id="password"
                           secureTextEntry={true}
                           autoCompleteType="new-password"
                           value={formState.getFieldValue('password')}
                           onChange={e => formState.setFieldValue('password', e.target.value) }
                           />
                        }
                        { !passwordMasked &&
                        <TextInput
                           id="password"
                           autoCompleteType="new-password"
                           value={formState.getFieldValue('password')}
                           onChange={e => formState.setFieldValue('password', e.target.value) }
                           />
                        }
                        {/*
                        <TextInput
                           id="confirm-password"
                           placeholder="Retype new password to confirm"
                           secureTextEntry={true}
                           autoCompleteType="new-password"
                           value={formState.getFieldValue('confirm-password')}
                           onChange={e => formState.setFieldValue('confirm-password', e.target.value) }
                           />
                        */}
                        <FieldError error={formState.error?.fieldErrors?.password} />	
                        <Text type="small" color="hint">
                           Must be at least 8 characters long
                           { formState.getFieldValue('password').length &&
                              <>
                              <Text type="small" color="hint">. </Text>
                              <Touch onPress={()=>{
                                 setPasswordMasked(!passwordMasked);
                              }}><Text type="small" color="tint">{passwordMasked  ? 'Unhide password' : 'Hide password'}</Text></Touch>
                              </>
                           }
                        </Text>
                     </Chunk>
                     <Chunk>
                        <Button 
                           label="Register"
                           onPress={ submitForm }
                           isLoading={formState.loading}
                           />
                     </Chunk>
                     
                  </form>
                  
               </Section>

            </Bounds>
         </Stripe>
      </Page>
   );
  
   
}

Register.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const {store, req, pathname, query} = context;
   const isServer = !!req;	
	return {
		isServer,
	}
}


export default Register;



