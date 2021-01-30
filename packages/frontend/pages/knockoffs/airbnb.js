import React, {Fragment, useState} from 'react';

import {
	fetcher,
	getTldrUrl,
	useTldr
} from '@/swr/index';

import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast } from '@/actions/index';


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
	useMediaContext,
	View,	
} from '@/components/cinderblock';

import styles from '@/components/cinderblock/styles/styles';
import swatches from '@/components/cinderblock/styles/swatches';
import {METRICS} from '@/components/cinderblock/designConstants';
import Page from '@/components/Page';
import Head from 'next/head'


const nearbyCitiesData = [
	{name: "Woodstock"},
	{name: "Lake Placid"},
	{name: "Philadelphia"},
	{name: "Montauk"},
	{name: "Stowe"},
	{name: "Ithaca"}
];

const houseTypesData = [
	{name: "Entire homes", photo: "https://a0.muscache.com/im/pictures/a0316ecb-e49b-4b3a-b6b6-c2876b820e8c.jpg?im_w=480"},
	{name: "Cabins and cottages", photo: "https://a0.muscache.com/im/pictures/ff69ac49-64e7-4f4a-ae2b-ee01163d0790.jpg?im_w=480"},
	{name: "Unique stays", photo: "https://a0.muscache.com/im/pictures/ce6814ba-ed53-4d6e-b8f8-c0bbcf821011.jpg?im_w=480"},
	{name: "Pets welcome", photo: "https://a0.muscache.com/im/pictures/fbe849a4-841a-41b3-b770-419402a6316f.jpg?im_w=480"},
]


const Postmates = (props) => {

	return(
		<View style={{minHeight: '100vh'}}>
			<Stripe 
				style={{backgroundColor: '#FFD324'}}
				imageHeight={{
					small: 488,
					medium: 588,
					large: 564
				}}
				image="https://a0.muscache.com/im/pictures/f0483d09-7d13-42d0-a40a-46d585c42220.jpg?im_w=1440"
				>
				<Bounds style={{flex: 1}}>
					<Section>
						<Card>
							<Sectionless>
								<Chunk>
									<Text>this is the form</Text>
								</Chunk>
							</Sectionless>
						</Card>
					</Section>
					<Section style={{flex: 1, justifyContent: 'center'}}>
						<View>
							<Chunk>
								<Text type="hero" inverted>Go near</Text>
							</Chunk>
							<Chunk>
								<Button 
									label="Explore nearby stays"
									inverted
									/>
							</Chunk>
						</View>
					</Section>
				</Bounds>
			</Stripe>
			<Stripe>
				<Bounds>
					<Section>
						<List
							variant={{
								small: "grid",
							}}
							itemsInRow={{
								small: 1,
								medium: 2,
								large: 3,
							}}
							items={nearbyCitiesData}
							renderItem={(item, i)=>{
								return (
									<Chunk>
										<Flex>
											<FlexItem shrink>
												<Image 
													source={{uri: "https://a0.muscache.com/im/pictures/676c0a60-2a5a-4598-aeeb-10a81aa5232f.jpg?im_q=medq&im_w=240"}}
													style={{
														width: 72,
														height: 72,
														borderRadius: METRICS.borderRadius
													}}
													/>
											</FlexItem>
											<FlexItem>
												<Text weight="strong">{item.name}</Text>
												<Text>5.5 hour drive</Text>
											</FlexItem>
										</Flex>
									</Chunk>
								)
							}}
							/>
					</Section>
				</Bounds>
			</Stripe>
			<Stripe>
				<Bounds>
					<Section>
						<Chunk>
							<Text type="sectionHead">
								Live anywhere
							</Text>
						</Chunk>
						<List
							variant={{
								medium: "hscroll",
								large: "grid"
							}}
							itemsInRow={{
								large: 4,
							}}
							items={houseTypesData}
							renderItem={(item, i)=>{
								return (
									<Chunk>
										<Image 
											source={{uri: item.photo}}
											style={[{
												height: 240,
												borderRadius: METRICS.borderRadius
											}, styles.pseudoLineHeight]}
											/>
										<Text weight="strong">{item.name}</Text>
									</Chunk>
								)
							}}
							/>
					</Section>
				</Bounds>
			</Stripe>
		</View>
	)
}


export default Postmates;