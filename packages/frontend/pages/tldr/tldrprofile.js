import React, {Fragment, useState} from 'react';

import {
	useTldrs,
	useUser
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


import {TldrCardSmall, CreateTldrCardSmall} from './components';

import Markdown from 'markdown-to-jsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)



function TldrProfile(props) {

		const dispatch = useDispatch(); 
		const authentication = useSelector(state => state.authentication);
		const user = authentication.user || {};
		const userId  = props.userId || user.id;
		
		const {data: userData, error: userError, mutate: userMutate} = useUser(userId);
		const {data: tldrsData, error: tldrsError, mutate: tldrsMutate} = useTldrs({authorId: userId});
		
		return (
			<Page>
				<TldrHeader />

				{ userData && tldrsData && 
					<Stripe style={{flex: 1, backgroundColor: swatches.notwhite}}>
						<Bounds>
							<Section>
								<Flex>
									<FlexItem shrink justify="center">
										<Chunk>
											<Avatar
												source={{uri: userData.photoUrl}}
												size="large"
												/>
										</Chunk>
									</FlexItem>
									<FlexItem>
										<Chunk>
											<Text type="pageHead">@{userData.urlKey}</Text>
											<Text>{userData.name}</Text>
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
									items={[...tldrsData, {last: true}]}
                              renderItem={(item, i)=>{
											const href = (item.currentTldrVersion != undefined) ? 
												`/tldr/tldr?tldrId=${item.id}` :
												`/tldr/versionedit?tldrId=${item.id}`;
											return (
												<Chunk key={i}>
													{ !item.last &&
														<Link href={href}>
															<TldrCardSmall tldr={item} style={{minHeight: 160}} />
														</Link>
													}
													{ item.last &&
														<Link href={`/tldr/edit`}>
															<CreateTldrCardSmall />
														</Link>
													}
												</Chunk>
											);
										}}
									/>
							</Section>
							
							<Section border>
								<Flex>
									<FlexItem justify="center">
										<Chunk>
											<Text type="sectionHead">Saved ({tldrsData.length})</Text>
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
	const userId = query.userId;
	const isServer = !!req;	

	return {
		userId: userId,
		isServer,
	}
}

const listItemStyle = {
	borderTopColor: swatches.border,
	borderTopWidth: 1,
	paddingTop: METRICS.space
}




export default TldrProfile;