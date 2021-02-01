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
	FakeInput,	
} from '@/components/cinderblock';

import styles from '@/components/cinderblock/styles/styles';
import swatches from '@/components/cinderblock/styles/swatches';
import {METRICS} from '@/components/cinderblock/designConstants';
import Page from '@/components/Page';
import Head from 'next/head'

const photosData = [
	{photo: "https://a0.muscache.com/im/pictures/f51b7bce-89bf-4ad5-bcbd-f299593fe5d4.jpg?im_w=720"},
	{photo: "https://a0.muscache.com/im/pictures/abe3de62-debe-4f7a-a02b-1d601795881e.jpg?im_w=720"},
	{photo: "https://a0.muscache.com/im/pictures/1329b8fc-77d6-4866-a842-b757e795c687.jpg?im_w=720"},
	{photo: "https://a0.muscache.com/im/pictures/dd106805-edd1-42df-aebc-1a9d39b3bdc7.jpg?im_w=720"},
	{photo: "https://a0.muscache.com/im/pictures/179ea677-b290-4180-97bf-edd24ca80ced.jpg?im_w=720"},
	{photo: "https://a0.muscache.com/im/pictures/218bf92d-0d2d-4381-9253-8dece14681a9.jpg?im_w=720"},
]

const amenitiesSamples = [
	{name: "Self check-in", photo: "https://a0.muscache.com/airbnb/static/select/pdp/amenities/tile-view-2x/self-check-in.png"},
	{name: "Free parking on premises", photo: "https://a0.muscache.com/airbnb/static/select/pdp/amenities/tile-view-2x/parking.png"},
	{name: "Gym", photo: "https://a0.muscache.com/airbnb/static/select/pdp/amenities/tile-view-2x/gym.png"},
	{name: "Full kitchen", photo: "https://a0.muscache.com/airbnb/static/select/pdp/amenities/tile-view-2x/kitchen.png"},	
]
const amenitiesData = [...amenitiesSamples, ...amenitiesSamples, ...amenitiesSamples]

