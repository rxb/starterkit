import React, {useState} from 'react';

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
										{/* TODO: replace with actual data, this is fakedwha */}
										@{tldr.author.urlKey} / {content.title.replace(/[^A-Za-z0-9-\s]+/gi, "").replace(/\s+/gi,"-").toLowerCase()}
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


export const TldrCardSmall = (props) => {

	const {
		tldr,
		style
	} = props;
	const thisVersion = props.thisVersion || tldr.currentTldrVersion;
	const content = thisVersion?.content || {};

	return(
			<Card style={style}>
				<Sectionless
					style={{
						borderTopWidth: 5,
						borderTopColor: swatches.tint,
						paddingTop: METRICS.space
					}}
					>
					<Chunk>
						<Text type="small" color="hint">@{tldr.author?.urlKey}/{tldr.id}</Text>
						<Text type="big">{content.title}</Text>
						<Text color="secondary" type="small" style={{fontStyle: 'italic'}}>{content.blurb}</Text>
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
						<Text type="micro" color="hint">Create card</Text>
				</View>
			</Sectionless>
		</Card>
	)
}

export const CATEGORIES = [
	{
		name: 'Better Cities',
		urlKey: 'better-cities'
	},
	{
		name: 'Decision Tools',
		urlKey: 'decision-tools'
	},
	{
		name: 'Goals & Careers',
		urlKey: 'goals-careers'
	},
	{
		name: 'Kids & Parenting',
		urlKey: 'kids-parenting'
	},
	{
		name: 'Finance',
		urlKey: 'finance'
	},
	{
		name: 'Business & Legal',
		urlKey: 'business-legal'
	},
	{
		name: 'Tech & Startup',
		urlKey: 'tech-startup'
	},
	{
		name: 'Fitness & Welless',
		urlKey: 'fitness-wellness'
	},
	{
		name: 'Biohacking',
		urlKey: 'bio-hacking'
	},
	{
		name: 'Emergency Prep',
		urlKey: 'emergency-prep'
	},
	{
		name: 'Self-care (body)',
		urlKey: 'body-care'
	},
	{
		name: 'Self-care (mental)',
		urlKey: 'mental-care'
	},
	{
		name: 'Social',
		urlKey: 'social'
	},
	{
		name: 'Travel & Culture',
		urlKey: 'travel-culture'
	},
	{
		name: 'Homemaking',
		urlKey: 'homemaking'
	},
	{
		name: 'Cooking & Food',
		urlKey: 'cooking-food'
	},
	{
		name: 'Hobby',
		urlKey: 'hobby'
	},
	{
		name: 'Industry-specific',
		urlKey: 'industry-specific'
	},
];