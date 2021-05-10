import React, {Fragment, useState} from 'react';

import {
	fetcher,
	getTldrUrl,
	useTldr
} from 'swr/index';

import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast } from 'actions/index';


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
} from 'cinderblock';

import {styles} from 'cinderblock';
import {swatches} from 'cinderblock';
import {DesignConstants} from 'cinderblock';
const {METRICS} = DesignConstants;
import Page from '@/components/Page';
import Head from 'next/head'


const sampleRestaurants = [
	{
		photo: "https://raster-static.postmates.com/?url=https%3A%2F%2Fd1725r39asqzt3.cloudfront.net%2F744cb202-bdb5-409f-bd4b-4310ec3c2723%2Forig.jpg&quality=85&w=640&h=0&mode=auto&format=webp&v=4",
		name: "Dunkin' Donuts",
		desc: "25-35 min • Donut"
	},
	{
		photo: "https://raster-static.postmates.com/?url=https%3A%2F%2Fd1725r39asqzt3.cloudfront.net%2F549cba44-b427-4ddc-8bb3-f609d598a8a0%2Forig.jpg&quality=85&w=640&h=0&mode=auto&format=webp&v=4",
		name: "McDonald's",
		desc: "15-25 min • Fast Food"
	},
	{
		photo: "https://raster-static.postmates.com/?url=https%3A%2F%2Fd1725r39asqzt3.cloudfront.net%2Fffd73956-e42c-4a8b-9849-613b3f05ebf0%2Forig.jpg&quality=85&w=640&h=0&mode=auto&format=webp&v=4",
		name: "Popeye's Louisiana Kitchen",
		desc: "30-40 min • Fast Food"
	},
	{
		photo: "https://raster-static.postmates.com/?url=https%3A%2F%2Fd1725r39asqzt3.cloudfront.net%2F7c075c47-d458-4d0c-ab45-11d3b2ac4e43%2Forig.png&quality=85&w=640&h=0&mode=auto&format=webp&v=4",
		name: "Taqueria El Patron Mexican Grill",
		desc: "30-40 min • Mexican"
	},	
];

const nearbyData = [...sampleRestaurants, ...sampleRestaurants, ...sampleRestaurants, ...sampleRestaurants];

const dealsData = nearbyData.slice(1,4);

const Postmates = (props) => {

	return(
		<View style={{minHeight: '100vh'}}>
			<Stripe 
				style={{
					backgroundColor: '#FED928',
					paddingVertical: 0
				}}
				>
				<Bounds>
					<Sectionless>
						<Flex>
							<FlexItem shrink>
								<Chunk>
									<Text type="big">Postmates</Text>
								</Chunk>
							</FlexItem>
							<FlexItem>
								<Chunk>
									<Inline>
									<Icon 
										shape="Search"
										size="small"
										/>
									<Text color="secondary">Search for anything...</Text>
									</Inline>
								</Chunk>
							</FlexItem>
							<FlexItem align="flex-end">
								<Chunk>
									<Inline style={{alignSelf: 'flex-end'}}>
										<Button 
											size="small"
											label="Log in"
											color="secondary"
											/>
										<Button 
											size="small"
											label="Sign up"
											/>	
									</Inline>										
								</Chunk>
							</FlexItem>
						</Flex>
					</Sectionless>
				</Bounds>
			</Stripe>
			<Stripe 
				style={{backgroundColor: '#FED928'}}
				imageHeight={{small: 292}}
				image="https://raster-static.postmates.com/?url=https%3A%2F%2Fbuyer-static-gcp.postmates.com%2Fdist%2Fprod%2Fcollection-feed-header-refresh.ff66a93edfd10817d088e6b48bbb80cbedc459960022385bbdf8141e74de7c68c092f2444e22133303ff25dc3e90131d9a4474fd8a4fd1874ca7af56840d0170.jpg&quality=85&w=3200&h=0&mode=auto&format=webp&v=4"
				>
				<Bounds>
					<Section>
						<Chunk>
							<Text type="hero">You crave.</Text>
							<Text type="hero">We get it.</Text>
						</Chunk>
					</Section>
				</Bounds>
			</Stripe>
			<Stripe 
				style={{
					paddingVertical: 0,
					borderBottomWidth: 1,
					borderBottomColor: swatches.border
				}}
				>
				<Bounds>
					<Sectionless>
						<Flex>
							<FlexItem shrink>
								<Chunk>
									<Text 
										style={{whiteSpace: 'nowrap'}} 
										weight="strong"
										>Delivery <Text color="secondary">or</Text> Pickup</Text>
								</Chunk>
							</FlexItem>
							<FlexItem>
								<Chunk>
									<Inline>
									<Icon 
										shape="MapPin"
										size="small"
										/>
									<Text weight="strong">Brooklyn</Text>
									</Inline>
								</Chunk>
							</FlexItem>
						</Flex>
					</Sectionless>
				</Bounds>
			</Stripe>
			
			<Stripe>
				<Bounds>
					<Section>
						<Flex>
							<FlexItem>
								<Chunk>
									<Text type="sectionHead">Daily Deals</Text>
									<Text type="small" color="secondary">Epic deals from your favorite restaurants!</Text>
								</Chunk>
							</FlexItem>
							<FlexItem shrink justify="flex-end">
								<Text 
									color="secondary" 
									type="small" 
									nowrap
									>View all 19 &rarr;</Text>
							</FlexItem>
						</Flex>
						<Chunk>
							<List
								variant={{
									small: "hscroll",
									large: "grid",
								}}
								itemsInRow={{
									large: 3
								}}
								items={dealsData}
								renderItem={(item, i)=>{
									return (
										<View key={i}>
											<Chunk>
												<Image 
													source={{uri: item.photo}}
													style={[styles.pseudoLineHeight, {height: 200}]}
												/>
												
												<Text weight="strong">{item.name}</Text>
												<Text type="small" color="hint">{item.desc}</Text>
											</Chunk>
										</View>
									)
								}}
								/>
						</Chunk>
					</Section>

					<Section>
						<Flex>
							<FlexItem>
								<Chunk>
									<Text type="sectionHead">Nearby</Text>
								</Chunk>
							</FlexItem>
						</Flex>
						<Chunk>
							<List
								variant={{
									small: "hscroll",
									large: "grid",
								}}
								itemsInRow={{
									large: 3
								}}
								items={nearbyData}
								renderItem={(item, i)=>{
									return (
										<View key={i}>
											<Chunk>
												<Image 
													source={{uri: item.photo}}
													style={[styles.pseudoLineHeight, {height: 200}]}
												/>
												
												<Text weight="strong">{item.name}</Text>
												<Text type="small" color="hint">{item.desc}</Text>
											</Chunk>
										</View>
									)
								}}
								/>
						</Chunk>
					</Section>
				</Bounds>
			</Stripe>
		
		</View>
	)
}

export default Postmates;