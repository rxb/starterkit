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
			name: '/r/reactjs',
			title: 'ReactJS'
		},
		{
			name: '/r/sahm',
			title: 'Stay at Home Parents'
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

	const textShadowStyle = {
      textShadowRadius: 20,
      textShadowColor: 'rgba(0,0,0,.25)'
	}
	return(
		<Section>
			

			
			<Chunk>
				<Text type="hero" 
					inverted 
					style={[
						{textAlign: 'center'},
						textShadowStyle
					]}>Find the others</Text>
			</Chunk>
			<Chunk>
				<Text 
					type="big" 
					inverted 
					style={[
						textShadowStyle,
						{textAlign: 'center'},
						media && media.large ? {fontSize: 24, lineHeight: 34} : {}
					]}
					>Meet up about things you like</Text>
			</Chunk>
		</Section>
	);
});

const SearchForm = (props) => {
	return (
		<Bounds style={{maxWidth: 800}}>
		<View style={{position: 'relative'}}>
			<TextInput
				id="searchString"
				placeholder="Search"
				autoComplete="off"
				style={{borderRadius: 4000, paddingLeft: 48, backgroundColor: 'white'}}
				keyboardType="web-search"
				/>
				<View style={{position: 'absolute', top: 0, left: 16, height: '100%', justifyContent: 'center'}}> 
					<Icon shape="Search"  />
				</View>
				<View style={{position: 'absolute', top: 0, right: 10, height: '100%', justifyContent: 'center'}}>
					<View style={{backgroundColor: swatches.shade, borderRadius: 4000, paddingHorizontal: 12, paddingVertical: 4}}>
						<Text type="small" color="secondary">New York, NY</Text>
					</View>
				</View> 

		</View>
		</Bounds>
	)
}

const OutpostRow = (props) => {

	const {
		outposts = [],
		headline,
		site,
		toggleModal
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
				<Touch onPress={toggleModal}>
					<Text type="sectionHead">{headline}</Text>
				</Touch>
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

	constructor(props){
		super(props);
		this.state = {
			modalVisible: false
		}
		this.toggleModal = this.toggleModal.bind(this);

	}

	toggleModal() {
		this.setState({modalVisible: !this.state.modalVisible})
	}

	render() {

		const {
			user
		} = this.props;

		

		const headerImageSource = `https://source.unsplash.com/Jztmx9yqjBw/1900x800`

		return (
			<Fragment>
			<Page hideHeader>

				<Stripe 
					style={{paddingTop: 0, backgroundColor: '#2E3894'}} 
					imageHeight={{small: 360, medium: 400, large: 400, xlarge: 475}}
					image={headerImageSource} 
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
								<SearchForm />
							</Section>

							<OutpostRow 
								outposts={outposts.subreddit}
								headline="Subreddit members"
								site="reddit.com"
								toggleModal={this.toggleModal}
								/>

							<OutpostRow 
								outposts={outposts.twitter}
								headline="Twitter followers"
								site="twitter.com"
								toggleModal={this.toggleModal}
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

			<Modal
			visible={this.state.modalVisible}
			onRequestClose={this.toggleModal}
			>
			<Stripe>
				<Section>
					<Chunk>
						<Text type="pageHead">Find outposts</Text>
					</Chunk>
					<Chunk>
						<Text>Search for interests, subreddits, or twitter accounts that you follow</Text>
					</Chunk>
					<SearchForm />
					<Button label="Search" width="full" />

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