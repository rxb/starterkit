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
import CinderblockPage from '@/components/Page';

export const Page = (props) => {
   return <CinderblockPage hideHeader />
}

export const TldrCardSmall = (props) => {

	const {
		tldr,
      style
	} = props;
	const content = tldr.currentTldrVersion?.content || {};

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
						<Text type="small" color="hint">someuser/{tldr.id}</Text>
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