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

const Oauth = (props) => {

   // newly-minted user, redirect to profile edit flow 

   // redirect to a valid redirect

   // send back home

   return(
      <Page>
         <TldrHeader />
         <Stripe>
            <Bounds>
               <Section>
                  <Chunk>
                     <Text>Redirecting...</Text>
                  </Chunk>
               </Section>
            </Bounds>
         </Stripe>
      </Page>
   );
}

export default Oauth;