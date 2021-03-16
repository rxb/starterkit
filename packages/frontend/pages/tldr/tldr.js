import React, {Fragment, useState} from 'react';

import { request, getTldrUrl } from '@/swr';
import useSWR, { mutate }  from 'swr';

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

import {TldrCardSmall, TldrCard} from './components';


import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)


const ConnectedHeader = (props) => {

	const media = useMediaContext();

	return(
		<Header position="static">
			<Flex direction="row">
				<FlexItem>
						<Link href="./tldr">
							<Text type={ media.medium ? 'sectionHead' : 'big'} color="tint" style={{fontWeight: 700}}>tldr</Text>
						</Link>
				</FlexItem>
				<FlexItem shrink justify="center">
						<Touch onPress={()=>{
							alert('TODO: like, a menu or something');
						}}>
							<Icon shape="Menu" color={swatches.tint} />
						</Touch>
				</FlexItem>
			</Flex>
		</Header>
	);
};



const DownVotePrompt = (props) => {
	const {
		onRequestClose
	} = props;
	return (
		<Section>
			<Chunk>
				<Text type="sectionHead">Thanks for the feedback</Text>
			</Chunk>
			<Chunk>
				<Text>Something something about making TLDR.cards even better</Text>
			</Chunk>
			<Chunk>
				<Button
					onPress={onRequestClose}
					label="Open an issue"
					width="full"
					/>
				<Button
					onPress={onRequestClose}
					color="secondary"
					label="Report this card"
					width="full"
					/>
			</Chunk>
		</Section>
	);
};


const DeletePrompt = (props) => {
	const {
		onRequestClose
	} = props;
	return (
		<Section>
			<Chunk>
				<Text type="sectionHead">Delete this card?</Text>
			</Chunk>
			<Chunk>
				<Text>Something something about deleting cards</Text>
			</Chunk>
			<Chunk>
				<Button
					onPress={onRequestClose}
					label="Delete card"
					width="full"
					/>
				<Button
					onPress={onRequestClose}
					color="secondary"
					label="Never mind"
					width="full"
					/>
			</Chunk>
		</Section>
	);
};


