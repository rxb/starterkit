import React, {Fragment, useState, useEffect, useCallback, useRef } from 'react';

// SWR
import { request, getUserUrl } from '@/swr';
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
import Page from 'components/Page';
import TldrHeader from 'components/tldr/TldrHeader';
import Router from 'next/router'
import Head from 'next/head'


// STYLE
import styles from 'modules/cinderblock/styles/styles';
import swatches from 'modules/cinderblock/styles/swatches';
import {METRICS, EASE} from 'modules/cinderblock/designConstants';

// SCREEN-SPECIFIC
import { RegisterForm } from 'components/authComponents';




const Register = (props) => {

   return (
      <Page>
         <TldrHeader />
         <Stripe>
            <Bounds style={{maxWidth: 480}}>
               <Section>
                  <Chunk>
                     <Text type="pageHead">Sign up</Text>
                  </Chunk>
               </Section>
               <RegisterForm />
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



