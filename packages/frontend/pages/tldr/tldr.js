import React, {Fragment, useState} from 'react';

import {
	fetcher,
	getTldrUrl,
	useTldr
} from '../../swr';

import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast } from '../../actions';


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
} from '../../components/cinderblock';

import styles from '../../components/cinderblock/styles/styles';
import swatches from '../../components/cinderblock/styles/swatches';
import { sleep } from '@/components/cinderblock/utils';
import { METRICS } from '../../components/cinderblock/designConstants';
import Page from '../../components/Page';



import Markdown from 'markdown-to-jsx';
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



const TldrCard = (props) => {

	const media = useMediaContext();

	const [showReferences, setReferences] = useState(false);

	const {
		tldrData,
		style
	} = props;

	const content = tldrData.currentTldrVersion.content;

	return (
		<Card shadow style={[{ borderRadius: 12 }, style ]}>
			<Sectionless style={[
					(media.medium) ? {paddingHorizontal: 30, paddingTop: 30, paddingBottom: 10} : {},
					{backgroundColor: "#4353ff"}
				]}>
					<Chunk style={{paddingBottom: 4}}>
						<Flex>
							<FlexItem>
								<Inline>
									<Avatar style={{height: 12, width: 12, opacity: .75}} source={{uri: 'https://randomuser.me/api/portraits/women/18.jpg'}} />
									<Text type="small" inverted color="secondary">
										{/* TODO: replace with actual data, this is fakedwha */}
										@{tldrData.author.name.split(" ")[0].toLowerCase()} / {content.title.replace(/[^A-Za-z0-9-\s]+/gi, "").replace(/\s+/gi,"-").toLowerCase()}
									</Text>
								</Inline>
							</FlexItem>
							<FlexItem style={{alignItems: 'flex-end'}}>
								<Inline>
								<Text type="small" inverted color="secondary">
									v{tldrData.currentTldrVersion.version}
								</Text>
								<Icon
									shape="ChevronDown"
									size="small"
									color={swatches.textSecondaryInverted}
									/>
								</Inline>
							</FlexItem>
						</Flex>
					</Chunk>
					<Chunk>
						<Text type="pageHead" inverted>{content.title}</Text>
						<Text inverted style={{fontStyle: 'italic', marginTop: 8}}>{content.blurb}</Text>
					</Chunk>
			</Sectionless>
			<Sectionless style={[
					(media.medium) ? {paddingHorizontal: 30, paddingTop: 30, paddingBottom: 10} : {}
				]}>
					<View>
					{content.steps.map((step, i)=>(
						<View 
							key={i} 
							style={{
								marginTop: 0,
								marginBottom: METRICS.space + 5,
								paddingLeft: 16,
							}}>
							<View 
								style={{
									position: 'absolute',
									top: 3,
									bottom: 3,
									left: 0,
									width: 4,
									backgroundColor: swatches.border,
								}}
								/>
							<View>
								<Text type="big"><Markdown>{step.head}</Markdown></Text>
								<Text color="secondary"><Markdown>{step.body}</Markdown></Text>
							</View>
							{ showReferences &&
								<View 
									style={{
										marginTop: METRICS.space /2,
										padding: METRICS.space / 2,
										background: swatches.shade,
										borderRadius: METRICS.borderRadius
									}}>
										<Text type="small" color="secondary"><Markdown>{step.note}</Markdown></Text>
								</View>
							}
						</View>
						))}
					</View>
					
				
					<Chunk>

							<Touch onPress={()=>{
								setReferences(!showReferences)
							}}>

							{ !showReferences &&
								<Text color="hint">
									<Icon 
										shape="ChevronDown"
										color={swatches.hint}
										style={{marginBottom: -6, marginLeft: 0, paddingLeft: 0, marginRight: 4}}
										/>
									Show references & rationale
								</Text>
							}	

							{ showReferences &&
								<Text color="hint">
									<Icon 
										shape="ChevronUp"
										color={swatches.hint}
										style={{marginBottom: -6, marginRight: 4}}
										/>
									Hide references & rationale
								</Text>
							}							
						</Touch>
					</Chunk>
				</Sectionless>
					
			</Card>
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


function Tldr(props) {

		const dispatch = useDispatch(); 

		const {data: tldrData, error: tldrError, mutate: tldrMutate} = useTldr(props.tldrId, {initialData: props.tldr});


		const authentication = useSelector(state => state.authentication);
		const user = authentication.user || {};

		if( !tldrData )
			return <View />

		return (
			<Page>

				<Stripe style={{/*paddingTop: 0,*/ backgroundColor: swatches.notwhite}}>

					<Bounds>

							<Flex direction="column" switchDirection="large">

								<FlexItem growFactor={1}>
									<Section style={{paddingTop: 0, paddingBottom: 0}}>
										<Chunk>
											<TldrCard tldrData={tldrData} />
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
										<Chunk style={{marginTop: METRICS.space*2}}>
											<Button
												color="secondary"
												style={{borderBottomRightRadius: 0, borderBottomLeftRadius: 0, marginBottom: 1}}
												shape="ArrowUp"
												/>
											<Button
												style={{borderTopRightRadius: 0, borderTopLeftRadius: 0, marginTop: 1}}
												color="secondary"
												shape="ArrowDown"
												onPress={()=>{
													setTimeout(() =>{
														dispatch(addPrompt(<DownVotePrompt/>))
													}, 325);
												}}
												/>
										</Chunk>

										<Chunk border>
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
														<Text weight="strong">Improve this card</Text>
														<Text type="small" color="secondary">34 open issues</Text>
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
												<Flex>
													<FlexItem>
														<Text weight="strong">Improve this card</Text>
														<Text type="small" color="secondary">34 open issues</Text>
													</FlexItem>
													<FlexItem shrink justify="center" style={{paddingHorizontal: 3}}>
														<Icon
															color={swatches.textSecondary}
															shape="MessageCircle"
															/>
													</FlexItem>
												</Flex>
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
										tldrData.currentTldrVersion.content,
										tldrData.currentTldrVersion.content,
										tldrData.currentTldrVersion.content,
										tldrData.currentTldrVersion.content,
									]}
									
									renderItem={(item, i)=>{
										return(
											<Chunk key={i}>
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
															<Text type="small" color="hint">{item.userid}/{item.id}</Text>
															<Text type="big">{item.title}</Text>
															<Text color="secondary">{item.blurb}</Text>
														</Chunk>
													</Sectionless>
												</Card>
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
	const tldrId = query.tldrId || 2;
	const isServer = !!req;	

	// fetch and pass as props during SSR, using in the useSWR as intitialData
	const tldr = (isServer) ? await fetcher(getTldrUrl(tldrId)) : undefined;

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