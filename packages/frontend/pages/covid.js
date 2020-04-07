import React, {Fragment} from 'react';
import { connect } from 'react-redux';

import {
	Bounds,
	Button,
	Card,
	CheckBox,
	Chunk,
	Flex,
	FlexItem,
	Icon,
	Inline,
	Image,
	Label,
	List,
	Link,
	Map,
	Modal,
	Picker,
	Section,
	Sections,
	Sectionless,
	Stripe,
	Tabs,
	Text,
	TextInput,
	Touch,
	View,
	withFormState
} from '../components/cinderblock';

import acct from 'accounting';

import styles from '../components/cinderblock/styles/styles';
import Page from '../components/Page';

import swatches from '../components/cinderblock/styles/swatches';
import {METRICS} from '../components/cinderblock/designConstants';

import getCovidData from './coviddata';

const SearchForm = withFormState((props) => {
	return(
		<form>
			<Chunk>
				<TextInput
					id="searchPlaces"
					placeholder="Search locations"
					value={props.getFieldValue('searchPlaces')}
					onChangeText={text => props.setFieldValue('searchPlaces', text)}
					autoComplete="off"
					style={{borderRadius: 4000}}
					clearButtonMode="always"
					/>
			</Chunk>
			{/*
			<Chunk>
				<Button
					onPress={props.handleSubmit}
					label="Submit"
					/>
			</Chunk>
			*/}
		</form>
	)
});

