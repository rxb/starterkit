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

import Fuse from 'fuse.js';

import styles from '../components/cinderblock/styles/styles';
import Page from '../components/Page';

import swatches from '../components/cinderblock/styles/swatches';
import {METRICS} from '../components/cinderblock/designConstants';
import {WithMatchMedia} from '../components/cinderblock/components/WithMatchMedia';

/*
import TEMPDRUGS from './drugsdata';
const DRUGS = TEMPDRUGS.filter( d => d.price && d.brandname );
const DRUGSBYID = Object.assign({}, ...DRUGS.map((s,i) => ({[s.drugid]: {...s, 'index': i}})));
const drugsFuse = new Fuse(DRUGS, {
	includeScore: true,
	includeMatches: true,
	keys: ['brandname', 'genericname'],
	threshold: .5
});
*/

class SearchFormComponent extends React.Component {

	constructor(props){
		super(props);
		this.setFirstdrugid = this.setFirstdrugid.bind(this);
	}

	setFirstdrugid(){
		this.props.setDrugId(this.props.searchDrugs[0].item.drugid);
	}

	render(){

		const { 
			onFocus = ()=>{},
			searchString,
			searchDrugs,
			setDrugId,
			resetFields,
			getFieldValue,
			setFieldValue
		} = this.props;

		return(

			<form>
				<Chunk>
					<View style={{position: 'relative'}}>
						<TextInput
							id="searchString"
							placeholder="Curious about a drug you take?"
							value={getFieldValue('searchString')}
							onChangeText={text => setFieldValue('searchString', text)}
							onFocus={onFocus}
							autoComplete="off"
							style={{borderRadius: 4000, paddingLeft: 48}}
							keyboardType="web-search"
							onKeyPress={(event)=>{
								if(event.keyCode === 13) {
									this.setFirstdrugid();
									resetFields();
								}
							}}
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

				{ searchDrugs.length > 0 && searchString && searchDrugs.map((hit,i)=>{
					const drug = hit.item;
					return(
						<Touch key={i} onPress={()=>{
							resetFields();
							setDrugId(drug.drugid)
						}}>
							<Chunk style={
									(i > 0) ? { borderTopWidth: 1, borderTopColor: swatches.border, paddingTop: 16 } : {}
								}>
								<Text type="big">{drug.brandname} ({drug.genericname})</Text>
							</Chunk>
						</Touch>
					);
				})}
			</form>
		)
	}
};
const SearchForm = withFormState(SearchFormComponent);

