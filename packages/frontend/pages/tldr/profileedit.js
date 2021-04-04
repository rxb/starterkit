import React, {Fragment, useState, useEffect, useCallback, useRef } from 'react';

// SWR
import { request, parsePageObj, getUserUrl } from '@/swr';
import useSWR, { mutate }  from 'swr';

// REDUX
import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast, addDelayedToast } from '@/actions';

// URLS
import {getProfilePageUrl} from '../../components/tldr/urls';

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
import { runValidations, readFileAsDataUrl } from 'modules/cinderblock/utils';




const cleanUrlKey = (dirtyUrlKey) => {
   return dirtyUrlKey.replace(/[^A-Za-z0-9-\s]+/gi, "")
            .replace(/\s+/gi,"-")
            .replace(/[-]+/gi, "-")
            .toLowerCase();
}



const EditProfile = (props) => {

   const dispatch = useDispatch(); 
   const authentication = useSelector(state => state.authentication);
   
   const formState = useFormState({
      initialFields: {
         name: '',
         urlKey: '',
         email: '',
         photoUrl: '',
			photoId: '',
      },
      toastableErrors: {
         BadRequest: 'Something went wrong',
         NotAuthenticated: 'Not signed in'
      },
      addToast: msg => dispatch(addToast(msg))
   }); 

   // load user, one time (unless auth changes), reinitialize the form
   // on first load, feathersclient may not have put the auth into the store yet
   const [user, setUser] = useState();
   useEffect(()=>{
      if(authentication.accessToken){
         request( getUserUrl("self"), {token: authentication.accessToken} )
            .then( (user) => {
               setUser(user);
               formState.setFieldValues(user);
            });
      }
   }, [authentication.accessToken]);

   const submitForm = async () => {
      
      const submitFields = {...formState.fields};

      //only include password if not empty
      if( submitFields.password && submitFields.password.trim().length == 0){
         delete submitFields.password
      }

      const error = runValidations(formState.fields, {
         urlKey: {
            // TODO: add client-side uniqueness validation 
            // (server will catch it for now)
            notEmpty: {
                msg: "Username can't be blank"
            },
            is: {
               args: /^[a-zA-Z0-9-]*$/,
               msg: "Username can only include letters, numbers, and dashes"
            }
         },
         name: {
            notEmpty: {
                msg: "Name can't be blank"
            }
         },
         email: {
            notEmpty: {
                msg: "Email can't be blank"
            },
            isEmail: {
               msg: "Email must be a valid email address"
            }
         },
         password: {
            min:{
              args:8,
              msg: "Password must be at least 8 characters long"
            }
          },
      });
		formState.setError(error);
      if(!error){
         formState.setLoading(true);
         try{
            const user = await request( getUserUrl("self"), {
               method: 'PATCH', 
               data: formState.fields,
               token: authentication.accessToken
            });
            const toastMessage = "Settings updated!";
            dispatch(addDelayedToast(toastMessage));
            Router.push({pathname: getProfilePageUrl()})  
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
                     <Text type="pageHead">Profile settings</Text>
                  </Chunk>
               </Section>
               <Section>
                  <form>
                  <Chunk>
                        <Label for="name">Name</Label>
                        <TextInput
                           spellCheck={false}
                           id="name"
                           value={formState.getFieldValue('name')}
                           onChange={e => formState.setFieldValue('name', e.target.value) }
                           />
                        <FieldError error={formState.error?.fieldErrors?.name} />	
                     </Chunk>
                     <Chunk>
                        <Label for="urlKey">Username</Label>
                        <TextInput
                           spellCheck={false}
                           id="urlKey"
                           value={formState.getFieldValue('urlKey')}
                           onChange={e => formState.setFieldValue('urlKey', cleanUrlKey(e.target.value)) }
                           />
                        <Text color="hint" type="small">Only letters, numbers, and dashes (-)</Text>
                        <FieldError error={formState.error?.fieldErrors?.urlKey} />	
                     </Chunk>
                     <Chunk>
                        <Label for="photo">Photo</Label>
                        <Flex>
                           <FlexItem>
                              <FileInput
                                 id="photo"
                                 placeholder={(formState.getFieldValue('photoUrl')) ? 'Select a new file' : 'Select a file'}
                                 onChangeFile={(file)=>{
                                    /* comes from server, doesn't get sent back to server */
                                    formState.setFieldValue('photoUrl', URL.createObjectURL(file))
                                    /* comes from server, gets sent back to server */
                                    formState.setFieldValue('photoId', false)
                                    /* only exists client -> server */
                                    formState.setFieldValue('photoNewFile', file)
                                 }}
                                 />
                              { formState.getFieldValue('photoUrl') &&
                                 <FakeInput
                                    label="Remove photo"
                                    shape="X"
                                    onPress={()=>{
                                       formState.setFieldValue('photoId', false)
                                       formState.setFieldValue('photoUrl', false)
                                    }}
                                    />
                              }
                           </FlexItem>
                           { formState.getFieldValue('photoUrl') &&
                              <FlexItem shrink>
                                 <Image
                                    source={{uri: formState.getFieldValue('photoUrl') }}
                                    style={[{
                                          width: 120,
                                          flex: 1,
                                          resizeMode: 'cover',
                                          borderRadius: 4,
                                          boxSizing: 'content-box'
                                    }, styles.pseudoLineHeight]}
                                    />
                              </FlexItem>
                           }
                        </Flex>
                     </Chunk>
                     <Chunk>
                        <Label for="email">Email</Label>
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

EditProfile.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const {store, req, pathname, query} = context;
   const isServer = !!req;	
	return {
		isServer,
	}
}


export default EditProfile;



