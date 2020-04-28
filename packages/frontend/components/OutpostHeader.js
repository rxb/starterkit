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
	Sections,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch,
	View,
	withFormState,
	
} from '../components/cinderblock';
import styles from '../components/cinderblock/styles/styles';
import swatches from '../components/cinderblock/styles/swatches';
import {METRICS} from '../components/cinderblock/designConstants';
import {WithMatchMedia} from '../components/cinderblock/components/WithMatchMedia';


export default WithMatchMedia((props) => {

	const {
      media,
      type,
      inverted
   } = props;
   
	return(
		<Header position="static" type={type}>
			<Flex direction="row">
				<FlexItem>
						<Link href="/splash">
							<Inline>
							<View style={{marginTop: 4, transform: [{ rotateY: '180deg' }]}} >
								<Icon color={inverted ? "white" : swatches.tint} shape="Flag"/>
							</View>
							<Text type={ media.medium ? 'sectionHead' : 'big'} color={inverted ? 'primary' : 'tint'} inverted={inverted} style={{fontWeight: 700}}>outpost</Text>
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
});