/*
const Card1 = (props) => {
	
	const {
		place
	} = props;

	let rateDiffIcon = "ArrowRight";
	let rateDiffLabel = "Steady";
	let rateDiffColor = "orange";
	if(place.rateDiff.toFixed(1) < 0){
		rateDiffIcon = "TrendingUp";
		rateDiffLabel = "Faster";	
		rateDiffColor = "red";
	}
	else if(place.rateDiff.toFixed(1) > 0){
		rateDiffIcon = "TrendingDown";
		rateDiffLabel = "Slower";	
		rateDiffColor = "green";
	}

	return(
		<Card>
			<Section>
				<Flex direction="row">

				{ !place.notEnoughData && 
						<FlexItem 
							align="flex-end" justify="center"
							shrink
							>
							<Chunk>
								<View style={{backgroundColor: rateDiffColor, borderRadius: 6, width: 60, height: 60, padding: 8, alignItems: 'center', justifyContent: 'center'}}>
										<Icon shape={rateDiffIcon} color="white" />
										<Text type="micro" weight="strong" inverted>
											{rateDiffLabel.toUpperCase()}
										</Text>
								</View>
							</Chunk>
						</FlexItem>
					}

					<FlexItem>
						<Chunk>
							<Text type="sectionHead">{place.name}</Text>
							<Text type="small" color="hint">{place.positive} total  
							{ !place.notEnoughData &&
								<Fragment> • {place.perDay} new today</Fragment>
							}
							</Text>
						</Chunk>
					</FlexItem>
					{ place.notEnoughData &&
						<FlexItem align="flex-end" justify="center">
							<Chunk>
								<Text type="small" color="hint">not enough data</Text>
							</Chunk>
						</FlexItem>
					}
					
					{ !place.notEnoughData && 
							<FlexItem 
								align="flex-end" justify="center"
								style={{flexBasis: '8em'}} growFactor={0}
								>
								<Chunk>
									<Text type="small" color="secondary">now doubling in:</Text>
									<Text type="big">{place.doublingDaysString} days</Text>
								</Chunk>
							</FlexItem>
					}
					
					{ !place.notEnoughData && 
							<FlexItem 
								align="flex-end" justify="center"
								style={{flexBasis: '8em'}} growFactor={0}
								>
								<Chunk>
									<Text type="small" color="hint">previously:</Text>
									<Text type="big" color="hint">{place.previousDoublingDaysString} days</Text>
								</Chunk>
							</FlexItem>
					}

					
				</Flex> 
			</Section>
		</Card>

	);
} 

const Card2 = (props) => {
	
	const {
		place
	} = props;

	let rateDiffIcon = "ArrowRight";
	let rateDiffLabel = "Steady";
	let rateDiffColor = "orange";
	if(place.rateDiff.toFixed(1) < 0){
		rateDiffIcon = "ArrowUp";
		rateDiffLabel = "doubling faster";	
		rateDiffColor = "red";
	}
	else if(place.rateDiff.toFixed(1) > 0){
		rateDiffIcon = "ArrowDown";
		rateDiffLabel = "doubling slower";	
		rateDiffColor = "green";
	}

	return(
		<Card>
			<Section>
				<Flex direction="row">

					{ !place.notEnoughData && 
						<FlexItem 
							align="flex-end" justify="center"
							shrink
							>
							<Chunk>
								<View style={{backgroundColor: 'blue', borderRadius: 6, width: 60, height: 60, padding: 8, alignItems: 'center', justifyContent: 'center'}}>
									<Text type="sectionHead" inverted>{place.doublingDaysString}</Text>
									<Text type="micro" weight="strong" inverted style={{lineHeight: 13}}>
										DAYS
									</Text>
								</View>
							</Chunk>
						</FlexItem>
					}

					<FlexItem>
						<Chunk>
							<Text type="sectionHead">{place.name}</Text>
							{ !place.notEnoughData &&
								<Text>
									<Icon shape={rateDiffIcon} color="#222" size="small" /> 
									<Text type="small"> {rateDiffLabel}</Text>
									<Text color="hint" type="small"> • was {place.previousDoublingDaysString} days</Text>
								</Text>
							}
							{ place.notEnoughData &&
								<Text type="small" color="hint">not enough data</Text>
							}
						</Chunk>
					</FlexItem>
					
					<FlexItem 
						align="flex-end" justify="center"
						style={{flexBasis: '8em'}} growFactor={0}
						>
						<Chunk style={{borderColor: swatches.border, borderLeftWidth: 1, paddingLeft: 12}}>
							<Text type="small" color="secondary">total cases</Text>
							<Text type="big" color="secondary">{acct.formatNumber(place.positive)}</Text>
						</Chunk>
					</FlexItem>

					{ !place.notEnoughData && 
						<FlexItem 
							align="flex-end" justify="center"
							style={{flexBasis: '8em'}} growFactor={0}
							>
							<Chunk style={{borderColor: swatches.border, borderLeftWidth: 1, paddingLeft: 12}}>
								<Text type="small" color="secondary">new today</Text>
								<Text type="big" color="secondary">{acct.formatNumber(place.perDay)}</Text>
							</Chunk>
						</FlexItem>
					}

				</Flex> 
			</Section>
		</Card>

	);
} 

const Card3 = (props) => {
	
	const {
		place
	} = props;

	let rateDiffIcon = "ArrowRight";
	let rateDiffLabel = "Steady";
	let rateDiffColor = "orange";
	if(place.rateDiff.toFixed(1) < 0){
		rateDiffIcon = "ArrowUp";
		rateDiffLabel = "doubling faster";	
		rateDiffColor = "red";
	}
	else if(place.rateDiff.toFixed(1) > 0){
		rateDiffIcon = "ArrowDown";
		rateDiffLabel = "doubling slower";	
		rateDiffColor = "green";
	}

	return(
		<Card>
			<Section>
				<Flex direction="row">

					{ !place.notEnoughData && 
						<FlexItem 
							align="flex-end" justify="center"
							shrink
							>
							<Chunk>
								<View style={{backgroundColor: place.doublingDaysColor, borderRadius: 6, width: 60, height: 60, padding: 8, alignItems: 'center', justifyContent: 'center'}}>
									<Text type="sectionHead" inverted>{place.doublingDaysString}</Text>
									<Text type="micro" weight="strong" inverted style={{lineHeight: 13}}>
										DAYS
									</Text>
								</View>
							</Chunk>
						</FlexItem>
					}

					<FlexItem>
						<Chunk>
							<Text type="sectionHead">{place.name}</Text>
							{ !place.notEnoughData &&
								<Flex noGutters>
									<FlexItem shrink justifyContent="center"  >
										<Icon shape={rateDiffIcon} color="#222" size="small" style={{marginTop: 4, marginRight: 2}} /> 
									</FlexItem>
									<FlexItem>
										<Text>
											<Text>{rateDiffLabel}</Text>
											<Text color="hint"> (was {place.previousDoublingDaysString} days)</Text>
										</Text>
									</FlexItem>
								</Flex>
							}
							{ place.notEnoughData &&
								<Text type="small" color="hint">not enough data</Text>
							}
						</Chunk>
					</FlexItem>
					
					{ !place.notEnoughData && 
						<FlexItem 
							align="flex-end" justify="center"
							style={{flexBasis: '10em'}} growFactor={0}
							>
							<Chunk style={{borderColor: swatches.border, borderLeftWidth: 1, paddingLeft: 16}}>
								<Text>{acct.formatNumber(place.positive)} total cases</Text>
								<Text>{acct.formatNumber(place.perDay)} new today</Text>
							</Chunk>
						</FlexItem>
					}

				</Flex> 
			</Section>
		</Card>

	);
} 

const Card4 = (props) => {
	
	const {
		place
	} = props;

	let rateDiffIcon = "ArrowRight";
	let rateDiffLabel = "Steady";
	let rateDiffColor = "orange";
	if(place.rateDiff.toFixed(1) < 0){
		rateDiffIcon = "ArrowUp";
		rateDiffLabel = "rate accellerating";	
		rateDiffColor = "red";
	}
	else if(place.rateDiff.toFixed(1) > 0){
		rateDiffIcon = "ArrowDown";
		rateDiffLabel = "rate slowing";	
		rateDiffColor = "green";
	}

	return(
		<Card>
			<Section>
				<Flex direction="row">

					{ !place.notEnoughData && 
						<FlexItem 
							align="flex-end" justify="center"
							shrink
							>
							<Chunk>
								<View style={{backgroundColor: place.doublingDaysColor, borderRadius: 6, width: 60, height: 60, padding: 8, alignItems: 'center', justifyContent: 'center'}}>
									<Text type="sectionHead" inverted>{place.doublingDaysString}</Text>
									<Text type="micro" weight="strong" inverted style={{lineHeight: 13}}>
										DAYS
									</Text>
								</View>
							</Chunk>
						</FlexItem>
					}

					<FlexItem>
						<Chunk>
							<Text type="sectionHead">{place.name}</Text>

							<Text type="small">Current total: {acct.formatNumber(place.positive)} cases</Text>

							<Text type="small">At this rate, there will be {acct.formatNumber(place.positive * 2)} cases in {place.doublingDaysString} days</Text>

							{ place.notEnoughData &&
								<Text type="small" color="hint">not enough data</Text>
							}
						</Chunk>
					</FlexItem>
					
					{ !place.notEnoughData && 
						<FlexItem 
							align="flex-end" justify="center"
							style={{flexBasis: '10em'}} growFactor={0}
							>
						

							{ !place.notEnoughData &&
								<Flex noGutters>
									<FlexItem shrink justifyContent="center"  >
										<Icon shape={rateDiffIcon} color="#222" size="small" style={{marginTop: 4, marginRight: 2}} /> 
									</FlexItem>
									<FlexItem>
										<Text>
											<Text type="small">{rateDiffLabel}</Text>
											<Text type="small" color="hint"> (was {place.previousDoublingDaysString} days)</Text>
										</Text>
									</FlexItem>
								</Flex>
							}
						</FlexItem>
					}

				</Flex> 
			</Section>
		</Card>

	);
} 

const Card5 = (props) => {
	
	const {
		place
	} = props;

	let rateDiffIcon = "ArrowRight";
	let rateDiffLabel = "Steady";
	let rateDiffColor = "orange";
	if(place.rateDiff.toFixed(1) < 0){
		rateDiffIcon = "ArrowUp";
		rateDiffLabel = "rate accellerating";	
		rateDiffColor = "red";
	}
	else if(place.rateDiff.toFixed(1) > 0){
		rateDiffIcon = "ArrowDown";
		rateDiffLabel = "rate slowing";	
		rateDiffColor = "green";
	}

	return(
		<Card>
			<Section>
				<Flex direction="row">

					{ !place.notEnoughData && 
						<FlexItem 
							align="flex-end" justify="center"
							shrink
							>
							<Chunk>
								<View style={{backgroundColor: place.doublingDaysColor, borderRadius: 6, width: 60, height: 60, padding: 8, alignItems: 'center', justifyContent: 'center'}}>
									<Text type="sectionHead" inverted>{place.doublingDaysString}</Text>
									<Text type="micro" weight="strong" inverted style={{lineHeight: 13}}>
										DAYS
									</Text>
								</View>
							</Chunk>
						</FlexItem>
					}

					<FlexItem>
						<Chunk>
							<Text type="sectionHead">{place.name}</Text>

							<Text type="small" style={{maxWidth: 280}}>At this rate, the current total of {acct.formatNumber(place.positive)} cases will double to {acct.formatNumber(place.positive * 2)} in {place.doublingDaysString} days</Text>

							{ place.notEnoughData &&
								<Text type="small" color="hint">not enough data</Text>
							}
						</Chunk>
					</FlexItem>
					{ !place.notEnoughData && 
						<FlexItem 
							align="flex-end" justify="center"
							style={{flexBasis: '10em'}} growFactor={0}
							>
						

							{ !place.notEnoughData &&
								<Flex noGutters>
									<FlexItem shrink justifyContent="center"  >
										<Icon shape={rateDiffIcon} color="#222" size="small" style={{marginTop: 4, marginRight: 2}} /> 
									</FlexItem>
									<FlexItem>
										<Text>
											<Text type="small">{rateDiffLabel}</Text>
											<Text type="small" color="hint"> (was {place.previousDoublingDaysString} days)</Text>
										</Text>
									</FlexItem>
								</Flex>
							}
						</FlexItem>
					}

				</Flex> 
			</Section>
		</Card>

	);
} 

const Card6 = (props) => {
	
	const {
		place
	} = props;

	let rateDiffIcon = "ArrowRight";
	let rateDiffLabel = "steady";
	let rateDiffColor = "orange";
	if(place.rateDiff.toFixed(1) < 0){
		rateDiffIcon = "ArrowUp";
		rateDiffLabel = "faster";	
		rateDiffColor = "red";
	}
	else if(place.rateDiff.toFixed(1) > 0){
		rateDiffIcon = "ArrowDown";
		rateDiffLabel = "slower";	
		rateDiffColor = "green";
	}

	return(
		<Card>
				<Flex direction="row" noGutters>

					<FlexItem 
						shrink
						>
							<View style={{backgroundColor: place.doublingDaysColor, width: '4.5em', flex: 1, padding: 8, alignItems: 'center', justifyContent: 'center'}}>
								{ !place.notEnoughData && 
									<Fragment>
										<Text type="sectionHead" inverted style={{fontWeight: 700, letterSpacing: -1}}>{place.doublingDaysString}</Text>
										<Text type="micro" weight="strong" inverted style={{lineHeight: 13}}>
											DAYS
										</Text>
									</Fragment>
								}
							</View>
					</FlexItem>
					<FlexItem style={{flex: 1, paddingTop: METRICS.space, paddingLeft: METRICS.space, paddingRight: METRICS.space}}>
						<Chunk>
							<Flex direction="column" switchDirection="medium">
								<FlexItem 
									growFactor={7}
									>
										<Text type="sectionHead">{place.name}</Text>

										{ !place.notEnoughData &&
											<Text type="small" style={{maxWidth: 280}}>At this rate, the total of <strong>{acct.formatNumber(place.positive)} cases </strong>will <strong>double to {acct.formatNumber(place.positive * 2)}</strong> in {place.doublingDaysString} days</Text>
										}

										{ place.notEnoughData &&
											<Text type="small" color="hint">not enough data</Text>
										}
								</FlexItem>

								{ !place.notEnoughData && 
									<FlexItem 
										justify="center"
										shrink
										>
									
										<Flex noGutters style={{minWidth: '10em', marginVertical: 6}}>
											<FlexItem shrink>
												<Icon shape={rateDiffIcon} color="#222" size="small" style={{marginTop: 5, marginRight: 3, marginLeft: -3}} /> 
											</FlexItem>
											<FlexItem>
												<Text>
													<Text type="small" weight="strong">{rateDiffLabel.toUpperCase()} </Text>
													<Text type="small" color="hint" style={{whiteSpace: 'nowrap'}}>(was {place.previousDoublingDaysString} days)</Text>
												</Text>
											</FlexItem>
										</Flex>

									</FlexItem>
								}
							</Flex>
						</Chunk>
					</FlexItem>
				</Flex> 

		</Card>

	);
} 
*/

