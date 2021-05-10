import React, {Fragment, useState, useEffect, useCallback, useRef } from 'react';

// SWR
import { request, getAuthManagmentUrl } from '@/swr';
import useSWR, { mutate }  from 'swr';

// REDUX
import {connect, useDispatch, useSelector} from 'react-redux';
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
	useFormState
} from 'cinderblock';
import Page from '@/components/Page';
import TldrHeader from '../../components/tldr/TldrHeader';
import Router from 'next/router'
import Head from 'next/head'

// STYLE
import {styles} from 'cinderblock';
import {swatches} from 'cinderblock';
import {DesignConstants} from 'cinderblock';
const {METRICS, EASE} = DesignConstants;

// SCREEN-SPECIFIC
import {Utils} from 'cinderblock';
const { runValidations, pushError, readFileAsDataUrl } = Utils;
import feathersClient from 'components/FeathersClient';


const PasswordRequest = (props) => {

   const { email = "" } = props;

   const dispatch = useDispatch(); 

   const [requestSentTo, setRequestSentTo] = useState();

   const formState = useFormState({
      initialFields: {
         email: email
      },
      toastableErrors: {
         BadRequest: 'Something went wrong',
      },
      addToast: msg => dispatch(addToast(msg))
   }); 

   const submitForm = async () => {
      const submitFields = { ...formState.fields};
      let error = runValidations(submitFields, {
         email: {
            notEmpty: {
                msg: "Email can't be blank"
            },
            isEmail: {
               msg: "Email must be a valid email address"
            }
         },
      });
      
      // display errors that exist
		formState.setError(error);

      // if no errors, let's submit
      if(!error){
         formState.setLoading(true);
         try{
            // update password
            const requestUser = await request( getAuthManagmentUrl(), {
               method: 'POST', 
               data: {
                  action: 'sendResetPwd',
                  value: {
                     email: submitFields.email
                  }
               }
            });
            formState.setLoading(false);
            setRequestSentTo(submitFields.email);
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

                       {!requestSentTo && 
                           <>
                           <Chunk>
                              <Label for="email">Email address</Label>
                              <TextInput
                                 spellCheck={false}
                                 id="email"
                                 autoCompleteType="email"
                                 keyboardType="email-address"
                                 value={formState.getFieldValue('email')}
                                 onChange={e => formState.setFieldValue('email', e.target.value) }
                                 />
                              <FieldError error={formState.error?.fieldErrors?.email} />	
                           </Chunk>
                           <Chunk>
                              <Button 
                                 label="Submit"
                                 onPress={ submitForm }
                                 isLoading={formState.loading}
                                 />
                           </Chunk>
                           </>
                        }

                        <RevealBlock visible={requestSentTo}>
                           <Chunk>
                              <Text>Email sent to {requestSentTo}.</Text>
                              <Text>Go click the link in the email to reset your password.</Text>
                           </Chunk>
                           <Chunk>
                              <Button 
                                 color="secondary"
                                 onPress={()=>setRequestSentTo(null)}
                                 label="Resend email"
                                 />
                           </Chunk>
                        </RevealBlock>

                     </form>
                  </Section>
               </Bounds>
            </Stripe>
         </Page>
      );
   
}

PasswordRequest.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const {store, req, pathname, query} = context;
   const {email} = query;
   const isServer = !!req;	
	return {
		isServer,
      email
	}
}


export default PasswordRequest;



