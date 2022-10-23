import React, { Fragment, useEffect, useState, useContext } from 'react';

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addToast, addPrompt } from '../../actions';

// SWR
import {
	request,
	pageHelper,
	getEventsUrl,
	getEventUrl,
} from '@/swr';
import useSWR, { mutate } from 'swr';


import {
	Avatar,
	Bounds,
	Button,
	Card,
	CheckBox,
	Chunk,
	FieldError,
	Flex,
	FlexItem,
	Icon,
	Inline,
	Image,
	Label,
	List,
	Link,
	LoadingBlock,
	Map,
	Modal,
	Picker,
	Section,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch,
	View,
	useFormState,
	ThemeContext
} from 'cinderblock';
import Head from 'next/head'
import Page from '@/components/Page';
import OutpostHeader from '@/components/outpost/OutpostHeader';
import { Utils } from 'cinderblock';
const { runValidations, readFileAsDataUrl } = Utils;

// SCREEN-SPECIFIC
import AREAS from '../../data/areas';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

// STYLE




import { Check } from 'react-feather';



const EventForm = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	/*

	Add events from
		Facebook,
		Meetup,
		Eventbrite,
		Splashthat
		Patch,
		(other event sites might work too... put the link in and give it a try!)
	*/

	const dispatch = useDispatch();
	const { authentication } = props

	const formState = useFormState({
		initialFields: {
			url: ''
		},
		toastableErrors: {
			BadRequest: 'Something went wrong',
			NotAuthenticated: 'Not signed in',
			GeneralError: "Something went wrong and it's not your fault"
		},
		addToast: msg => dispatch(addToast(msg))
	});

	const submitForm = async () => {
		formState.setLoading(true);
		try {
			const event = await request(getEventUrl(), {
				method: 'POST',
				data: formState.fields,
				token: authentication.accessToken
			});
			formState.resetFields();
			console.log(event);
			props.onSuccess();
		}
		catch (error) {
			formState.setError(error);
		}
		finally {
			formState.setLoading(false);
		}
		return false;
	}

	return (
		<form autocomplete="off">
			<LoadingBlock isLoading={formState.loading}>
				<Chunk>
					<TextInput
						id="url"
						value={formState.getFieldValue('url')}
						onChange={e => formState.setFieldValue('url', e.target.value)}
						placeholder="Event URL"
						autoComplete="whatever"
					/>
					<FieldError error={formState.error?.fieldErrors?.url} />
					<Button
						onPress={submitForm}
						label="Import"
						isLoading={formState.loading}
					/>
				</Chunk>
			</LoadingBlock>
		</form>
	);
};


