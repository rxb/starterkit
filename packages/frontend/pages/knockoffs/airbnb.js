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

const experienceTypesData = [
	{name: "Make handmade pasta with Italian grandmas", photo: "https://a0.muscache.com/im/pictures/22f7dfe7-344e-4b55-88a0-3da9e0d45c97.jpg?im_q=medq&im_w=720"},
	{name: "Practice mindful eating through zen philosophy", photo: "https://a0.muscache.com/im/pictures/c4f98b13-4d9e-4376-b014-6b3e827c31d0.jpg?im_q=medq&im_w=480"},
	{name: "Get to know Argentina's famous Yerba Mate", photo: "https://a0.muscache.com/im/pictures/572d1f80-e3dc-4e48-b54b-5c802090e881.jpg?im_q=medq&im_w=480"},
	{name: "Meditate to music with a Parisian concert pianist", photo: "https://a0.muscache.com/im/pictures/15c33e47-2301-43bf-8a3c-8c8aa1643aa9.jpg?im_q=medq&im_w=720"},		
]

const hostData = [
	{name: "Host your home", photo: "https://a0.muscache.com/im/pictures/2a16f833-464c-446c-8d74-33eb8c643975.jpg?im_w=480"},
	{name: "Host and Online Experience", photo: "https://a0.muscache.com/im/pictures/426a8116-0b94-4407-ae87-924126c81d78.jpg?im_w=480"},
	{name: "Host an Experience", photo: "https://a0.muscache.com/im/pictures/a84e92bd-68e6-4ce2-9fdf-b2ce1a377f53.jpg?im_w=480"},
];

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
								<Flex>
									<FlexItem>
										<Chunk>
											<Text type="small" weight="strong">Location</Text>
											<Text color="secondary">Where are you going?</Text>
										</Chunk>
									</FlexItem>
									<FlexItem>
										<Chunk>
											<Text type="small" weight="strong">Check in</Text>
											<Text color="secondary">Add dates</Text>
										</Chunk>
									</FlexItem>
									<FlexItem>
										<Chunk>
											<Text type="small" weight="strong">Check out</Text>
											<Text color="secondary">Add dates</Text>
										</Chunk>
									</FlexItem>
									<FlexItem>
										<Chunk>
											<Text type="small" weight="strong">Guests</Text>
											<Text color="secondary">Add guests</Text>
										</Chunk>
									</FlexItem>
									<FlexItem shrink>
										<Chunk>
										<Button 
											shape="Search"
											/>
										</Chunk>
									</FlexItem>
								</Flex>
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
			<Stripe style={{backgroundColor: swatches.backgroundDark}}>
				<Bounds>
					<Section>
						<Flex>
							<FlexItem>
								<Chunk>
									<Text type="sectionHead" inverted>Online experiences</Text>
									<Text inverted>Interactive activites you can do together, led by expert hosts.</Text>
								</Chunk>
							</FlexItem>
							<Flex>
								<Chunk>
									<Button	
										label="Explore all"
										color="secondary"
										inverted
										/>
								</Chunk>
							</Flex>
						</Flex>
						<List
							variant={{
								medium: "hscroll",
								large: "grid"
							}}
							itemsInRow={{
								large: 4,
							}}
							items={experienceTypesData}
							renderItem={(item, i)=>{
								return (
									<Chunk>
									<Card style={{
										backgroundColor: 'rgba(255,255,255,.05)'
									}}>
										<Image 
											source={{uri: item.photo}}
											resizeMode="cover"
											style={[{
												height: 200,
											}, styles.pseudoLineHeight, {marginTop: 0, }]}
											imageStyle={{
												backgroundPosition: 'top center'
											}}
											/>
										<Sectionless style={{paddingTop: 8}}>
											<Chunk>
												<Text weight="strong" inverted>{item.name}</Text>
											</Chunk>
										</Sectionless>
									</Card>
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
							<Text type="sectionHead">Join millions of hosts on Airbnb</Text>
						</Chunk>
						<List
							variant={{
								medium: "hscroll",
								large: "grid"
							}}
							itemsInRow={{
								large: 3,
							}}
							items={hostData}
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
			
			<Stripe style={{backgroundColor: swatches.shade}}>
				<Bounds>
					<Section>
							<Chunk>
								<Text type="small" weight="strong">ABOUT</Text>
							</Chunk>
							<Flex>
								<FlexItem>
									<Chunk>
										<Text>How Airbnb works</Text>
									</Chunk>
									<Chunk>
										<Text>Airbnb Plus</Text>
									</Chunk>
									<Chunk>
										<Text>Airbnb for work</Text>
									</Chunk>																		
								</FlexItem>
								<FlexItem>
									<Chunk>
										<Text>Newsroom</Text>
									</Chunk>
									<Chunk>
										<Text>Airbnb Luxe</Text>
									</Chunk>
									<Chunk>
										<Text>Olympics</Text>
									</Chunk>																		
								</FlexItem>
								<FlexItem>
									<Chunk>
										<Text>Investors</Text>
									</Chunk>
									<Chunk>
										<Text>HotelTonight</Text>
									</Chunk>
									<Chunk>
										<Text>Careers</Text>
									</Chunk>																		
								</FlexItem>																
							</Flex>
					</Section>
				</Bounds>
			</Stripe>
		</View>
	)
}


export default Postmates;