const AirbnbDetail = (props) => {

	return(
		<View style={{minHeight: '100vh'}}>
			<Head>
				<title>Airbnb Modernist Apartment in Roma Norte</title>
			</Head>
			<Stripe>
				<Bounds>
					<Sectionless>
						<Chunk>
							<Text>header</Text>
						</Chunk>
					</Sectionless>
				</Bounds>
			</Stripe>
			<Stripe>
				<Bounds>
					<Section>
						<Flex>
							<FlexItem>
								<Chunk>
									<Text type="pageHead">Modernist Apartment in Roma Norte</Text>
									<Text color="secondary" type="small">
										<Text color="primary" weight="strong" type="small">4.82</Text> (89) 
										• Superhost 
										• Ciudad de Mexico, Mexico
									</Text>
								</Chunk>
							</FlexItem>
							<FlexItem shrink justify="flex-end">
								<Chunk>
									<Flex>
										<FlexItem>
											<Inline nowrap>
												<Icon shape="Share" size="small" /> 
												<Text type="small">Share</Text>
											</Inline>
										</FlexItem>
										<FlexItem>
											<Inline nowrap>
												<Icon shape="Heart" size="small" /> 
												<Text type="small">Save</Text>
											</Inline>
										</FlexItem>
									</Flex>
								</Chunk>
							</FlexItem>
						</Flex>

						<Chunk>
							<Flex>
								<FlexItem growFactor={2}>
									<Image
										source={{uri: "https://a0.muscache.com/im/pictures/a71cd818-3edc-4486-a4f8-cca704d8f7d8.jpg?aki_policy=xx_large"}}
										style={{height: 400}}
										/>
								</FlexItem>
								<FlexItem growFactor={1}>
										<Image
											source={{uri: "https://a0.muscache.com/im/pictures/5a371273-3b1d-4daa-aff5-cc6e91527887.jpg?aki_policy=xx_large"}}
											style={{height: 200}}
											/>
										<Image
											source={{uri: "https://a0.muscache.com/im/pictures/218bf92d-0d2d-4381-9253-8dece14681a9.jpg?aki_policy=xx_large"}}
											style={{height: 200}}
											/>
								</FlexItem>
							</Flex>
						</Chunk>
					</Section>
					<Flex>
						<FlexItem growFactor={4}>		
					<Section>
						<Flex>
							<FlexItem>
								<Chunk>
									<Text type="sectionHead">Entire apartment hosted by Jamil</Text>
									<Text>3 guests • 1 bedroom • 1 bed • 1.5 baths</Text>
								</Chunk>
							</FlexItem>
							<FlexItem>
								<Avatar
									source="https://a0.muscache.com/im/pictures/user/7f8135f6-613b-41bf-95e3-da043e8c1749.jpg?im_w=240"
									size="medium"
									/>
							</FlexItem>
						</Flex>
					</Section>
					
					<Section>
						<Chunk>
							<Flex>
								<FlexItem shrink>
									<Icon
										shape="Star"
										/>
								</FlexItem>
								<FlexItem>
									<Text weight="strong">Enhanced Clean</Text>
									<Text color="secondary">This host committed to Airbnb's 5-step enhanced cleaning process.</Text>
								</FlexItem>
							</Flex>
						</Chunk>
						<Chunk>
							<Flex>
								<FlexItem shrink>
									<Icon
										shape="Calendar"
										/>
								</FlexItem>
								<FlexItem>
									<Text weight="strong">Free cancellation until 3:00 PM on Feb 20</Text>
									<Text color="secondary">After that, cancel before 3:00 PM on Feb 25 and get a 50% refund, minus the first night and service fee. </Text>
								</FlexItem>
							</Flex>
						</Chunk>
						<Chunk>
							<Flex>
								<FlexItem shrink>
									<Icon
										shape="Book"
										/>
								</FlexItem>
								<FlexItem>
									<Text weight="strong">House rules</Text>
									<Text color="secondary">The host doesn’t allow pets, parties, or smoking</Text>
								</FlexItem>
							</Flex>
						</Chunk>
					</Section>
					<Section>
						<Chunk>
							<Text>Shower in a stylish Corian cabin before preparing a tasty brunch in a kitchen filled with new Teka appliances. The state-of-the-art structure is set within a historic 1910 home, and this downstairs loft also benefits from a shaded garden courtyard.</Text>
						</Chunk>
					</Section>
					<Section>
						<Chunk>
							<Text>“Come and experience an oasis in the heart of La Roma!” -- Jamil, your host</Text>
						</Chunk>
						<Chunk>
							<Text weight="strong">Contact host</Text>
						</Chunk>
					</Section>
					<Section>
							<List
								variant={{
									small: "hscroll",
									medium: "grid",
								}}
								itemsInRow={{
									small: 2,
									medium: 3,
									large: 3,
								}}
								items={photosData}
								renderItem={(item, i)=>{
									return(
										<Chunk>
										<Image 
											source={{uri: item.photo}}
											style={{height: 160}}
											/>
										</Chunk>
									);
								}}
								/>
								<Chunk>
									<Button
										label="Show all photos"
										color="secondary"
										/>
								</Chunk>
					</Section>

					</FlexItem>
						<FlexItem growFactor={2}>
							<Card>
								<Sectionless>
									<Chunk>
										<Text type="big" weight="strong">$69 <Text>/ night</Text></Text>
									</Chunk>
									<Chunk>
										<Flex>
											<FlexItem>
												<FakeInput
													label="Check-in"
													shape="Calendar"
													/>
											</FlexItem>
											<FlexItem>
												<FakeInput
													label="Checkout"
													shape="Calendar"
													/>
											</FlexItem>											
										</Flex>
										<Picker >
											<Picker.Item label="1 guest" value="1" />
										</Picker>

										<Button
											label="Reserve"
											width="full"
											/>
										<Text type="small" color="secondary" style={{alignSelf: 'center'}}>You won't be charged yet</Text>
									</Chunk>
									<Chunk>
										<Flex>
											<FlexItem><Text>$69 x 3 nights</Text></FlexItem>
											<FlexItem shrink><Text>$207</Text></FlexItem>
										</Flex>
										<Flex>
											<FlexItem><Text>Cleaning fee</Text></FlexItem>
											<FlexItem shrink><Text>$40</Text></FlexItem>
										</Flex>
										<Flex>
											<FlexItem><Text>Service fee</Text></FlexItem>
											<FlexItem shrink><Text>$35</Text></FlexItem>
										</Flex>
										<Flex>
											<FlexItem><Text>Occupancy taxes and fees</Text></FlexItem>
											<FlexItem shrink><Text>$50</Text></FlexItem>
										</Flex>																				
									</Chunk>
									<Chunk>
										<Flex>
											<FlexItem><Text weight="strong">Total</Text></FlexItem>
											<FlexItem shrink><Text weight="strong">$332</Text></FlexItem>
										</Flex>
									</Chunk>
								</Sectionless>
							</Card>
						</FlexItem>
					</Flex>
					<Section>
						<Chunk>
							<Text type="sectionHead">Every Airbnb Plus place is inspected in person for quality</Text>
						</Chunk>
						<Flex direction="column" switchDirection="medium">
							<FlexItem>
								<Chunk>
								<Image 
									source={{uri: "https://a0.muscache.com/im/pictures/9e72d454-1e73-4b59-92b7-79bf7066cbc5.jpg?aki_policy=x_medium"}}
									style={[
										styles.pseudoLineHeight,
										{height: 200}
									]}
									/>
							
									<Text weight="strong">Always fully equipped</Text>
									<Text type="small">Count on verified amenities like fast wifi and kitchens ready for cooking.</Text>
								</Chunk>
							</FlexItem>
							<FlexItem>
								<Chunk>
								<Image 
									source={{uri: "https://a0.muscache.com/im/pictures/98e95075-a8ce-4d57-8d9b-f9a0bf69de46.jpg?aki_policy=x_medium"}}
									style={[
										styles.pseudoLineHeight,
										{height: 200}
									]}
									/>
						
									<Text weight="strong">Always fully equipped</Text>
									<Text type="small">Count on verified amenities like fast wifi and kitchens ready for cooking.</Text>
								</Chunk>
							</FlexItem>
							<FlexItem>
								<Chunk>
								<Image 
									source={{uri: "https://a0.muscache.com/im/pictures/90cd9cba-761a-49b2-ac91-4aa24521c1e2.jpg?aki_policy=x_medium"}}
									style={[
										styles.pseudoLineHeight,
										{height: 200}
									]}
									/>
								
									<Text weight="strong">Always fully equipped</Text>
									<Text type="small">Count on verified amenities like fast wifi and kitchens ready for cooking.</Text>
								</Chunk>
							</FlexItem>
						</Flex>
					</Section>
					<Section>
						<Chunk>
							<Text type="sectionHead">Amenities</Text>
						</Chunk>
						<List
							variant={{
								small: "hscroll",
								medium: "grid",
							}}
							itemsInRow={{
								small: 2,
								medium: 4,
								large: 6,
							}}
							items={amenitiesData}
							renderItem={(item, i)=>{
								return(
									<Chunk>
									<View style={[{
										backgroundColor: swatches.backgroundShade,
										height: 180,
										},
										styles.pseudoLineHeight
									]}>
										<Image 
											source={{uri: item.photo}}
											style={{
												height: 100
											}}
										/>
										<View style={{height: 80, justifyContent: 'center'}}>
											<Text style={{textAlign: 'center'}}>{item.name}</Text>
										</View>
									</View>
									</Chunk>
								)
							}} 
							/>
							<Button 
								color="secondary"
								label="Show all 17 amenities"
								/>
					</Section>
				</Bounds>
			</Stripe>
		</View>
	)
}


export default AirbnbDetail;