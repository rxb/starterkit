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


const DRUGS = [
	{
	  "genericName": "Bendamustine Hydrochloride",
	  "brandName": "Bendeka",
	  "drugId": 1
	},
	{
	  "genericName": "Methylnaltrexone Bromide",
	  "brandName": "RELISTOR",
	  "drugId": 2
	},
	{
	  "genericName": "Gadoxetate Disodium",
	  "brandName": "Eovist",
	  "drugId": 3
	},
	{
	  "genericName": "Lobenguane Sulfate",
	  "brandName": "",
	  "drugId": 4
	},
	{
	  "genericName": "Lacosamide",
	  "brandName": "Vimpat",
	  "drugId": 5
	},
	{
	  "genericName": "Plerixafor",
	  "brandName": "Mozobil",
	  "drugId": 6
	},
	{
	  "genericName": "Gadofosveset Trisodium",
	  "brandName": "Vasovist",
	  "drugId": 7
	},
	{
	  "genericName": "Artemether, lumefantrine",
	  "brandName": "Coartem",
	  "drugId": 8
	},
	{
	  "genericName": "Pralatrexate",
	  "brandName": "Folotyn",
	  "drugId": 9
	},
	{
	  "genericName": "Romidepsin",
	  "brandName": "Istodax",
	  "drugId": 10
	},
	{
	  "genericName": "Capsaicin",
	  "brandName": "",
	  "drugId": 11
	},
	{
	  "genericName": "Fampridine",
	  "brandName": "Ampyra",
	  "drugId": 12
	},
	{
	  "genericName": "Ulipristal Acetate",
	  "brandName": "Ella",
	  "drugId": 13
	},
	{
	  "genericName": "Eribulin Mesylate",
	  "brandName": "Halaven",
	  "drugId": 14
	},
	{
	  "genericName": "Abiraterone Acetate",
	  "brandName": "Zytiga",
	  "drugId": 15
	},
	{
	  "genericName": "Linagliptin",
	  "brandName": "Tradjenta",
	  "drugId": 16
	},
	{
	  "genericName": "Deferiprone",
	  "brandName": "Ferriprox",
	  "drugId": 17
	},
	{
	  "genericName": "Ingenol Mebutate",
	  "brandName": "Picato",
	  "drugId": 18
	},
	{
	  "genericName": "Ivacaftor",
	  "brandName": "Kalydeco",
	  "drugId": 19
	},
	{
	  "genericName": "Lucinactant",
	  "brandName": "SURFAXIN",
	  "drugId": 20
	},
	{
	  "genericName": "Florbetapir",
	  "brandName": "Amyvid",
	  "drugId": 21
	},
	{
	  "genericName": "Cobicistat, elvitegravir, emtricitabine, tenofovier, disoproxil fumarate",
	  "brandName": "Tybost",
	  "drugId": 22
	},
	{
	  "genericName": "Enzalutamide",
	  "brandName": "Xtandi",
	  "drugId": 23
	},
	{
	  "genericName": "Choline",
	  "brandName": "",
	  "drugId": 24
	},
	{
	  "genericName": "Teduglutide Recombinant ",
	  "brandName": "Juxtapid",
	  "drugId": 25
	},
	{
	  "genericName": "Lomatapide Mesylate",
	  "brandName": "Juxtapid",
	  "drugId": 26
	}
];

const DRUGSBYID = Object.assign({}, ...DRUGS.map((s,i) => ({[s.drugId]: {...s, 'index': i}})));


