import React, {Fragment, useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator } from 'react-native';

// SWR
import { request, parsePageObj, getUserUrl } from '@/swr';
import useSWR, { mutate }  from 'swr';

// REDUX
import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast, addDelayedToast } from '@/actions';

// URLS
import { getIndexPageUrl, getProfileEditPageUrl} from '../../components/tldr/urls';

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

const Oauth = (props) => {

   const dispatch = useDispatch(); 
   const authentication = useSelector(state => state.authentication);
   const user = authentication.user;

   useEffect(()=>{
      if(user){
         if(user.profileComplete){
            // send back home
            Router.push({pathname: getIndexPageUrl()}) 
         }
         else{
            Router.push({pathname: getProfileEditPageUrl(), query: {isSignup: true, fromOauth: true}}) 
         }   
      }
   }, [user]);
   

   return(
      <Page>
         <TldrHeader />
         <Stripe style={{flex: 1}}>
            <Bounds style={{flex: 1}}>
               <Section style={{flex: 1}}>
                  <View style={styles.absoluteCenter}>
                     <Chunk>
                        <ActivityIndicator
                           size="large"
                           color={swatches.textHint}
                           />
                     </Chunk>
                  </View>
               </Section>
            </Bounds>
         </Stripe>
      </Page>
   );
}

export default Oauth;