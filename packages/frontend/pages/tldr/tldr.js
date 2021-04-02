import React, {Fragment, useState} from 'react';

// SWR
import { request, buildQs, getTldrUrl } from '@/swr';
import useSWR, { mutate }  from 'swr';

// REDUX
import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast, addDelayedToast } from '@/actions';

// URLS
import {getProfilePageUrl, getVersionEditPageUrl, getTldrEditPageUrl, getTldrPageUrl} from './urls';

// COMPONENTS
import {
	Avatar,
	Bounds,
	Button,
	Card,
	CheckBox,
	Chunk,
	FakeInput,
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
import Page from '@/components/Page';
import TldrHeader from './TldrHeader';
import Router from 'next/router'

// STYLES
import styles from '@/components/cinderblock/styles/styles';
import swatches from '@/components/cinderblock/styles/swatches';
import { METRICS } from '@/components/cinderblock/designConstants';

// SCREEN-SPECIFIC
import {TldrCardSmall, TldrCard, DeletePrompt} from './components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)



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


const SharePrompt = (props) => {

	const {
		shareData,
		onRequestClose
	} = props;

	const openShareUrl = ( shareUrl ) => {
		window.open(shareUrl, '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
	}

	const shareTwitter = (shareData) => {
		const encodedText = encodeURIComponent(`${shareData.title} ${shareData.url}`);
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`; 
      openShareUrl(shareUrl);
	}

	const shareFacebook = (shareData) => {
		const encodedUrl = encodeURIComponent(shareData.url);
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`; 
      openShareUrl(shareUrl);
	}

	const shareReddit = (shareData) => {
		const encodedUrl = encodeURIComponent(shareData.url);
		const encodedTitle = encodeURIComponent(shareData.title);
      const shareUrl = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`; 
      openShareUrl(shareUrl);
	}

	return (
		<Section>
			<Chunk>
				<Text type="sectionHead">Let's share this thing</Text>
				<Text>Sharing is caring</Text>
			</Chunk>
			<Chunk>
				<FakeInput 
					label={shareData.url}
					shape="Copy" 
					onPress={()=>{
						try{
							navigator.clipboard.writeText(shareData.url)
							alert('Url copied'); // make this a toast	or inline message
						}
						catch(err){
							console.error(err);
						}
					}}
					/>
				<Button
					onPress={()=>{
						shareTwitter(shareData)
					}}
					shape="Twitter"
					width="full"
					label="Twitter"
					/>	
				<Button
					onPress={()=>{
						shareFacebook(shareData)
					}}
					shape="Facebook"
					width="full"
					label="Facebook"
					/>	
				<Button
					onPress={()=>{
						shareReddit(shareData)
					}}
					shape="Link"
					width="full"
					label="Reddit"
					/>						
				<Button
					onPress={onRequestClose}
					color="secondary"
					label="Cancel"
					width="full"
					/>
			</Chunk>
		</Section>
	);
};

const share = async (shareData, dispatchSharePrompt) => {
	if(navigator.share){
		try {
			await navigator.share(shareData)
		} catch(err) {
			console.error(err)
		}
	}	
	else{
		dispatchSharePrompt();
	}													
}


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
												href={ getVersionEditPageUrl({tldrId: tldrData.id}) }
												/>
											<Flex>
												<FlexItem>
														<Button 
															shape="Share2" 
															color="secondary" 
															width="full"
															onPress={()=>{
																const shareData = {
																	title: tldrData.currentTldrVersion.content.title,
																	text: tldrData.currentTldrVersion.content.blurb,
																	url: `tldr.cards/${tldrData.urlKey}`,
																}
																const dispatchSharePrompt = () => {
																	dispatch(addPrompt(<SharePrompt shareData={shareData} />))
																};
																share(shareData, dispatchSharePrompt);
															}}
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
												<Link href={ getProfilePageUrl({userId: tldrData.author.id}) }>
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
													<Link href={ getTldrEditPageUrl({tldrId: tldrData.id}) }>
														<Text type="small" color="hint">Settings</Text>
													</Link>
														<Text type="small" color="hint"> </Text>
													<Touch onPress={() => { 
														const prompt = <DeletePrompt 
															dipatch={dispatch}
															tldr={tldrData} 
															onSuccess={()=>{
																dispatch(addDelayedToast('Card deleted!'));
																Router.push( getProfilePageUrl() );
															}} 
															/>
														dispatch(addPrompt(prompt))
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
													href={ getTldrPageUrl({tldrId: item.id}) }
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