const Card7 = (props) => {
	
	const {
		place
	} = props;

	let rateDiffIcon = "ArrowRight";
	let rateDiffLabel = "steady";
	let rateDiffColor = "orange";
	if(place.rateDiff.toFixed(1) < 0){
		rateDiffIcon = "ArrowUp";
		rateDiffLabel = "faster";	
		rateDiffColor = "red";
	}
	else if(place.rateDiff.toFixed(1) > 0){
		rateDiffIcon = "ArrowDown";
		rateDiffLabel = "slower";	
		rateDiffColor = "green";
	}

	return(
		<Card style={{borderRadius: 10}}>
				<Flex direction="row" noGutters>

					<FlexItem 
						shrink
						>
							<View style={{backgroundColor: place.doublingDaysColor, width: '5.5em', flex: 1, padding: 8, alignItems: 'center', justifyContent: 'center'}}>
								{ !place.notEnoughData && 
									<Fragment>
										<Text type="sectionHead" inverted style={{fontWeight: 700, letterSpacing: -1}}>{place.doublingDaysString}</Text>
										<Text type="micro" weight="strong" inverted style={{lineHeight: 13}}>
											DAYS
										</Text>
									</Fragment>
								}
							</View>
					</FlexItem>
					<FlexItem style={{flex: 1, paddingTop: METRICS.space, paddingLeft: METRICS.space, paddingRight: METRICS.space}}>
						<Chunk>
							<Flex direction="column" switchDirection="medium">
								<FlexItem>
										<Text type="sectionHead">{place.name}</Text>

										{ !place.notEnoughData &&
											<Fragment>
												<Text type="small" color="secondary">At this rate, cases will double from <Text type="small" weight="strong">{acct.formatNumber(place.positive)} to {acct.formatNumber(place.positive * 2)}</Text> in {place.doublingDaysString} days</Text>

												<Flex noGutters style={{minWidth: '10em', marginTop: 6}}>
													<FlexItem shrink>
														<Icon shape={rateDiffIcon} color="#222" size="small" style={{marginTop: 5, marginRight: 3, marginLeft: -3}} /> 
													</FlexItem>
													<FlexItem>
														<Text>
															<Text type="small" style={{fontSize: 13}} weight="strong">{rateDiffLabel.toUpperCase()} </Text>
															<Text type="small" color="hint" style={{whiteSpace: 'nowrap'}}>(was {place.previousDoublingDaysString} days)</Text>
														</Text>
													</FlexItem>
												</Flex>
											</Fragment>
										}

										{ place.notEnoughData &&
											<Text type="small" color="hint">not enough data</Text>
										}
								</FlexItem>
								
							</Flex>
						</Chunk>
					</FlexItem>
				</Flex> 

		</Card>

	);
} 

