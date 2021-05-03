import React, {Fragment, useEffect, useState} from 'react';
import ErrorPage from 'next/error'

// SWR
import { request, buildQs, getTldrUrl } from '@/swr';
import useSWR, { mutate }  from 'swr';

// REDUX
import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast, addDelayedToast, updateUi } from '@/actions';

// URLS
import {saveLoginRedirect, getProfilePageUrl, getVersionEditPageUrl, getTldrEditPageUrl, getTldrPageUrl} from '../../components/tldr/urls';

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
} from 'modules/cinderblock';
import Page from '@/components/Page';
import TldrHeader from '../../components/tldr/TldrHeader';
import Router, {useRouter} from 'next/router'

// STYLES
import styles from 'modules/cinderblock/styles/styles';
import swatches from 'modules/cinderblock/styles/swatches';
import { METRICS } from 'modules/cinderblock/designConstants';

// SCREEN-SPECIFIC
import {TldrCardSmall, TldrCard, DeletePrompt} from '../../components/tldr/components';
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




function Tldr(props) {
		const router = useRouter();

		const dispatch = useDispatch(); 
		const authentication = useSelector(state => state.authentication);
		const user = authentication.user || {};

		const tldr = useSWR( [getTldrUrl(props.tldrId), authentication.accessToken],  {initialData: props.tldr});

		const canEdit = (user?.id && tldr?.data?.authorId && user.id == tldr.data.authorId);

		// TODO: get actual related tldrs
		const relatedTldrs = tldr.data ? 
			{ data: [ tldr.data, tldr.data, tldr.data, tldr.data, ]} :
			{data: []};

		// POST-AUTH ACTION
		// check if hash action passed back from oauth, reg
		const [postAuthAction, setPostAuthAction] = useState();
		useEffect(()=>{
			const hashAction = window.location.hash.substr(1);
			window.location.hash = '';
			setPostAuthAction(hashAction);
		}, []);
		// on login, check for valid action key and do it
		useEffect(()=>{
			if(user.id && postAuthAction){
				switch(postAuthAction){
					case 'upvoteTldr':
						upvoteTldr();
						break;
					case 'downvoteTldr':
						downvoteTldr();
						break;
					case 'saveTldr':
						saveTldr();
						break;	
				}
				setPostAuthAction(null);
			}
		}, [user.id, postAuthAction]);

		const doOrAuth = (fn, actionOnReturn, explainText) => {
			if(!authentication.accessToken){
				setPostAuthAction(actionOnReturn);
				dispatch(updateUi({
					logInModalVisible: true, 
					logInModalOptions: {
						redirect: { hash: actionOnReturn },
						explainText: explainText
					}
				}));
			}
			else{
				fn();
			}
		};

		const upvoteTldr = () => {
			doOrAuth(() => {
				setTimeout(() =>{
					dispatch(addToast("Thanks for the feedback"))
				}, 300);	
			}, "upvoteTldr", "To upvote you need to be logged in my dude");
		}

		const downvoteTldr = () => {
			doOrAuth(() => {
				setTimeout(() =>{
					dispatch(addPrompt(<DownVotePrompt/>))
				}, 300);
			}, "downvoteTldr", "To downvote you need to be logged in my dude");
		}

		const saveTldr = () => {
			doOrAuth(() => {
				setTimeout(() =>{
					alert('saved??');
				}, 300);
			}, "saveTldr", "To save you need to be logged in my dude");
		}

		const shareTldr = async (shareData) => {
			if(navigator.share){
				try {
					await navigator.share(shareData)
				} catch(err) {
					console.error(err)
				}
			}	
			else{
				dispatch(addPrompt(<SharePrompt shareData={shareData} />))
			}													
		}


		// DIVERT TO ERROR PAGE
		// error from getInitialProps or the swr
		if (props.error || tldr.error) {
			const error = props.error || tldr.error;
			return <ErrorPage statusCode={error.code} />
		}

		// RENDER
		return (
			<Page>

				<TldrHeader />

				{ tldr.data && 
					<Stripe style={{/*paddingTop: 0,*/ backgroundColor: swatches.notwhite}}>
						<Bounds>
							<Flex direction="column" switchDirection="large">
								<FlexItem growFactor={1}>
									<Section style={{ paddingBottom: 0}}>
										<Chunk>
											<TldrCard tldr={tldr.data} />
										</Chunk>
									</Section>
								</FlexItem>
								<FlexItem growFactor={0} style={{flexBasis: 350, flex: 0}}>
									<Section>
										<Flex style={{marginTop: METRICS.space*2.5}}>
											<FlexItem shrink>
												<Chunk>
													<Button
														color="secondary"
														style={{borderBottomRightRadius: 0, borderBottomLeftRadius: 0, marginBottom: 1}}
														shape="ArrowUp"
														onPress={upvoteTldr}
														/>
													<Button
														style={{borderTopRightRadius: 0, borderTopLeftRadius: 0, marginTop: 1}}
														color="secondary"
														shape="ArrowDown"
														onPress={downvoteTldr}
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
											{canEdit && 
												<Button 
													shape="Edit"
													label="Edit card"
													width="full"
													color="secondary"
													href={ getVersionEditPageUrl({tldrId: tldr.data.id}) }
													/>
											}
											<Flex>
												<FlexItem>
													<Button 
														shape="Share2" 
														color="secondary" 
														width="full"
														onPress={()=>{
															shareTldr({
																title: tldr.data.currentTldrVersion.content.title,
																text: tldr.data.currentTldrVersion.content.blurb,
																url: `tldr.cards/${tldr.data.urlKey}`,
															});
														}}
														/>
														<Text type="micro" color="hint" style={{alignSelf: 'center'}}>Share</Text>
												</FlexItem>
												<FlexItem>
													<Button 
														shape="Bookmark" 
														color="secondary" 
														width="full"
														onPress={saveTldr}
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
											<Link href={ getProfilePageUrl({userId: tldr.data.author.id}) }>
												<Flex>
													<FlexItem>
														<Text weight="strong">Maintainer</Text>
														<Text type="small" color="secondary">@{tldr.data.author.urlKey} • {tldr.data.author.name}</Text>
													</FlexItem>
													<FlexItem shrink justify="center" style={{paddingHorizontal: 3}}>
														<Avatar 
															size="small"
															source={{uri: tldr.data.author.photoUrl}} />
													</FlexItem>
												</Flex>
											</Link>
										</Chunk>

										{canEdit &&
											<Chunk border>
												<Inline>
													<Link href={ getTldrEditPageUrl({tldrId: tldr.data.id}) }>
														<Text type="small" color="hint">Settings</Text>
													</Link>
													<Text type="small"> </Text>
													<Touch onPress={() => { 
														const prompt = <DeletePrompt 
															dipatch={dispatch}
															tldr={tldr.data} 
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
										}
									</Section>

								</FlexItem>
							</Flex>

					</Bounds>
					</Stripe>
				}

				{ relatedTldrs.data && 
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
									
									items={relatedTldrs.data}
									
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
				}
			</Page>
		);


}

Tldr.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const {store, req, pathname, query} = context;
	const tldrId = query.tldrId;
	const isServer = !!req;	

	// fetch and pass as props during SSR, using in the useSWR as intitialData
	try{
		const tldr = (isServer) ? await request(getTldrUrl(tldrId)) : undefined;
		return {
			tldrId: tldrId,
			isServer,
			tldr
		}
	}
	catch(error){
		return { 
			tldrId: tldrId,
			isServer,
			error: error 
		}
	}
	
}

const listItemStyle = {
	borderTopColor: swatches.border,
	borderTopWidth: 1,
	paddingTop: METRICS.space
}




export default Tldr;