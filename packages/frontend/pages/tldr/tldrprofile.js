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
import TldrHeader from '@/components/TldrHeader';


import {TldrCardSmall} from './components';

import Markdown from 'markdown-to-jsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)



function TldrProfile(props) {

		const dispatch = useDispatch(); 
		const authentication = useSelector(state => state.authentication);
		const user = authentication.user || {};
		const {data: tldrsData, error: tldrsError, mutate: tldrsMutate} = useTldrs({authorId: user.id});
		
		

		return (
			<Page>
				<TldrHeader />

				{ !user.id && 
					<Stripe>
						<Bounds>
							<Section>
								<Chunk>
									<Text type="pageHead">Who are you??</Text>
								</Chunk>
							</Section>
						</Bounds>
					</Stripe>

				}

				{ user.id && tldrsData && 
					<Stripe style={{flex: 1, backgroundColor: swatches.notwhite}}>
						<Bounds>
							<Section>
								<Flex>
									<FlexItem>
										<Chunk>
											<Text type="pageHead">@rxb</Text>
											<Text>{user.name}</Text>
										</Chunk>
									</FlexItem>
									<FlexItem shrink justify="center">
										<Chunk>
											<Avatar
												source={{uri: user.photoUrl}}
												size="large"
												/>
										</Chunk>
									</FlexItem>
								</Flex>
								
							</Section>
							<Section border>
								<Flex>
									<FlexItem justify="center">
										<Chunk>
											<Text type="sectionHead">Author ({tldrsData.length})</Text>
										</Chunk>		
									</FlexItem>
									<FlexItem shrink>
										<Chunk>
											<Button
												size="small"
												label="Create card"
												href={`./edit`}
												/>
										</Chunk>
									</FlexItem>
								</Flex>
								
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
									items={tldrsData}
									renderItem={(item, i)=>(
										<Chunk key={i}>
											<Link href={`./tldr?tldrId=${item.id}`}>
												<TldrCardSmall tldr={item} />
											</Link>
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

TldrProfile.getInitialProps = async (context) => {
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




export default TldrProfile;