function Events(props) {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

	const thisCardStyle = {
		borderWidth: 0,
		shadowRadius: 16,
		shadowColor: 'rgba(0,0,0,.15)',
		marginBottom: METRICS.pseudoLineHeight
	}

	const areas = AREAS.slice(0, 12);

	const authentication = useSelector(state => state.authentication);
	const user = authentication.user;

	const events = pageHelper(useSWR(getEventsUrl()));

	const localEvents = pageHelper(useSWR(getEventsUrl({ radius: 80, latitude: 40.7128, longitude: -74.0060 })));


	const [coords, setCoords] = useState({ latitude: 0, longitude: 0 })

	// modal visibility
	const [modalVisible, setModalVisible] = useState(false);
	const toggleModal = () => {
		setModalVisible(!modalVisible);
	}

	useEffect(() => {
		const getPosition = function (options) {
			return new Promise(function (resolve, reject) {
				navigator.geolocation.getCurrentPosition(resolve, reject, options);
			});
		}
		getPosition().then((position) => {
			const coords = {
				latitude: parseFloat(position.coords.latitude),
				longitude: parseFloat(position.coords.longitude)
			};
			setCoords(coords);
		});


	}, []);



	/*

	// EVENTS
	// add event from url
	// parses as part of create action hook
	// returns new event to be inserted into list with JSON-LD
	// or just returns list
	//

	*/

	return (

		<Fragment>
			<OutpostHeader />
			<Page hideHeader={true}>
				<Head>
					<meta property='og:title' content='Scratch' />
					<title>Events</title>
				</Head>
				<Stripe>

					<Bounds>

						<Section>
							<Flex direction="column" switchDirection="large">
								<FlexItem>
									<Chunk>
										<Text color="secondary" style={{ marginTop: 3, marginBottom: 3 }}>
											<Image
												source={{ uri: "https://api.faviconkit.com/reddit.com/32" }}
												style={{
													width: 16,
													height: 16,
													resizeMode: 'contain',
													flex: 1,
													marginRight: 6,
													marginBottom: -3
												}}
											/>
										/r/financialindependence</Text>
										<Text type="pageHead" >Financial independence</Text>
									</Chunk>
									<Chunk>
										<Text color="primary">For those that want to approach the problem of financial independence from a minimalist, stoic, frugal, or anti-consumerist trajectory. <a href="https://reddit.com/r/leanfire"><Text color="hint">More on Reddit &#8599;</Text></a></Text>
									</Chunk>
								</FlexItem>
								<FlexItem shrink>
									<Chunk>
										<Flex>
											<FlexItem>
												<Button
													shape="Plus"
													label="Add event"
													onPress={toggleModal}
													width="full"
												/>
											</FlexItem>
											<FlexItem>
												<Button
													color="secondary"
													label="Follow"
													onPress={() => { alert('get notified'); }}
													shape="Bell"
													width="full"
												/>
											</FlexItem>
										</Flex>
									</Chunk>
								</FlexItem>
							</Flex>
						</Section>
					</Bounds>
				</Stripe>
				<Stripe style={{ borderTopWidth: 1, borderColor: SWATCHES.border, backgroundColor: SWATCHES.backgroundShade }}>
					<Bounds>
						<Section>
							<Flex direction="column" switchDirection="large" >
								<FlexItem growFactor={1}>
									<Chunk>
										<Text type="sectionHead">Happening Nearby + Online</Text>
									</Chunk>
								</FlexItem>

								<FlexItem growFactor={3}>
									{localEvents.data &&
										<List
											items={localEvents.data.items}
											variant="grid"
											itemsInRow={{
												small: 1
											}}
											renderItem={(event, i) => {
												const hostname = event.url.match(/^https?\:\/\/(www\.)?([^\/?#]+)(?:[\/?#]|$)/i)[2];
												return (
													<Chunk key={i}>
														<Link
															target="_blank"
															href={event.url}
														>
															<Card style={thisCardStyle}>
																<Sectionless>
																	<Chunk>
																		<Text type="small" color="tint" weight="strong">{dayjs(event.startDate).format('dddd, MMM D LT')}</Text>
																		<Text type="big" weight="strong">{event.title}</Text>

																		<Text type="small" color="secondary">{event.locationName} &middot; {event.city}</Text>


																	</Chunk>
																	<Chunk>
																		<Flex>
																			<FlexItem>
																				<Inline style={{ flexWrap: 'nowrap' }}>
																					<Avatar
																						source={{ uri: `https://randomuser.me/api/portraits/women/${i % 50}.jpg` }}
																						size="small"
																						style={{
																							width: 18,
																							height: 18
																						}}
																					/>
																					<Text type="small" color="hint">
																						/u/sallyposter
																</Text>
																				</Inline>
																			</FlexItem>
																			<FlexItem justify="center" shrink>
																				<View style={{
																					backgroundColor: SWATCHES.shade,
																					paddingHorizontal: 6,
																					borderRadius: 4,
																					alignSelf: 'flex-end'
																				}}>
																					<Text
																						type="micro"
																						color="hint"
																						numberOfLines={1}
																						ellipsizeMode="tail"
																					>
																						{/*
																	<Image
																		source={{uri: `https://www.google.com/s2/favicons?domain=${hostname}`}}
																		style={{
																			width: 13,
																			height: 13,
																			resizeMode: 'contain',
																			flex: 1,
																			marginRight: 4,
																		}}
																		/>
																	*/}
																						{hostname.toUpperCase()} &#8599;
																</Text>
																				</View>
																			</FlexItem>
																		</Flex>

																	</Chunk>
																</Sectionless>
															</Card>
														</Link>
													</Chunk>
												);
											}}

										/>

									}

									{/* suggest next */}
									<Chunk>
										<Link target="_blank">
											<Card style={thisCardStyle}>
												<Sectionless>
													<Chunk>
														<Text type="small" color="tint" weight="strong">This weekend, TBD</Text>
														<Text type="big" weight="strong">Let's get together for drinks</Text>

														<Text type="small" color="secondary">TBD &middot; Greenpoint</Text>
													</Chunk>
													<Chunk>
														<Flex>
															<FlexItem>
																<Inline style={{ flexWrap: 'nowrap' }}>
																	<Avatar
																		source={{ uri: `https://randomuser.me/api/portraits/women/52.jpg` }}
																		size="small"
																		style={{
																			width: 18,
																			height: 18
																		}}
																	/>
																	<Text type="small" color="hint">
																		/u/sallyposter
																</Text>
																</Inline>
															</FlexItem>
															<FlexItem justify="center">

															</FlexItem>
														</Flex>

													</Chunk>
												</Sectionless>
											</Card>
										</Link>
									</Chunk>
								</FlexItem>
							</Flex>
						</Section>
						{/*															
					</Bounds>
				</Stripe>
				<Stripe style={{backgroundColor: SWATCHES.backgroundShade}}>
					<Bounds>
			*/}
						<Section>
							<Flex direction="column" switchDirection="large" >
								<FlexItem growFactor={1}>
									<Chunk>
										<Text type="sectionHead">Happening worldwide</Text>
										{/* this would be upcoming events and seeded converstions planning events in a wide range of cities */}
									</Chunk>
								</FlexItem>
								<FlexItem growFactor={3}>
									<List
										items={areas}
										variant="grid"
										itemsInRow={{
											small: 1,
											medium: 2,
										}}
										renderItem={(area, i) => {
											return (
												<Chunk>
													<Card>
														<Sectionless>
															<Chunk>
																<Flex>
																	<FlexItem shrink justify="center">
																		<View style={{ width: 120 }}>
																			<Text color="tint" weight="strong" numberOfLines={1}>
																				<Icon
																					shape="MapPin"
																					size="small"
																					color={SWATCHES.tint}
																				/>
																				{area.hostname.toUpperCase()}
																			</Text>
																		</View>
																	</FlexItem>
																	<FlexItem>
																		<Text type="small" color="hint">Meeting in 3 days: </Text>
																		<Text type="small"  >Let's hike to Mt Awesome</Text>
																	</FlexItem>
																</Flex>
															</Chunk>
														</Sectionless>
													</Card>
												</Chunk>
											);
										}}
									/>
								</FlexItem>
							</Flex>
						</Section>
					</Bounds>
				</Stripe>
			</Page>

			<Modal
				visible={modalVisible}
				onRequestClose={toggleModal}
			>
				<Stripe>
					<Section>
						<Chunk>
							<Text type="pageHead">Add event</Text>
						</Chunk>
						<Chunk>
							<Text>Eventbrite, Facebook, Splashthat, Meetup, or many other event hosting sites</Text>
						</Chunk>

						<EventForm
							authentication={authentication}
							onSuccess={() => setModalVisible(false)}
						/>

					</Section>
				</Stripe>
			</Modal>
		</Fragment>

	);
}


export default Events;

