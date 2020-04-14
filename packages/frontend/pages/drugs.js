import React, {Fragment} from 'react';
import {findNodeHandle} from 'react-native';
import { connect } from 'react-redux';
const fetch = require('isomorphic-unfetch');

import {
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

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import styles from '../components/cinderblock/styles/styles';
import Page from '../components/Page';

import swatches from '../components/cinderblock/styles/swatches';
import {METRICS} from '../components/cinderblock/designConstants';
import {WithMatchMedia} from '../components/cinderblock/components/WithMatchMedia';


import DRUGS from './drugsdata';
const DRUGSBYID = Object.assign({}, ...DRUGS.map((s,i) => ({[s.drugId]: {...s, 'index': i}})));


const SearchForm = withFormState((props) => {
	
	const { 
		onFocus = ()=>{},
		searchString,
		drugs,
		setDrugId,
		resetFields
	} = props;

	const searchDrugs = drugs.filter(drug => {
		if(!searchString){
			return true;
		}
		else{
			return (
				drug.brandName.toUpperCase().startsWith(searchString.toUpperCase()) ||
				drug.genericName.toUpperCase().startsWith(searchString.toUpperCase())
			);
		}
	});

	return(
		<form>
			<Chunk>
				<View style={{position: 'relative'}}>
					<TextInput
						id="searchString"
						placeholder="Curious about a drug you take?"
						value={props.getFieldValue('searchString')}
						onChangeText={text => props.setFieldValue('searchString', text)}
						onFocus={onFocus}
						autoComplete="off"
						style={{borderRadius: 4000, WebKitAppearance: 'searchfield', paddingLeft: 48}}
						keyboardType="search"
						/>
					<View style={{position: 'absolute', top: 0, left: 16, height: '100%', justifyContent: 'center'}}> 
						<Icon shape="Search"  />
					</View>
				</View>
			</Chunk>

			{ searchDrugs.length == 0 && searchString && 
				<Chunk>
					<Text>No drugs in our list match <strong>{searchString}</strong></Text>
				</Chunk>
			}

			{ searchDrugs.length > 0 && searchString && searchDrugs.map((drug,i)=>{
				return(
					<Touch key={i} onPress={()=>{
						resetFields();
						setDrugId(drug.drugId)
					}}>
						<Chunk style={
								(i > 0) ? { borderTopWidth: 1, borderTopColor: swatches.border, paddingTop: 16 } : {}
							}>
							<Text  type="big">{drug.genericName}</Text>
							<Text >{drug.brandName}</Text>
						</Chunk>
					</Touch>
				);
			})}

		</form>
	)
});


 

class Scratch extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			searchString: "",
			drugs: DRUGS,
			drugsById: DRUGSBYID,
			toggleModal: false,
			drugId: null,
		}
		this.stripeRef = React.createRef();
		this.wrapRef = React.createRef();

		this.toggleModal = this.toggleModal.bind(this);
		this.scrollStripeIntoView = this.scrollStripeIntoView.bind(this);
		this.setDrugId = this.setDrugId.bind(this);
	}

	componentDidMount(){
		//TODO: get hash data
		this.setDrugId();
	}

	setDrugId(drugId){
		if(!this.state.drugsById[drugId]){
			drugId = this.state.drugs[0].drugId;
		}
		this.setState({
			drugId: drugId
		});
	}

	setNextDrugId(currentDrugId){
		const currentIndex = this.state.drugsById[currentDrugId].index;
		const nextIndex = (currentIndex + 1 >= this.state.drugs.length) ? 0 : currentIndex + 1;
		const drugId = this.state.drugs[nextIndex].drugId;
		this.setDrugId(drugId);
	}

	toggleModal() {
		this.setState({modalVisible: !this.state.modalVisible})
	}

	scrollStripeIntoView(){
		/*
		requestAnimationFrame(() => {
			if (this.stripeRef && this.wrapRef) {
			 this.stripeRef.current.measureLayout(
				findNodeHandle(this.wrapRef.current),(x, y) => {
					window.scrollTo(0, y-10);
			 });
			}
		});
		*/
	}

	render() {

		const drugs = this.state.drugs;
		const media = this.props.media;

		const thisDrug = this.state.drugsById[this.state.drugId];
		if(thisDrug){
			thisDrug.priceNum = Math.round(Number(thisDrug.price.replace(/[^0-9\.-]+/g,"")));
		}

		return (
				<View ref={this.wrapRef}>

					<Header maxWidth={800} position="fixed">
						<Flex direction="row">
							<FlexItem>
									<Text type="sectionHead" color="secondary">SITE NAME</Text>
							</FlexItem>
							<FlexItem shrink>
									<Touch onPress={()=>{
										alert('TODO: like, a menu or something');
									}}>
										<Icon shape="Menu" />
									</Touch>
							</FlexItem>
						</Flex>
					</Header>

					<Stripe style={[{backgroundColor: swatches.notwhite, minHeight: '100vh', paddingTop: 0}]}>

						<Bounds style={{maxWidth: 800}}>
							<Section>

								<SearchForm
									onSubmit={(fields) => {
										alert(`in theory we are submitting... ${JSON.stringify(fields)}`);
									}}
									onChange={(fields) => {
										this.setState({searchString: fields.searchString});
									}}
									onFocus={this.scrollStripeIntoView}
									searchString = {this.state.searchString}
									drugs = {this.state.drugs}
									setDrugId = {this.setDrugId}
									/>	
					

								{ thisDrug && !this.state.searchString && 
									<Chunk>
										<Card 
											style={{
												borderRadius: 10, 
												minHeight: '50vh', 
												borderWidth: 0,
												shadowRadius: 16,
												shadowColor: 'rgba(0,0,0,.15)',
												borderRadius: 12
											}}>
											<Stripe>
											<Section>

												<Chunk>
													{/* <Text type="small" color="tint" weight="strong" style={{lineHeight: 12}}>PRESCRIPTION DRUG</Text> */}
													<Text type="pageHead">{thisDrug.brandName || '{missing brand name}'}</Text>
													<Text type="sectionHead" color="hint" style={{fontStyle: 'italic', lineHeight: 26, fontWeight: 300, marginBottom: 8}}>{thisDrug.genericName}</Text>
												</Chunk>

											
											<Flex direction="column" switchDirection="large">
												<FlexItem growFactor={2}>
													<Flex direction="row">
														<FlexItem>
															<Chunk>
																<Text weight="strong">Price in United States</Text>
																<Text style={{fontSize: 26, lineHeight: 32, fontWeight: 300}}>{acct.formatMoney(thisDrug.priceNum, '$', 0)}/mo</Text>
															</Chunk>	
														</FlexItem>	
														<FlexItem>
															<Chunk>
																<Text weight="strong">Outside United States</Text>
																<Text style={{fontSize: 26, lineHeight: 32, fontWeight: 300}}>{acct.formatMoney(thisDrug.priceNum/2, '$', 0)}/mo</Text>
															</Chunk>
														</FlexItem>	
													</Flex>
												</FlexItem>
												
												<FlexItem  growFactor={1}>
													<Chunk>
														<Text weight="strong">US Taxpayers funded</Text>
														<Text>Research, Development, Basic Science</Text>
													</Chunk>
												</FlexItem>

											</Flex>
											
											<Chunk>
												<Text weight="strong">What's the story?</Text>
												<Text>Drug manufacturer {thisDrug.companyName} was able bring {thisDrug.brandName} to market thanks to taxpayer-funded {thisDrug.indication.toLowerCase().trim() || ''} reseach by Dr. Sally Scientist at {thisDrug.publicInstitution.trim()}. In 2018 alone, the United States spent {thisDrug.federal} on this drug, but is legally banned from negotating lower prices, thanks to pharmaceutical industry lobbying.</Text>
											</Chunk>
										</Section>
										<Section>
											<Chunk>
												<Button 
													style={{alignSelf: 'center'}}
													label="What?! Show me another one" 
													variant={{
														small: 'grow',
														medium: 'shrink'
													}}
													onPress={()=>{
														this.setNextDrugId(thisDrug.drugId)
													}} />
											</Chunk>
										</Section>
										</Stripe>
									</Card>
								</Chunk>
							}
						</Section>
						
					</Bounds>
				</Stripe>						
			

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

		</View>
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
)(WithMatchMedia(Scratch));