class Scratch extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			searchPlaces: "",
			places: [],
			toggleModal: false
		}
		this.toggleModal = this.toggleModal.bind(this);
	}

	componentDidMount(){
		getCovidData().then(data => {
			this.setState({places: data});
		})
	}

	toggleModal() {
		this.setState({modalVisible: !this.state.modalVisible})
	}

	render() {

		const tempPlaces = this.state.places;

		const places = tempPlaces.filter(place => {
			if(!this.state.searchPlaces){
				return true;
			}
			else{
				return place.name.toUpperCase().startsWith(this.state.searchPlaces.toUpperCase())
			}
		})

		return (
			<Fragment>
				<Flex noGutters direction="column" switchDirection="xlarge" style={{minHeight: '100%'}}>
					<FlexItem growFactor={3}>
						<Stripe style={{backgroundColor: '#080f5b', position: 'fixed', top: 0, bottom: 0, right: `${5/8*100}vw`, justifyContent: 'center'}}>
							<Bounds>
								<Section>
									<Chunk>
										<Text type="hero" inverted>How fast is COVID-19 doubling?</Text>
									</Chunk>
									<Chunk>
										<Text inverted>Each person infected with COVID-19 can spread it to many other people. The infection numbers grow more quickly with time, like a forest fire expanding out from a single spark. A good way to see how fast something is spreading in a situation like this is to look at the rate of doubling.</Text>
									</Chunk>
									<Chunk>
										<Touch onPress={this.toggleModal}>
											<Text type="big" style={{textDecoration: 'underline'}} inverted>About this site</Text>
										</Touch>
									</Chunk>
								</Section>
							</Bounds>
						</Stripe>
					</FlexItem>
					<FlexItem growFactor={5}>
						<Stripe>
							<Bounds>
								<Section>

									<SearchForm
										onSubmit={(fields) => {
											alert(`in theory we are submitting... ${JSON.stringify(fields)}`);
										}}
										onChange={(fields) => {
											this.setState({searchPlaces: fields.searchPlaces});
										}}
										/>
									{/*
									<Chunk>
										<Tabs>
											<Tabs.Item label="World" value="one" />
											<Tabs.Item label="United States" value="two" />
										</Tabs>
									</Chunk>									
									*/}

									{ !places.length && 
										<Chunk>
											<Text>No places match</Text>
										</Chunk>
									}

									{ places.map((place,i)=>{
										return(
											<Card7 place={place} key={i} />
										);
									})}
								</Section>
							</Bounds>
						</Stripe>						
					</FlexItem>					
				</Flex>

				<Modal
				visible={this.state.modalVisible}
				onRequestClose={this.toggleModal}
				>
				<Stripe>
					<Section type="pageHead">
						<Chunk>
							<Text type="pageHead">Modal Time</Text>
						</Chunk>
						<Chunk>
							<Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud</Text>
						</Chunk>
					</Section>
					<Section>
						
					</Section>
				</Stripe>
			</Modal>

		</Fragment>
		);


	}
}


const mapStateToProps = (state, ownProps) => {
	return ({
		//places: places
	});
}

const actionCreators = {};

export default connect(
	mapStateToProps,
	actionCreators
)(Scratch);