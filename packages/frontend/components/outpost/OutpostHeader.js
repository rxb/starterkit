import React, {Fragment, useState} from 'react';

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
	View,
	useMediaContext	
} from '../../modules/cinderblock';
import styles from '../../modules/cinderblock/styles/styles';
import swatches from '../../modules/cinderblock/styles/swatches';
import {METRICS} from '../../modules/cinderblock/designConstants';


const OutpostHeader = (props) => {

	const {
      type,
      inverted
   } = props;
	
	const media = useMediaContext();
	
	return(
		<Header position="static" type={type}>
			<Flex direction="row">
				<FlexItem>
						<Link href="/outpost/">
							<Inline>
							<View style={{transform: [{ rotateY: '180deg' }]}} >
								<Icon color={inverted ? "white" : swatches.tint} shape="Flag"/>
							</View>
							<Text  color={inverted ? 'primary' : 'tint'} inverted={inverted} style={{fontWeight: 700, fontVarian: 'smallcaps'} }>OUTPOST</Text>
							</Inline>
						</Link>
				</FlexItem>
				<FlexItem shrink justify="center">
						<Touch onPress={()=>{
							alert('TODO: like, a menu or something');
						}}>
							<Icon shape="Menu" color={inverted ? "white" : swatches.tint} />
						</Touch>
				</FlexItem>
			</Flex>
		</Header>
	);
};

export default OutpostHeader