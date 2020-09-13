import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Head from 'next/head'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)


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
				</Chunk>
				<Chunk>
					<Button
						onPress={handleSubmit}
						label="Import event info"
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

			<Page hideHeader>
				<Head>
					<meta property='og:title' content='Scratch' />
					<title>Events</title>
				</Head>
				<Stripe style={{backgroundColor: swatches.tint, paddingTop: 0}}>
					<OutpostHeader />
					<Bounds>
							<Section style={{marginTop: METRICS.space / 2}}>
								<Chunk>
									<Text type="pageHead" inverted>/r/leanfire</Text>
									<Text inverted>New York, NY (Change location)</Text>
								</Chunk>

							</Section>
					</Bounds>
				</Stripe>
				<Stripe>
					<Bounds>
						


							<Flex direction="column" switchDirection="large">
								<FlexItem growFactor={5}>
									<Section>



										<Chunk>
											<Text type="sectionHead">Upcoming events</Text>
											{/* all events near you + a planning thread */}
										</Chunk>

										<List
											renderItem={(event, i)=>{
											  	return (
											  		<Chunk key={i}>
											  			<Link
											  				target="_blank"
											  				href={event.url}
											  				>
													  		<Text type="small">{dayjs(event.startDate).format('dddd, MM/DD/YYYY h:mm a')}</Text>
													  		<Text type="big" weight="strong">{event.title}</Text>
													  		<Text type="small">{event.locationName} &middot; {event.city}</Text>

													  		{/* apparently you can inline images in text now woo */}
													  		<Text
													  			type="small"
													  			color="hint"
													  			numberOfLines={1}
													  			ellipsizeMode="tail"
													  			>
														  		<Image
														  			source={`https://www.google.com/s2/favicons?domain=${event.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[1]}`}
														  			style={{
														  				width: 13,
														  				height: 13,
														  				resizeMode: 'contain',
														  				flex: 1,
														  				marginRight: 4,
														  			}}

														  			/>
															  		{event.url}
													  		</Text>
													  	</Link>
												  	</Chunk>
											  	);
											}}
											items={localEvents.items}
											/>

									</Section>
									<Section>
										<Chunk>
											<Text type="sectionHead">More /r/leanfire outposts</Text>
											{/* this would be upcoming events and seeded converstions planning events in a wide range of cities */}
										</Chunk>
											<List
											variant={{
												small: "scroll",
												//small: "linear",
												medium: "grid"
											}}
											itemsInRow={{
												small: 1,
												medium: 2,
												large: 3
											}}
											renderItem={(area, i)=>{
											  	return (
														<Chunk>
															<Card>
																<Stripe style={{backgroundColor: swatches.tint}}>
																<Section>
																	<Chunk>
																		<Text type="big" inverted>{area.hostname}</Text>
																	</Chunk>
																</Section>
																</Stripe>
															<Stripe>
																<Section>
																	<Chunk>
																		<Text type="small">in 2 days: Let's hike to Mt Awesome</Text>
																	</Chunk>
																</Section>
															</Stripe>
																
															</Card>
														</Chunk>
											  	);
											}}
											items={areas}
											/>

									</Section>
								</FlexItem>
								<FlexItem growFactor={3}>
									<Section>
										<Chunk>
											<Button 
												label="Post new event"
												onPress={this.toggleModal}
												width="full"
												/>
										</Chunk>
										<Chunk>
											<Text>About this subreddit</Text>
										</Chunk>
										<Chunk>
											<Text>For those that want to approach the problem of financial independence from a minimalist, stoic, frugal, or anti-consumerist trajectory.</Text>
										</Chunk>
									</Section>

									<Section>
										<Chunk>
											<Card>

												<Map
													cluster={false}
													fitBounds={true}
													style={{height: 300}}
													markers={localEvents.items.map((event, i)=>{
														return {lat: event.latitude, lon: event.longitude}
													})}
													/>

											</Card>
											<Text color="hint">{JSON.stringify(this.state.coords)}</Text>
										</Chunk>
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
						<Section type="pageHead">
							<Chunk>
								<Text type="pageHead">Post new event</Text>
								<Text>Import event info from Eventbrite, Facebook, Splashthat, Meetup, or many other event hosting sites</Text>
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
		areas: AREAS.slice(0,32)
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

