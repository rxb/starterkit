import React, {useState, useRef} from 'react';

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
	useMediaContext,
	View,	
} from '@/components/cinderblock';
import styles from '@/components/cinderblock/styles/styles';
import swatches from '@/components/cinderblock/styles/swatches';
import { METRICS } from '@/components/cinderblock/designConstants';

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
		tldr,
		style
	} = props;
	const thisVersion = props.thisVersion || tldr.currentTldrVersion;
	const content = thisVersion?.content || {};
	const draft = tldr.id && tldr.currentTldrVersionId == undefined;
	return(
			<Card style={[{
					minHeight: 160,
					overflow: 'visible' 
				}, style]}>
				{/* overflow and top-stripe done this way to allow menu within cards */}
				<View style={{
						height: 5,
						backgroundColor: swatches.tint,
						borderTopRightRadius: METRICS.cardBorderRadius,
						borderTopLeftRadius: METRICS.cardBorderRadius,
					}}
					/>
				<Sectionless
					style={{
						paddingTop: METRICS.space,
						flex: 1
					}}
					>
					<Chunk style={{flex: 1}}>
						<View style={{flex: 1}}>
							<Text type="micro" color="hint">{tldr.author?.urlKey}/{tldr.urlKey}</Text>
							<Text type="big">{content.title ? content.title : 'Untitled'}</Text>
							<Text color="secondary" type="small" style={{fontStyle: 'italic'}}>{content.blurb}</Text>
						</View>

						{ draft &&
							<View style={{flex: 0}}>
								<View style={[{ backgroundColor: swatches.error, paddingHorizontal: 6, borderRadius: 4, alignSelf: 'flex-start' }]}>
									<Text type="small" inverted>Unpublished</Text>
								</View>
							</View>
						}

						{ true &&  
							<View style={{alignSelf: 'flex-end'}}>
								<TldrCardContextMenu tldr={tldr} />
							</View>
						}
					</Chunk>
					
				</Sectionless>
			</Card>
	);

}

export const CreateTldrCardSmall = (props) => {
	return(
		<Card style={{minHeight: 160, borderStyle: 'dashed', backgroundColor: 'transparent'}}>
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

export const CategoryCardSmall = (props) => {
	const {category} = props;
	return (
		<Card 
		style={{
			marginVertical: 0, 
			zIndex: 10,
			minHeight: 165,
			
		}}
		>
		<Sectionless style={{flex: 1}}>
			<Chunk style={{flex: 0}}>
				<Text type="big">{category.name}</Text>
				<Text type="small" color="hint">voting, civic engagement, mutual aid</Text>
			</Chunk>
			<View style={{flex: 1}} />
			<Chunk style={{flex: 0}}>
				<Text type="small" style={{textAlign: 'left'}}>1,263 cards</Text>
			</Chunk>
		</Sectionless>
		</Card>
	);
}


export const TldrCardContextMenu = (props) => {
	const thisMenu = useRef(null);
	
	return(
		<>
			<Touch onPress={(e) => {
					e.preventDefault();
					thisMenu.current.toggle() 
				}}>
				<Icon 
					shape="MoreHorizontal" 
					color={swatches.textHint} 
					/>
			</Touch>

			<Menu ref={thisMenu}>
				<Sectionless>
					<Chunk>
						<Link href={`/tldr/versionedit?tldrId=${props.tldr.id}`} >
							<Text color="tint">Edit</Text>
						</Link>
						<Link href={`/tldr/edit?tldrId=${props.tldr.id}`} >
							<Text color="tint">Settings</Text>
						</Link>
						<Touch  >
							<Text color="tint">Delete</Text>
						</Touch>
					</Chunk>
				</Sectionless>
			</Menu>

		</>
	);
}

export const DeletePrompt = (props) => {
	const {
		tldr,
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