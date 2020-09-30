import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Head from 'next/head'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)


//import { Map, Marker, Popup, TileLayer } from 'react-leaflet-universal'

import {
	addPrompt,
	addToast,
	createEvent,
	fetchEvents,
	fetchLocalEvents
} from '../actions';


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
	Sections,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch,
	View,
	withFormState
} from '../components/cinderblock';
import { runValidations, readFileAsDataUrl, checkToastableErrors } from '../components/cinderblock/formUtils';

import styles from '../components/cinderblock/styles/styles';
import Page from '../components/Page';

import OutpostHeader from '../components/OutpostHeader';

import AREAS from '../data/areas';
import swatches from '../components/cinderblock/styles/swatches';
import { METRICS } from '../components/cinderblock/designConstants';
import { Check } from 'react-feather';


const EventForm = withFormState((props) => {

	/*

	Add events from
		Facebook,
		Meetup,
		Eventbrite,
		Splashthat
		Patch,
		Evensi.us,


	(other event sites might work too... put the link in and give it a try!)

	*/

	const {
		getFieldValue,
		setFieldValue,
		handleSubmit,
		resetFields,
		fieldErrors = {}
	} = props;

	return(
		<form autocomplete="off">
			<LoadingBlock isLoading={props.isLoading}>
				<Chunk>

					<TextInput
						id="url"
						value={getFieldValue('url')}
						onChange={e => setFieldValue('url', e.target.value)}
						placeholder="Event URL"
						autoComplete="whatever"
						/>

					<FieldError error={fieldErrors.url} />
					<Button
						onPress={handleSubmit}
						label="Import"
						isLoading={props.isLoading}
						/>
				</Chunk>
				
			</LoadingBlock>
		</form>
	);
});


class Events extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			events: [],
			user: {},
			testEvent: {},
			coords: {"latitude":0,"longitude":0},
			test: 'test',
			modalVisible: false,
		}
		this.toggleModal = this.toggleModal.bind(this);
	}

	toggleModal() {
		this.setState({modalVisible: !this.state.modalVisible})
	}

	componentDidMount(){
		const getPosition = function (options) {
			return new Promise(function (resolve, reject) {
				navigator.geolocation.getCurrentPosition(resolve, reject, options);
			});
		}

		getPosition().then((position)=>{
			const coords = {latitude: parseFloat(position.coords.latitude), longitude: parseFloat(position.coords.longitude)}
			this.setState({coords: coords});
			this.setState({test: 'whatever'})
		});

		this.props.fetchEvents();
		this.props.fetchLocalEvents({radius: 80, latitude: 40.7128, longitude: -74.0060});
	}

	componentDidUpdate(prevProps){

		// watching for toastable errors
		// still feel like maybe this could go with form?
		const messages = {
			events: {
				BadRequest: 'Something went wrong',
				GeneralError: 'Something went wrong (GeneralError)',
			}
		};
		checkToastableErrors(this.props, prevProps, messages);

		if(prevProps.events.itemsById !== this.props.events.itemsById && this.state.modalVisible){
			this.toggleModal();
		}

	}

