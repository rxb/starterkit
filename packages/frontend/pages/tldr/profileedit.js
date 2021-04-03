import React, {Fragment, useState, useEffect, useCallback, useRef } from 'react';

// SWR
import { request, parsePageObj, getUserUrl } from '@/swr';
import useSWR, { mutate }  from 'swr';

// REDUX
import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast, addDelayedToast } from '@/actions';

// URLS
import {getTldrPageUrl, getVersionEditPageUrl} from './urls';

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
} from '@/components/cinderblock';
import Page from '@/components/Page';
import TldrHeader from './TldrHeader';
import Router from 'next/router'
import Head from 'next/head'

// STYLE
import styles from '@/components/cinderblock/styles/styles';
import swatches from '@/components/cinderblock/styles/swatches';
import {METRICS, EASE} from '@/components/cinderblock/designConstants';

// SCREEN-SPECIFIC
//import { Animated } from '@/components/cinderblock/primitives';
import { runValidations, readFileAsDataUrl } from '@/components/cinderblock/utils';



const editValidations = {
   urlKey: {
      // TODO: add client-side uniqueness validation 
      // (server will catch it for now)
      notEmpty: {
          msg: "Link can't be blank"
      },
   },
   category: { 
      notNull: {
         msg: "Pick a category"
      },
   }
};

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
         password: '',
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
      const error = runValidations(formState.fields, editValidations);
		formState.setError(error);
      if(!error){
         formState.setLoading(true);
         try{
            // PATCH or POST
            if(tldrId != undefined){
               const tldr = await request( getTldrUrl(tldrId), {
                  method: 'PATCH', 
                  data: formState.fields,
                  token: authentication.accessToken
               });
               const toastMessage = "Settings updated!";
               dispatch(addDelayedToast(toastMessage));
               Router.push({pathname: getTldrPageUrl(), query: {tldrId: tldr.id}})  
            }
            else{
               const tldr = await request( getTldrUrl(), {
                  method: 'POST', 
                  data: formState.fields,
                  token: authentication.accessToken
               });
               const toastMessage = "Great, now you can write the first version of your card";
               dispatch(addDelayedToast(toastMessage));
               Router.push({pathname: getVersionEditPageUrl(), query: {tldrId: tldr.id}})   
            }
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
                        <Label for="urlKey">URL</Label>
                        <TextInput
                           spellCheck={false}
                           id="urlKey"
                           value={formState.getFieldValue('urlKey')}
                           onChange={e => formState.setFieldValue('urlKey', cleanUrlKey(e.target.value)) }
                           />
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
                                    // comes from server, doesn't get sent back to server
                                    formState.setFieldValue('photoUrl', URL.createObjectURL(file))
                                    // comes from server, gets sent back to server
                                    formState.setFieldValue('photoId', false)
                                    // only exists client -> server
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
                        <FieldError error={formState.error?.fieldErrors?.urlKey} />	
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
                        <FieldError error={formState.error?.fieldErrors?.urlKey} />	
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



