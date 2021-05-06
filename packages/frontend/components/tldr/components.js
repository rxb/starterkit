import React, {useState, useRef} from 'react';

// REDUX
import {connect, useDispatch, useSelector} from 'react-redux';
import { addDropdown, addPrompt, addToast, addDelayedToast } from '@/actions';

// SWR
import { request, getTldrUrl } from '@/swr';

// URLS
import {getTldrEditPageUrl, getVersionEditPageUrl, saveLoginRedirect} from './urls';

import {
	Avatar,
	Bounds,
	Button,
	Card,
	CheckBox,
	Chunk,
	Chip,
	Flex,
	FlexItem,
	Header,
	Icon,
	Inline,
	Image,
	Label,
	List,
	Link,
	Menu,
	Modal,
	Picker,
	Section,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch,
	useFormState,
	useMediaContext,
	View,	
} from 'modules/cinderblock';
import ConnectedDropdownTouch from '@/components/ConnectedDropdownTouch';
import styles from 'modules/cinderblock/styles/styles';
import swatches from 'modules/cinderblock/styles/swatches';
import { METRICS } from 'modules/cinderblock/designConstants';
const smallCardMinHeight = 220;

import Router, {useRouter} from 'next/router'
import Markdown from 'markdown-to-jsx';



export const TldrCard = (props) => {

	const media = useMediaContext();

	const [showReferences, setReferences] = useState(false);

	const {
		tldr,
		style
	} = props;
	const thisVersion = props.thisVersion || tldr.currentTldrVersion;
	const content = thisVersion.content;

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
										@{tldr.author.urlKey} / {tldr.urlKey}
									</Text>
								</Inline>
							</FlexItem>
							<FlexItem style={{alignItems: 'flex-end'}}>
								<Inline>
								<Text type="small" inverted color="secondary">
									v.{thisVersion.version}
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
							{/*

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
							*/}

						</Touch>
					</Chunk>
				</Sectionless>
					
			</Card>
	);
};


export const TldrCardSmall = (props) => {

	const {
		user,
		tldr,
		dispatch,
		mutate,
		color = swatches.tint,
		style
	} = props;
	const thisVersion = props.thisVersion || tldr.currentTldrVersion;
	const content = thisVersion?.content || {};
	const draft = tldr.id && tldr.currentTldrVersionId == undefined;

	// TODO: admin permission
	const canEdit = (user?.id == tldr.authorId);

	return(
			<Card style={[{
					minHeight: smallCardMinHeight,
				}, style]}>
				
				<Sectionless
					style={{
						paddingTop: METRICS.space,
						flex: 1,
						borderTopWidth: 10,
						borderTopColor: color
					}}
					>
					<Chunk style={{flex: 1}}>
						<View style={{flex: 1}}>
							<Text type="micro" color="hint">{tldr.author?.urlKey}/{tldr.urlKey}</Text>
							<Text type="big">{content.title ? content.title : 'Untitled'}</Text>
							<Text color="secondary" style={{marginTop: 3}} type="small" color="secondary" numberOfLines={3}>{content.blurb}</Text>
						</View>

						<Flex>
							<FlexItem>
								{ draft &&
									<View style={[{ backgroundColor: swatches.error, paddingHorizontal: 6, borderRadius: 4, alignSelf: 'flex-start' }]}>
										<Text type="small" inverted>Unpublished</Text>
									</View>
								}
								</FlexItem>

								{/* TODO make this conditional on permission */}

								{ canEdit && 
									<FlexItem shrink>
										<ConnectedDropdownTouch 
											dropdown={<TldrCardContextDropdown 
																tldr={tldr} 
																dispatch={dispatch} 
																mutate={mutate}
																/>}
											>
											<Icon 
												shape="MoreHorizontal" 
												color={swatches.textHint} 
												/>
										</ConnectedDropdownTouch>
									</FlexItem>
								}
							</Flex>
						
					</Chunk>
					
				</Sectionless>
			</Card>
	);

}

export const CreateTldrCardSmall = (props) => {
	return(
		<Card style={{minHeight: smallCardMinHeight, borderStyle: 'dashed', backgroundColor: 'transparent'}}>
			<Sectionless style={{flex: 1}}>
				<View style={styles.absoluteCenter}>
						<Icon 
							shape="Plus"
							size="large"
							color={swatches.tint}
							style={{alignSelf: 'center'}}
							/>
						<Text type="micro" color="tint">Create card</Text>
				</View>
			</Sectionless>
		</Card>
	)
}


const TldrCardContextDropdown = (props) => {
	const {
		tldr,
		dispatch,
		mutate,
		onRequestClose,
		onCompleteClose
	} = props;
	return(
		<Sectionless>
			<Chunk>
				{/* can't nest urls, so all links need to push router */}
				<Touch 
					onPress={(e)=>{
						e.preventDefault()
						Router.push({pathname: getVersionEditPageUrl(), query: {tldrId: tldr.id}})
					}}
					>
					<Text color="tint">Edit</Text>
				</Touch>
				<Touch 
					onPress={(e)=>{
						e.preventDefault()
						Router.push({pathname: getTldrEditPageUrl(), query: {tldrId: tldr.id}})
					}}
					>
					<Text color="tint">Settings</Text>
				</Touch>
				<Touch onPress={(e) => { 
						e.preventDefault();
						onCompleteClose();
						dispatch(addPrompt(<DeletePrompt tldr={tldr} onSuccess={()=>{
							mutate();
							dispatch(addToast('Card deleted!'))
						}} />))
					}}>
					<Text color="tint">Delete</Text>
				</Touch>
			</Chunk>
		</Sectionless>
	)
}



export const DeletePrompt = (props) => {

	const {
		tldr, 
		onRequestClose = () => {},
		onSuccess = () => {},
		dispatch
	} = props;

	const formState = useFormState( {
		toastableErrors: {
			BadRequest: 'Something went wrong',
			NotAuthenticated: 'Not signed in'
		},
		addToast: msg => dispatch(addToast(msg))
	});

	// TODO: from the detail page, it will need to redirect, but from a listing page, probably not. maybe just pass in an onDelete fn?
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};
	const deleteTldr = async () => {
		try{
			formState.setLoading(true);
			await request(getTldrUrl(tldr.id), {
				method: 'DELETE', 
				token: authentication.accessToken
			});
			onSuccess();
			onRequestClose();
		}
		catch(error){
			console.log(error);
			formState.setError(error);
			formState.setLoading(false);
		}
	}

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
					onPress={deleteTldr}
					label="Delete card"
					width="full"
					isLoading={formState.loading}
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

export const LoadMoreButton = (props) => {
	const {
		swr,
		label = "Load more"
	} = props;
	return(
		<>
			{ !swr.isReachingEnd && 
				<Chunk>
					<Button
						isLoading={swr.isLoadingMore}
						color="secondary"
						onPress={()=>{
							swr.setSize(swr.size+1)
						}}
						label={label}
						/>
				</Chunk>
			}
		</>
	);
}