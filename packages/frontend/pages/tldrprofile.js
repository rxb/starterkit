import React, {Fragment, useState} from 'react';

import {
	useTldrs
} from '../swr';

import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast } from '../actions';


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
} from '../components/cinderblock';

import styles from '../components/cinderblock/styles/styles';
import swatches from '../components/cinderblock/styles/swatches';
import { sleep } from '@/components/cinderblock/utils';
import { METRICS } from '../components/cinderblock/designConstants';
import Page from '../components/Page';



import Markdown from 'markdown-to-jsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)


const TldrCardSmall = (props) => {

	const {
		tldr
	} = props;
	const content = tldr.currentTldrVersion.content;

	return(
			<Card style={[
				{minHeight: 180} 
				]}>
				<Sectionless
					style={{
						borderTopWidth: 5,
						borderTopColor: swatches.tint,
						paddingTop: METRICS.space
					}}
					>
					<Chunk>
						<Text type="small" color="hint">someuser/{tldr.id}</Text>
						<Text type="big">{content.title}</Text>
					</Chunk>
					<Chunk>
						<Text color="secondary" style={{fontStyle: 'italic'}}>{content.blurb}</Text>
					</Chunk>
				</Sectionless>
			</Card>

	);

}


function TldrProfile(props) {

		const dispatch = useDispatch(); 
		const authentication = useSelector(state => state.authentication);
		const user = authentication.user || {};
		const {data: tldrsData, error: tldrsError, mutate: tldrsMutate} = useTldrs({authorId: user.id});
		
		

		return (
			<Page>

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
					<Stripe>
					<Bounds>
							<Section>
								<Chunk>
									<Avatar
										source={{uri: user.photoUrl}}
										size="xlarge"
										/>
								</Chunk>
								<Chunk>
									<Text type="pageHead">{user.name}</Text>
								</Chunk>
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
											<Link href={`/tldr?tldrId=${item.id}`}>
												<TldrCardSmall tldr={item} />
											</Link>
										</Chunk>
									)}
									/>
							</Section>
							<Section border>
								<Flex>
									<FlexItem justify="center">
										<Chunk>
											<Text type="sectionHead">Saved ({tldrsData.length})</Text>
										</Chunk>		
									</FlexItem>
									<FlexItem shrink>
									</FlexItem>
								</Flex>
								<Chunk>
									jlksdjf
								</Chunk>
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