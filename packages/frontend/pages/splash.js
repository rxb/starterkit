import React, {Fragment, useState} from 'react';
import { connect } from 'react-redux';

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
	View,
	withFormState,
	
} from '../components/cinderblock';

import styles from '../components/cinderblock/styles/styles';
import swatches from '../components/cinderblock/styles/swatches';
import {METRICS} from '../components/cinderblock/designConstants';
import {WithMatchMedia} from '../components/cinderblock/components/WithMatchMedia';
import Page from '../components/Page';




import Markdown from 'markdown-to-jsx';


const ConnectedHeader = WithMatchMedia((props) => {

	const {
		media
	} = props;

	return(
		<Header position="static" type="transparent">
			<Flex direction="row">
				<FlexItem>
						<Link href="/splash">
							<Text type={ media.medium ? 'sectionHead' : 'big'} inverted style={{fontWeight: 700}}>outpost</Text>
						</Link>
				</FlexItem>
				<FlexItem shrink justify="center">
						<Touch onPress={()=>{
							alert('TODO: like, a menu or something');
						}}>
							<Icon shape="Menu" color="white" />
						</Touch>
				</FlexItem>
			</Flex>
		</Header>
	);
});


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
			searchItems = [],
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

				{ searchItems.length == 0 && searchString && 
					<Chunk>
						<Text>No drugs in our list match <strong>{searchString}</strong></Text>
					</Chunk>
				}

				{ searchItems.length > 0 && searchString && searchDrugs.map((hit,i)=>{
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

class HeaderBlurb extends React.Component {
	
	/* TODO: add typing effect */

	constructor(props){
		super(props);
		this.state = {
			blurbExampleUses: [
				"subreddits",
				"twitter accounts",
				"universities",
				"podcasts"
			],
			blurbExampleUse: 0
		}
	}
	componentDidMount(){
		if(this.props.cycle){
			const blurbInterval = setInterval(()=>{
				const blurbExampleUse = this.state.blurbExampleUse + 1 < this.state.blurbExampleUses.length ? this.state.blurbExampleUse + 1 : 0;
				this.setState({blurbExampleUse});
			}, 1000);
			this.setState({blurbInterval});
		}
	}
	componentWillUnmount(){
		clearInterval(this.state.blurbInterval);
	}
	render() {
		return (
			<Text type="sectionHead" inverted style={{textAlign: 'center'}}>Local outposts for <u>{this.state.blurbExampleUses[this.state.blurbExampleUse]}</u></Text>
		);
	}
}

class Splash extends React.Component {


	_renderItemCard(outpost, i) {
		return(
			<Chunk>
			<Card>
				<Sectionless style={{backgroundColor: swatches.tint}}>
						<Chunk>
							<Text type="big" inverted>{outpost.name}</Text>
							<Text type="small" color="primary" inverted>2l,293 members</Text>
							<Text type="small" color="secondary" inverted>Tokyo</Text>
							<Text type="small" color="secondary" inverted>Los Angeles</Text>
							<Text type="small" color="secondary" inverted>Monterrey</Text>
							<Text type="small" color="secondary" inverted><u>See all...</u></Text>
						</Chunk>
				</Sectionless>
			</Card>
			</Chunk>
		);
	}

	render() {

		const {
			user
		} = this.props;

		const outposts = {
			subreddit: [
				{
					name: '/r/AnimalCrossing'
				},
				{
					name: '/r/politics'
				},
				{
					name: '/r/apple'
				},
				{
					name: '/r/AnimalCrossing'
				},
				{
					name: '/r/politics'
				},
				{
					name: '/r/apple'
				},
				{
					name: '/r/AnimalCrossing'
				},
				{
					name: '/r/politics'
				},				
			]
		}

		return (
			<View style={{minHeight: '100vh'}}>
				

				<Stripe 
					style={{paddingTop: 0, backgroundColor: '#0000ff22'}} 
					image="https://images.unsplash.com/photo-1562571046-d34f606e7693?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2734&q=80"
					imageHeight={{small: 300, medium: 400, large: 400, xlarge: 475}}
					>
					<ConnectedHeader />
					<View style={{justifyContent: 'center', flex: 1}}>
						<Bounds>
							<Section>
								<Chunk>
									<Text type="hero" inverted style={{textAlign: 'center'}}>Find the others</Text>
								</Chunk>
								<Chunk>
									<HeaderBlurb cycle={false} />
								</Chunk>
							</Section>
						</Bounds>
					</View>
				</Stripe>
				<Stripe style={{backgroundColor: swatches.backgroundShade}}>
					<Bounds>

							<Section>
								<Chunk>
									<Text type="sectionHead">Top subreddit outposts</Text>
								</Chunk>
								
								{outposts.subreddit &&
									<List
										variant={{
											small: "linear",
											medium: "grid"
										}}
										itemsInRow={{
											small: 1,
											medium: 2,
											large: 4
										}}
										renderItem={{
											small: this._renderItemCard,
											medium: this._renderItemCard
										}}
										scrollItemWidth={300}
										items={outposts.subreddit}
										/>
								}

							</Section>

					</Bounds>
				</Stripe>
			</View>
		);


	}
}



const mapStateToProps = (state, ownProps) => {	
	return ({
		user: state.user,
	});
}

const actionCreators = {};

export default connect(
	mapStateToProps,
	actionCreators
)(Splash);