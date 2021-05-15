import React, { Fragment, useState, useContext } from 'react';

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
	useMediaContext,
	ThemeContext
} from 'cinderblock';





const OutpostHeader = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	const {
		type,
		inverted
	} = props;

	const media = useMediaContext();

	return (
		<Header position="static" type={type}>
			<Flex direction="row">
				<FlexItem>
					<Link href="/outpost/">
						<Inline>
							<View style={{ transform: [{ rotateY: '180deg' }] }} >
								<Icon color={inverted ? "white" : SWATCHES.tint} shape="Flag" />
							</View>
							<Text color={inverted ? 'primary' : 'tint'} inverted={inverted} style={{ fontWeight: 700, fontVarian: 'smallcaps' }}>OUTPOST</Text>
						</Inline>
					</Link>
				</FlexItem>
				<FlexItem shrink justify="center">
					<Touch onPress={() => {
						alert('TODO: like, a menu or something');
					}}>
						<Icon shape="Menu" color={inverted ? "white" : SWATCHES.tint} />
					</Touch>
				</FlexItem>
			</Flex>
		</Header>
	);
};

export default OutpostHeader