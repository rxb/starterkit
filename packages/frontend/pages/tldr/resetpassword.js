import React, {Fragment, useState, useEffect, useCallback, useRef } from 'react';

// SWR
import { request, getAuthManagmentUrl } from '@/swr';
import useSWR, { mutate }  from 'swr';

// REDUX
import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast, addDelayedToast, updateUser } from '@/actions';

// URLS
import {getIndexPageUrl} from 'components/tldr/urls';

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
import { runValidations, pushError, readFileAsDataUrl } from 'modules/cinderblock/utils';
import feathersClient from 'components/FeathersClient';


const PasswordReset = (props) => {

   const {token} = props;

   const dispatch = useDispatch(); 
   const authentication = useSelector(state => state.authentication);

   const formState = useFormState({
      initialFields: {
         password: ''
      },
      toastableErrors: {
         BadRequest: 'Something went wrong',
      },
      addToast: msg => dispatch(addToast(msg))
   }); 

   const submitForm = async () => {
      const submitFields = { ...formState.fields};
      let error = runValidations(submitFields, {
         password: {
            len:{
               args: [8, undefined],
               msg: "Password must be at least 8 characters long"
            }
          },
      });
      
      // custom frontend password confirmation match
      if(submitFields["password"] != submitFields["confirm-password"]){
         error = pushError(error, "password", "Your passwords don't match")
      }
      
      // display errors that exist
		formState.setError(error);

      // if no errors, let's submit
      if(!error){
         formState.setLoading(true);
         try{

            // update password
            const newUser = await request( getAuthManagmentUrl(), {
               method: 'POST', 
               data: {
                  action: 'resetPwdLong',
                  value: {
                     token: token,
                     password: submitFields.password
                  }
               }
            });
            console.log(newUser);

            // log in with that new password
            feathersClient.authenticate({
               strategy: 'local', 
               email: newUser.email, 
               password: submitFields.password
            })

            // toast and push
            const toastMessage = "Password updated!";
            dispatch(addDelayedToast(toastMessage));
            Router.push({pathname: getIndexPageUrl()})  
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
                        <Text type="pageHead">Reset password</Text>
                     </Chunk>
                  </Section>
                  <Section>
                     <form>
                         <Chunk>
                           <Label for="password">Set a new password</Label>
                           <TextInput
                              id="password"
                              placeholder="New password"
                              secureTextEntry={true}
                              autoCompleteType="new-password"
                              value={formState.getFieldValue('password')}
                              onChange={e => formState.setFieldValue('password', e.target.value) }
                              />
                           <TextInput
                              id="confirm-password"
                              placeholder="Retype new password to confirm"
                              secureTextEntry={true}
                              autoCompleteType="new-password"
                              value={formState.getFieldValue('confirm-password')}
                              onChange={e => formState.setFieldValue('confirm-password', e.target.value) }
                              />
                           <FieldError error={formState.error?.fieldErrors?.password} />	
                           <Text type="small" color="hint">Must be at least 8 characters long</Text>
                        </Chunk>
                        <Chunk>
                           <Button 
                              label="Save"
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

PasswordReset.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const {store, req, pathname, query} = context;
   const {token} = query;
   const isServer = !!req;	
	return {
		isServer,
      token
	}
}


export default PasswordReset;



