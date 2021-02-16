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

const categories = [
   {name: 'Personal finance'},
   {name: 'Health & fitness'},
   {name: 'Social'},
   {name: 'Travel'},
   {name: 'Career'},
   {name: 'Parenting'},
   {name: 'Emergency preparedness'},
   {name: 'Self-care'},
   {name: 'Home Ec'},
   {name: 'Cooking'},
   {name: 'Arts'},
];

function TldrHome(props) {

		const dispatch = useDispatch(); 
		const authentication = useSelector(state => state.authentication);
		const user = authentication.user || {};
		const {data: tldrsData, error: tldrsError, mutate: tldrsMutate} = useTldrs();
		

		return (
			<Page>


				{ categories && 
					<Stripe>
					<Bounds>

							<Section>
								
								<List
									variant={{
										small: 'grid',
									}}
									itemsInRow={{
										small: 1,
										medium: 2,
										large: 4
									}}
									scrollItemWidth={300}
									items={categories}
									renderItem={(item, i)=>(
										<Chunk key={i}>
                                 <Text>{item.name}</Text>
											<View style={{marginRight: 10, marginBottom: 14, marginTop: 4}}>
												<TldrCardSmall 
                                       tldr={tldrsData ? tldrsData[0] : {}} 
                                       style={{marginVertical: 0, zIndex: 10}}
                                       />
                                    <Card 
                                       style={{marginVertical: 0, position: 'absolute', top: 5, right: -5, bottom: -5, left: 5, zIndex: 9}}
                                       />
                                     <Card 
                                       style={{marginVertical: 0, position: 'absolute', top: 10, right: -10, bottom: -10, left: 10, zIndex: 8}}
                                       />   
											</View>
                                 <Text>1,263 cards</Text>
										</Chunk>
									)}
									/>
							</Section>
							
					</Bounds>
				</Stripe>
				}
			</Page>
		);


}

TldrHome.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const {store, req, pathname, query} = context;
	//const userId = query.userId || 4; // for now
	const isServer = !!req;	

	return {
		//userId: userId,
		isServer,
	}
}

const listItemStyle = {
	borderTopColor: swatches.border,
	borderTopWidth: 1,
	paddingTop: METRICS.space
}




export default TldrHome;