class Scratch extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			searchString: "",
			searchDrugs: [],
			drugs: [],
			drugsById: {},
			toggleModal: false,
			drugid: null,
			drugsFuse: new Fuse([])
		}
		this.stripeRef = React.createRef();
		this.wrapRef = React.createRef();

		this.toggleModal = this.toggleModal.bind(this);
		this.scrollStripeIntoView = this.scrollStripeIntoView.bind(this);
		this.setDrugId = this.setDrugId.bind(this);
	}

	componentDidMount(){
			
		this.fetchDrugsFromGoogleSheet()
			.then( data => {

				const DRUGS = data;
				const DRUGSBYID = Object.assign({}, ...DRUGS.map((s,i) => ({[s.drugid]: {...s, 'index': i}})));
				const drugsFuse = new Fuse(DRUGS, {
					includeScore: true,
					includeMatches: true,
					keys: ['brandname', 'genericname'],
					threshold: .5
				}); 

				this.setState({
					drugs: DRUGS,
					drugsById: DRUGSBYID,
					drugsFuse: drugsFuse
				}, () => {
					//TODO: get hash data
					this.setDrugId();
				});
			});
		
	}

	fetchDrugsFromGoogleSheet(){
		
		// TODO: move to server-side script, cache results in memory to avoid google api hit 
		const fetch = require('isomorphic-unfetch');
		const SHEETCODE = '17RAGBz0ckLc1kqDIf62U_m-mNw0ZYnDomKDnH8VuSz8';
		const SHEETPAGE = '1';
		const SHEETURL = `https://spreadsheets.google.com/feeds/list/${SHEETCODE}/${SHEETPAGE}/public/values?alt=json`;
		return fetch(SHEETURL, {cors: true})
			.then(response => response.json())
			.then(body => {
				let parsed = body.feed.entry.map( (entry) => {
					let columns = {
						"updated": entry.updated["$t"]
					}
					// Dynamically add all relevant columns from the Sheets to the response
					Object.keys( entry ).forEach( (key) => {
						if ( /gsx\$/.test(key) ) {
							let newKey = key.replace("gsx$", "");
							columns[newKey] = entry[key]["$t"];
						} 
					});

					return columns;
				})
				return parsed;
			})
			.then( data => data.filter( d => d.price && d.brandname ) ) // filter bad records
	}

	setSearchString(searchString = ""){
		this.setState({
			searchString: searchString,
			searchDrugs: this.state.drugsFuse.search(searchString) || []
		});
			
	}

	setDrugId(drugid){
		if(!this.state.drugsById[drugid]){
			drugid = this.state.drugs[0].drugid;
		}
		this.setState({
			drugid: drugid
		});
	}

	setNextdrugId(currentdrugid){
		const currentIndex = this.state.drugsById[currentdrugid].index;
		const nextIndex = (currentIndex + 1 >= this.state.drugs.length) ? 0 : currentIndex + 1;
		const drugid = this.state.drugs[nextIndex].drugid;
		this.setDrugId(drugid);
	}

	toggleModal() {
		this.setState({modalVisible: !this.state.modalVisible})
	}

	scrollStripeIntoView(){
		requestAnimationFrame(() => {
			window.scrollTo(0, 0	);
		});
	}

	render() {

		const {
			media
		} = this.props;

		const thisDrug = this.state.drugsById[this.state.drugid];

		// TODO: get numeric data from the sheet
		if(thisDrug){
			thisDrug.priceNum = Math.round(Number(thisDrug.price.replace(/[^0-9\.-]+/g,"")));
		}

		return (
				<View ref={this.wrapRef}>



					<Stripe style={[{minHeight: '100vh', paddingTop: 0}]}>

					<Header maxWidth={800} position="static" type="transparent">
						<Flex direction="row">
							<FlexItem>
									<Link href="/drugs">
										<Text type={ media.medium ? 'sectionHead' : 'big'} color="tint" style={{fontWeight: 700}}>SITE NAME</Text>
									</Link>
							</FlexItem>
							<FlexItem shrink justify="center">
									<Touch onPress={()=>{
										alert('TODO: like, a menu or something');
									}}>
										<Icon shape="Menu" color={swatches.tint} />
									</Touch>
							</FlexItem>
						</Flex>
					</Header>

						<Bounds style={{maxWidth: 800}}>
							<Section style={{marginTop: -1 * METRICS.space}}>

								<SearchForm
									onSubmit={(fields) => {
										console.log('submitting?'); 
									}}
									onChange={(fields) => {
										this.setSearchString(fields.searchString);
									}}
									onFocus={this.scrollStripeIntoView}
									searchString = {this.state.searchString}
									drugs = {this.state.drugs}
									searchDrugs = {this.state.searchDrugs}
									setDrugId = {this.setDrugId}
									/>	
					

								{ thisDrug && !this.state.searchString &&
								<Fragment> 
									<Chunk>
										<Card 
											style={{
												borderRadius: 10, 
												minHeight: '50vh', 
												borderWidth: 0,
												shadowRadius: 16,
												shadowColor: 'rgba(0,0,0,.15)',
												borderRadius: 12,
											}}>
									
											<Sectionless style={[(media.medium) ? {paddingHorizontal: 30, paddingTop: 20, paddingBottom: 5} : {}]}>

												<Chunk>
													{/* <Text type="small" color="tint" weight="strong" style={{lineHeight: 12}}>PRESCRIPTION DRUG</Text> */}
													<Text type="pageHead">{thisDrug.brandname || '{missing brand name}'}</Text>
													<Text type="sectionHead" color="hint" style={{fontStyle: 'italic', lineHeight: 26, fontWeight: 300}}>{thisDrug.genericname}</Text>
												</Chunk>

												<Flex direction="column" switchDirection="large">
													<FlexItem growFactor={2}>
														<Flex direction="row">
															<FlexItem>
																<Chunk>
																	<Text weight="strong">Price in United States</Text>
																	<Text style={{fontSize: 24, lineHeight: 32, fontWeight: 300}}>{acct.formatMoney(thisDrug.priceNum, '$', 0)}<Text>/mo</Text></Text>
																</Chunk>	
															</FlexItem>	
															<FlexItem>
																<Chunk>
																	<Text weight="strong">Outside United States</Text>
																	<Text style={{fontSize: 24, lineHeight: 32, fontWeight: 300}}>{acct.formatMoney(thisDrug.priceNum/2, '$', 0)}<Text>/mo</Text></Text>
																</Chunk>
															</FlexItem>	
														</Flex>
													</FlexItem>
													<FlexItem  growFactor={1}>
														<Chunk>
															<Text weight="strong">US Taxpayers funded</Text>
															<Text>Research, Basic Science</Text>
														</Chunk>
													</FlexItem>
												</Flex>
												
												<Chunk>
													<Text weight="strong">What's the story?</Text>
													<Text>Drug manufacturer {thisDrug.companyName} was able bring {thisDrug.brandname} to market thanks to taxpayer-funded {thisDrug.indication.toLowerCase().trim() || ''} reseach by Dr. Sally Scientist at {thisDrug.publicinstitution.trim()}. In 2018 alone, the United States spent {thisDrug.federal} on this drug, but is legally banned from negotating lower prices, thanks to pharmaceutical industry lobbying.</Text>
												</Chunk>
												<Chunk style={{
													alignItems: 'center', 
												}}>
													
													<Button 
														label="Show me another one" 
														variant={{
															small: 'grow',
															medium: 'shrink'
														}}
														textType="big"
														onPress={()=>{
															this.setNextdrugId(thisDrug.drugid)
														}} />
														
												</Chunk>
											</Sectionless>
										</Card>
								</Chunk>
								
								</Fragment>
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