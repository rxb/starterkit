import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Head from 'next/head'
import dayjs from 'dayjs';

//import { Map, Marker, Popup, TileLayer } from 'react-leaflet-universal'

import {
	addPrompt,
	addToast,
	createEvent,
	fetchEvents
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

import AREAS from './areas';


const EventForm = withFormState((props) => {

	const {
		getFieldValue,
		setFieldValue,
		handleSubmit,
		resetFields,
		fieldErrors = {}
	} = props;

	return(
		<form autocomplete="off">
			<Chunk>
				<Flex direction="column" switchDirection="large">
					<FlexItem>
						<TextInput
							id="url"
							value={getFieldValue('url')}
							onChange={e => setFieldValue('url', e.target.value)}
							placeholder="URL of the event"
							autoComplete="whatever"
							/>
						<FieldError error={fieldErrors.url} />
					</FlexItem>
					<FlexItem shrink>
						<Button
							onPress={handleSubmit}
							label="Post Event"
							isLoading={props.isLoading}
							/>
					</FlexItem>
				</Flex>
			</Chunk>
		</form>
	);
});


class Events extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			events: [],
			showPrompt: false,
			user: {},
			testEvent: {},
			coords: {"latitude":0,"longitude":0},
			test: 'test'
		}
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
			createEvent,
			events,
			user,
		} = this.props;

		return (
			<Page>
				<Head>
					<meta property='og:title' content='Scratch' />
					<title>Events</title>
				</Head>
				<Stripe style={{backgroundColor: '#F9D5D3'}}>
					<Bounds>
						<Sections>
							<Section type="pageHead">
								<Chunk>
									<Text type="pageHead">/r/leanfire</Text>
								</Chunk>

							</Section>
						</Sections>
					</Bounds>
				</Stripe>
				<Stripe>
					<Bounds>
						<Sections>
							<Section type="pageHead">
								<Chunk>
									<Text type="sectionHead">Events near New York</Text>
								</Chunk>
							</Section>


							<Flex direction="column" switchDirection="large">
								<FlexItem growFactor={3}>
									<Section>

										{/*

										Add events from
											Facebook,
											Meetup,
											Eventbrite,
											Splashthat
											Patch,

										(other event sites might work too... put the link in and give it a try!)

										*/}

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

										<List
											renderItem={(event, i)=>{
											  	return (
											  		<Chunk key={i}>
											  			<Link
											  				target="_blank"
											  				href={event.url}
											  				>
													  		<Text type="small">{dayjs(event.startDate).format('dddd, MM/DD/YYYY h:mm a')} {event.latitude} {event.longitude}</Text>
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
											items={events.items}
											/>

									</Section>
									<Section>
										<Chunk>
											<Text type="sectionHead">Events around the world!</Text>
										</Chunk>
									</Section>
								</FlexItem>
								<FlexItem growFactor={2}>
									<Section>
										<Chunk>
											<Card>


												<Map
													cluster={false}
													fitBounds={true}
													style={{height: 300}}
													markers={events.items.map((event, i)=>{
														return {lat: event.latitude, lon: event.longitude}
													})}
													/>


											</Card>
											<Text color="hint">{JSON.stringify(this.state.coords)}</Text>
										</Chunk>
									</Section>
								</FlexItem>
							</Flex>



						</Sections>
					</Bounds>
				</Stripe>

			</Page>

		);
	}
}


const mapStateToProps = (state, ownProps) => {
	return ({
		user: state.user,
		events: state.events
	});
}

const actionCreators = {
	addPrompt,
	addToast,
	createEvent,
	fetchEvents
};

export default connect(
	mapStateToProps,
	actionCreators
)(Events);