/*

// EVENTS
// add event from url
// parses as part of create action hook
// returns new event to be inserted into list with JSON-LD
// or just returns list
//

*/

	render() {

		const {
			areas,
			createEvent,
			events,
			allEvents,
			localEvents,
			user,
		} = this.props;

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

						<Flex direction="column" switchDirection="large" >

							<FlexItem growFactor={2}>
								<Section>
									<Chunk>
										<Text type="big" color="secondary" style={{marginBottom: 8, marginTop: -3}}>
											<Image 
												source="https://api.faviconkit.com/reddit.com/32"
												style={{
													width: 20,
													height: 20,
													resizeMode: 'contain',
													flex: 1,
													marginRight: 6,
													marginBottom: -3
												}}
												/>
											/r/financialindependence</Text>
										<Text type="pageHead" >Financial independence</Text>
									</Chunk>
									
									{/*									
									<Chunk>
										<Text color="primary">For those that want to approach the problem of financial independence from a minimalist, stoic, frugal, or anti-consumerist trajectory. <a href="https://reddit.com/r/leanfire"><Text color="hint">More on Reddit &#8599;</Text></a></Text>
									</Chunk>
									*/}

									<Chunk>
										
										<Button 
											label="Suggest an event"
											onPress={this.toggleModal}
											width="full"
											/>	
										{/*
										<Button
											color="secondary"
											label="Import an event from..."
											onPress={this.toggleModal}
											width="full"
											/>	
										*/}										
										<Button 
											color="secondary"
											label="Follow"
											onPress={()=>{ alert('get notified'); }}
											shape="Bell"
											width="full"
											/>
									</Chunk>
								</Section>
							</FlexItem>

							<FlexItem growFactor={3}>
								<Section>
									<Chunk>
										{/* all events near you + a planning thread */}
										
										<Text type="sectionHead">Events in New York</Text>
									</Chunk>
									<List
										items={localEvents.items}
										variant="grid"
										itemsInRow={{
											small: 1
										}}
										renderItem={(event, i)=>{
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
																	<Inline style={{flexWrap: 'nowrap'}}>
																<Avatar
																	source={{uri: `https://randomuser.me/api/portraits/women/${i%50}.jpg`}}
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
																		backgroundColor: swatches.shade,
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
																			source={`https://www.google.com/s2/favicons?domain=${hostname}`}
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

										{/* suggest next */}
										<Chunk >
													<Link
														target="_blank"
														>
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
																	<Inline style={{flexWrap: 'nowrap'}}>
																<Avatar
																	source={{uri: `https://randomuser.me/api/portraits/women/52.jpg`}}
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
											

								</Section>
							
								<Section>
									<Chunk>
										<Text type="sectionHead">Happening other places</Text>
										{/* this would be upcoming events and seeded converstions planning events in a wide range of cities */}
									</Chunk>
									
									<List
										items={areas}
										variant={{
											small: "linear",
										}}
										renderItem={(area, i)=>{
											return (
												<Chunk>
													<Flex>
														<FlexItem shrink justify="center">
															<View style={{width: 120}}>
																<Text color="tint" weight="strong" numberOfLines={1}>
																	<Icon
																		shape="MapPin"
																		size="small"
																		color={swatches.tint}
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
											);
										}}
										/>
								</Section>
							</FlexItem>
							
						</Flex>

					</Bounds>
				</Stripe>

			</Page>
				
				<Modal
					visible={this.state.modalVisible}
					onRequestClose={this.toggleModal}
					>
					<Stripe>
						<Section>
							<Chunk>
								<Text type="pageHead">Import an event</Text>
							</Chunk>
							<Chunk>
								<Text>Eventbrite, Facebook, Splashthat, Meetup, or many other event hosting sites</Text>
							</Chunk>

							<EventForm
								initialFields={{
									url: ''
								}}
								fieldErrors={events.error.fieldErrors}
								onSubmit={ (fields, context) => {
									this.props.createEvent( fields );
									context.resetFields();
									return false;
								}}
								isLoading={events.loading}
								/>

						</Section>
					</Stripe>
				</Modal>
			</Fragment>

		);
	}
}


const mapStateToProps = (state, ownProps) => {
	return ({
		user: state.user,
		events: state.events,
		allEvents: {
			items: state.events.itemIds.map( id => state.events.itemsById[id] ),
			loading: state.events.loading
		},
		localEvents: {
			items: state.events.localItemIds.map( id => state.events.itemsById[id] ),
			loading: state.events.loading
		},
		areas: AREAS.slice(0,12)
	});
}

const actionCreators = {
	addPrompt,
	addToast,
	createEvent,
	fetchEvents,
	fetchLocalEvents,
};

export default connect(
	mapStateToProps,
	actionCreators
)(Events);

const thisCardStyle = {
	borderWidth: 0,
	shadowRadius: 16,
	shadowColor: 'rgba(0,0,0,.15)',
	marginVertical: 0
}