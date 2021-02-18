import React, {Fragment, useState} from 'react';

import {
	useTldrs
} from '@/swr';

import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast } from '@/actions';


import {
	Avatar,
	Bounds,
	Button,
	Card,
	CheckBox,
	Chunk,
	Flex,
	FlexItem,
	Header,
	Icon,
	Inline,
	Image,
	Label,
	List,
	Link,
	Modal,
	Picker,
	Section,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch,
	useMediaContext,
	View,	
} from '@/components/cinderblock';

import styles from '@/components/cinderblock/styles/styles';
import swatches from '@/components/cinderblock/styles/swatches';
import { sleep } from '@/components/cinderblock/utils';
import { METRICS } from '@/components/cinderblock/designConstants';
import Page from '@/components/Page';

import {TldrCardSmall} from './components';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

function Versions(props) {

   const dispatch = useDispatch(); 
   const authentication = useSelector(state => state.authentication);
   const user = authentication.user || {};
   const {data: tldrsData, error: tldrsError, mutate: tldrsMutate} = useTldrs();
   

   return (
      <Page>
         <Text>{props.tldrId}</Text>
      </Page>
   );
}

Versions.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const {store, req, pathname, query} = context;
	const tldrId = query.tldrId;
	const isServer = !!req;	


	return {
		tldrId: tldrId,
		isServer,
	}
}

export default Versions;