const SearchForm = withFormState((props) => {
	
	const { 
		onFocus = ()=>{},
		searchString,
		drugs,
		setDrugId
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
				<TextInput
					id="searchString"
					placeholder="Curious about a drug you take?"
					value={props.getFieldValue('searchString')}
					onChangeText={text => props.setFieldValue('searchString', text)}
					onFocus={onFocus}
					autoComplete="off"
					style={{borderRadius: 4000, WebKitAppearance: 'searchfield'}}
					keyboardType="search"
					/>
			</Chunk>

			{ searchDrugs.length == 0 && searchString && 
				<Chunk>
					<Text>No drugs match <strong>{searchString}</strong></Text>
				</Chunk>
			}

			{ searchDrugs.length > 0 && searchString && searchDrugs.map((drug,i)=>{
				return(
					<Touch key={i} onPress={()=>{
						setDrugId(drug.drugId)
					}}>
						<Chunk>
							<Text type="big">{drug.genericName}</Text>
							<Text>{drug.brandName}</Text>
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
		requestAnimationFrame(() => {
			if (this.stripeRef && this.wrapRef) {
			 this.stripeRef.current.measureLayout(
				findNodeHandle(this.wrapRef.current),(x, y) => {
					window.scrollTo(0, y-10);
			 });
			}
		});
	}

	render() {

		const drugs = this.state.drugs;
		const media = this.props.media;

		const thisDrug = this.state.drugsById[this.state.drugId];

		return (
			<View ref={this.wrapRef}>
				<Flex noGutters direction="column" switchDirection="large" style={{minHeight: '100%'}}>
					<FlexItem growFactor={3}>
						<Stripe style={[
							{backgroundColor: '#080f5b'},
							media.large ? {position: 'fixed', top: 0, bottom: 0, right: `${5/8*100}vw`, justifyContent: 'center'} : {}
						]}>
							<Bounds>
								<Section>
									<Chunk>
										<Text type="hero" inverted>WTF?</Text>
										<Text type="sectionHead" inverted>US Taxpayers fund drug research but aren't allowed to ask for fair prices</Text>
									</Chunk>
									<Chunk>
										<Text inverted>It's crazy, but it's true. Medicare is legally banned from negotiating with drug companies for fair prices, even though US taxpayers fund nearly 50% of the research those drugs are based on.</Text>
									</Chunk>
									<Chunk>
										<Touch onPress={this.toggleModal}>
											<Text weight="strong" style={{textDecoration: 'underline'}} inverted>About this site</Text>
										</Touch>
									</Chunk>
								</Section>
							</Bounds>
						</Stripe>
					</FlexItem>
					<FlexItem growFactor={5}>
						<Stripe style={{minHeight: '100vh'}} ref={this.stripeRef}>
							<Bounds>

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
						

									{ thisDrug &&
										<Card style={{borderRadius: 10, minHeight: '50vh'}}>
											<Section>
												<Chunk>
													<Text type="small" color="tint" weight="strong">TAXPAYER-FUNDED DRUG</Text>
													<Text type="pageHead">{thisDrug.genericName}</Text>
													<Text type="sectionHead" color="secondary" style={{fontStyle: 'italic'}}>Sold as "{thisDrug.brandName}" by Merck</Text>
												</Chunk>
												

												<Chunk>
													<Text weight="strong">US Taxpayers funded</Text>
													<Text>Research, Development, Basic Science</Text>
												</Chunk>	
												<Chunk>
													<Text weight="strong">Price per month in US</Text>
													<Text>$12,092</Text>
												</Chunk>											
												<Chunk>
													<Text weight="strong">Price per month in Australia</Text>
													<Text>$5,239</Text>
												</Chunk>	
												<Chunk>
													<Text>Lorem ipsum dolor sit amet, eu sed ubique ornatus invenire, qui ei aeque timeam. Sed id solet pertinax. In sea idque mediocrem. An nusquam ocurreret his, te putent aperiam iudicabit ius. Sensibus eleifend at ius, mazim dolor ius eu, dicam ridens nam in.</Text>
												</Chunk>
												<Chunk>
													<Button 
														style={{alignSelf: 'center'}}
														label="Yeah, but that's an exception right?" 
														variant={{
															small: 'grow',
															medium: 'shrink'
														}}
														onPress={()=>{
															this.setNextDrugId(thisDrug.drugId)
														}} />
												</Chunk>
											</Section>
										</Card>
									}
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