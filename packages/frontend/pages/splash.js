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
import OutpostHeader from '../components/OutpostHeader';



import Markdown from 'markdown-to-jsx';




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
			<Text type="sectionHead" inverted style={{textAlign: 'center'}}>Local outposts for {this.state.blurbExampleUses[this.state.blurbExampleUse]}</Text>
		);
	}
}

const HeaderContent = WithMatchMedia((props) => {
	const {
		media
	} = props;
	return(
		<Section>
			

			
			<Chunk>
				<Text type="hero" inverted style={{textAlign: 'center'}}>Find the others</Text>
			</Chunk>
			<Chunk>
				<Text 
					type="big" 
					inverted 
					style={[
						{textAlign: 'center'},
						media && media.large ? {fontSize: 24, lineHeight: 34} : {}
					]}
					>People near you are getting together about things you like</Text>
			</Chunk>
			{/*
			<Chunk style={{alignItems: 'center', textAlign: 'center'}}>
				<Text type="pageHead" style={{fontSize: 28}} inverted>People near you</Text>
				<Text type="pageHead" style={{fontSize: 28}} inverted>are getting together</Text>
				<Text type="pageHead" style={{fontSize: 28}} inverted>about things you like</Text>
			</Chunk>
			*/}
		</Section>
	);
});

const OutpostRow = (props) => {

	const {
		outposts = [],
		headline,
		site
	} = props;

	const gridItem = (outpost, i) => {
		return(
			<Chunk>
				<Link href="/events">
					<Card style={[thisCardStyle, ]}>
						<Sectionless style={{/*backgroundColor: swatches.tint*/}}>
								<Chunk>
									<View style={{marginBottom: 4}}>
										<Text type="small" color="secondary"  numberOfLines={1}>
											<Image 
												source={`https://api.faviconkit.com/${site}/32`}
												style={{
													width: 13,
													height: 13,
													resizeMode: 'contain',
													flex: 1,
													marginRight: 4,
													marginBottom: -2
												}}
												/>
											{outpost.name}
										</Text>
										<Text type="big" color="tint" numberOfLines={2}>{outpost.title}</Text>
									</View>
									
									<Text type="small" color="hint" numberOfLines={4}>Meeting in: Tokyo, Los Angeles, Pittsburgh, Medellin...</Text>
									
								</Chunk>
						</Sectionless>
					</Card>
				</Link>
			</Chunk>
		);
	} 

	return(
		<Section>
			<Chunk>
				<Text type="sectionHead">{headline}</Text>
			</Chunk>
			
			<List
				scrollItemWidth={240}
				items={outposts}
				variant={{
					small: "grid",
					medium: "grid"
				}}
				itemsInRow={{
					small: 2,
					medium: 2,
					large: 4
				}}
				renderItem={{
					small: gridItem,
					medium: gridItem
				}}
				/>
		</Section>
	);
}


class Splash extends React.Component {


	render() {

		const {
			user
		} = this.props;

		const outposts = {
			subreddit: [
				{
					name: '/r/AnimalCrossing',
					title: 'Animal Crossing'
				},
				{
					name: '/r/politics',
					title: 'Politics'
				},
				{
					name: '/r/apple',
					title: 'Apple'
				},
				{
					name: '/r/financialindependence',
					title: 'Financial Independence'
				},
				{
					name: '/r/QueerEye',
					title: 'Queer Eye'
				},
				{
					name: '/r/nonzerodays',
					title: 'Non-Zero Days'
				},
				{
					name: '/r/apple',
					title: 'Apple'
				},
				{
					name: '/r/leanfire',
					title: 'LeanFIRE'
				},
						
			],
			twitter: [
				{
					name: '@tferriss',
					title: 'Tim Ferris'
				},
				{
					name: '@a16z',
					title: 'Andreesen Horowitz'
				},
				{
					name: '@ycombinator',
					title: 'Y Combinator'
				},
				{
					name: '@davidasinclair',
					title: 'David Sinclair PhD'
				},
				{
					name: '@tferriss',
					title: 'Tim Ferris'
				},
				{
					name: '@a16z',
					title: 'Andreesen Horowitz'
				},
				{
					name: '@ycombinator',
					title: 'Y Combinator'
				},
				{
					name: '@davidasinclair',
					title: 'David Sinclair PhD'
				},		
			]
		}

		return (
			<Page hideHeader>
				{/* image="https://images.unsplash.com/photo-1502581827181-9cf3c3ee0106?ixlib=rb-1.2.1&auto=format&fit=crop&w=2642&q=80" */}

				<Stripe 
					style={{paddingTop: 0, backgroundColor: swatches.tint}} 
					imageHeight={{small: 360, medium: 400, large: 400, xlarge: 475}}
					image="true" 
					>
					<OutpostHeader type="transparent" inverted={true} />
					<View style={{justifyContent: 'center', flex: 1, paddingHorizontal: METRICS.space}}>
						<Bounds>
							<HeaderContent />
						</Bounds>
					</View>
				</Stripe>
				<Stripe style={{backgroundColor: swatches.backgroundShade}}>
					<Bounds>

							<Section style={{paddingTop: METRICS.space / 2, paddingBottom: METRICS.space / 4}}>
								<View style={{position: 'relative'}}>
									<TextInput
										id="searchString"
										placeholder="Search"
										autoComplete="off"
										style={{borderRadius: 4000, paddingLeft: 48}}
										keyboardType="web-search"
										/>
										<View style={{position: 'absolute', top: 0, left: 16, height: '100%', justifyContent: 'center'}}> 
											<Icon shape="Search"  />
										</View>
										<View style={{position: 'absolute', top: 0, right: 10, height: '100%', justifyContent: 'center'}}>
											<View style={{backgroundColor: 'white', borderRadius: 4000, paddingHorizontal: 12, paddingVertical: 4}}>
												<Text color="secondary">New York, NY</Text>
											</View>
										</View> 

								</View>
							</Section>

							<OutpostRow 
								outposts={outposts.subreddit}
								headline="Subreddits are getting&nbsp;together"
								site="reddit.com"
								/>

							<OutpostRow 
								outposts={outposts.twitter}
								headline="Twitter followers are getting&nbsp;together"
								site="twitter.com"
								/>
	
					</Bounds>
				</Stripe>
				<Stripe>
					<Bounds>
						<Section>
							<Chunk>
								<Text type="sectionHead">
									How it works
								</Text>
							</Chunk>
							<Chunk>

							</Chunk>
						</Section>
					</Bounds>
				</Stripe>				
			</Page>
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

const thisCardStyle = {
	borderWidth: 0,
	shadowRadius: 16,
	shadowColor: 'rgba(0,0,0,.15)',
	marginVertical: 0
}