function Tldr(props) {

		const dispatch = useDispatch(); 
		const authentication = useSelector(state => state.authentication);
		const user = authentication.user || {};

		const {data: tldrData} = useSWR( [getTldrUrl(props.tldrId), authentication.accessToken],  {initialData: props.tldr});



		if( !tldrData )
			return <View />

		return (
			<Page>
				<TldrHeader />

				<Stripe style={{/*paddingTop: 0,*/ backgroundColor: swatches.notwhite}}>

					<Bounds>

							<Flex direction="column" switchDirection="large">

								<FlexItem growFactor={1}>
									<Section style={{ paddingBottom: 0}}>
										<Chunk>
											<TldrCard tldr={tldrData} />
										</Chunk>
									</Section>
								</FlexItem>

								<FlexItem growFactor={0} style={{flexBasis: 350, flex: 0}}>
									<Section>
										{/*
										<Chunk border style={{marginTop: METRICS.space*2}}>
											<Flex flush>
												<FlexItem justify="center" align="center" flush>
													<Text type="sectionHead">686</Text>
													<Text type="micro" color="secondary">53% positive</Text>
												</FlexItem>
												<FlexItem flush>
													<Flex flush>
														<FlexItem flush>
															<Button
																color="secondary"
																width="full"
																style={{borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1, marginRight: 1}}
																>
																<Icon 
																	shape="ArrowUp" 
																	color={swatches.tint} 
																	/>
															</Button>
														</FlexItem>
														<FlexItem flush>
															<Button
																color="secondary"
																width="full"
																style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0, flex: 1}}
																>
																<Icon 
																	shape="ArrowDown" 
																	color={swatches.tint} 
																	/>
															</Button>
														</FlexItem>
													</Flex>
												</FlexItem>
											</Flex>
										</Chunk>
										*/}
										<Flex style={{marginTop: METRICS.space*2.5}}>
											<FlexItem shrink>
												<Chunk>
													<Button
														color="secondary"
														style={{borderBottomRightRadius: 0, borderBottomLeftRadius: 0, marginBottom: 1}}
														shape="ArrowUp"
														onPress={()=>{
															setTimeout(() =>{
																dispatch(addToast("Thanks for the feedback"))
															}, 300);
														}}
														/>
													<Button
														style={{borderTopRightRadius: 0, borderTopLeftRadius: 0, marginTop: 1}}
														color="secondary"
														shape="ArrowDown"
														onPress={()=>{
															setTimeout(() =>{
																dispatch(addPrompt(<DownVotePrompt/>))
															}, 300);
														}}
														/>
												</Chunk>
											</FlexItem>
											<FlexItem justify="center">
												<Chunk>
													<Text type="big">18.7k</Text>
													<Text type="micro" color="hint">95% positive</Text>
												</Chunk>
											</FlexItem>
										</Flex>

										<Chunk border>
											<Button 
												shape="Edit"
												label="Edit card"
												width="full"
												color="secondary"
												href={`/tldr/versionedit?tldrId=${tldrData.id}`}
												/>
											<Flex>
												<FlexItem>
														<Button 
															shape="Share2" 
															color="secondary" 
															width="full"
															/>
															<Text type="micro" color="hint" style={{alignSelf: 'center'}}>Share</Text>
												</FlexItem>
												<FlexItem>
														<Button 
															shape="Bookmark" 
															color="secondary" 
															width="full"
															/>
															<Text type="micro" color="hint" style={{alignSelf: 'center'}}>Save</Text>
												</FlexItem>
												<FlexItem>
														<Button 
															shape="DownloadCloud" 
															color="secondary" 
															width="full"
															/>
															<Text type="micro" color="hint" style={{alignSelf: 'center'}}>Download</Text>

												</FlexItem>
											</Flex>


										</Chunk>
										

											<Chunk border>
												<Flex>
													<FlexItem>
														<Text weight="strong">Open issues (13)</Text>
														<Text type="small" color="secondary">Help improve this card</Text>
													</FlexItem>
													<FlexItem shrink justify="center" style={{paddingHorizontal: 3}}>
														<Icon
															color={swatches.textSecondary}
															shape="MessageCircle"
															/>
													</FlexItem>
												</Flex>
											</Chunk>
											
											<Chunk border>
												<Link href={`/tldr/tldrprofile?userId=${tldrData.author.id}`}>
													<Flex>
														<FlexItem>
															<Text weight="strong">Maintainer</Text>
															<Text type="small" color="secondary">@rxb • Richard Boenigk</Text>
														</FlexItem>
														<FlexItem shrink justify="center" style={{paddingHorizontal: 3}}>
															<Avatar 
																size="small"
																source={{uri: 'https://randomuser.me/api/portraits/women/28.jpg'}} />
														</FlexItem>
													</Flex>
												</Link>
											</Chunk>
											<Chunk border>
												<Inline>
													<Link href={`/tldr/edit?tldrId=${tldrData.id}`}>
														<Text type="small" color="hint">Settings</Text>
													</Link>
														<Text type="small" color="hint"> </Text>
													<Touch onPress={() => { 
														dispatch(addPrompt(<DeletePrompt/>))
													}}>
														<Text type="small" color="hint">Delete</Text>		
													</Touch>
												</Inline>
											</Chunk>
									</Section>

								</FlexItem>
							</Flex>

					</Bounds>
				</Stripe>
				<Stripe style={{backgroundColor: swatches.backgroundShade}}>
					<Bounds>

							<Section>
								<Chunk>
									<Text type="sectionHead">Related cards</Text>
								</Chunk>
								<List
									variant={{
										small: 'scroll',
										medium: 'grid'
									}}
									itemsInRow={{
										small: 1,
										medium: 2,
										large: 4
									}}
									scrollItemWidth={300}
									
									items={[
										tldrData,
										tldrData,
										tldrData,
										tldrData,
									]}
									
									renderItem={(item, i)=>{
										return(
											<Chunk key={i}>
												<Link 
													href={`/tldr/tldr?tldrId=${item.id}`}
													>
													<TldrCardSmall tldr={item} />
												</Link>
											</Chunk>
										);
									}}
									/>

							</Section>

					</Bounds>
				</Stripe>
			</Page>
		);


}

Tldr.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const {store, req, pathname, query} = context;
	const tldrId = query.tldrId;
	const isServer = !!req;	

	// fetch and pass as props during SSR, using in the useSWR as intitialData
	const tldr = (isServer) ? await request(getTldrUrl(tldrId)) : undefined;

	return {
		tldrId: tldrId,
		isServer,
		tldr
	}
}

const listItemStyle = {
	borderTopColor: swatches.border,
	borderTopWidth: 1,
	paddingTop: METRICS.space
}




export default Tldr;