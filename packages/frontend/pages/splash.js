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

const OutpostRow = (props) => {

	const {
		outposts = [],
		headline,
		who
	} = props;

	return(
		<Section>
			<Chunk>
				<Text type="sectionHead">{headline}</Text>
			</Chunk>
			
			<List
				scrollItemWidth={300}
				items={outposts}
				variant={{
					small: "grid",
				}}
				itemsInRow={{
					small: 2,
					medium: 2,
					large: 4
				}}
				renderItem={(outpost, i) => {
					return(
						<Chunk>
							<Link href="/events">
								<Card>
									<Sectionless style={{/*backgroundColor: swatches.tint*/}}>
											<Chunk>
												<View style={{marginBottom: METRICS.space / 2}}>
													<Text type="big" color="tint">{outpost.name}</Text>
													<Text type="small" color="primary" >2l,293 {who}</Text>
												</View>
												<Text type="small" color="secondary" >Tokyo</Text>
												<Text type="small" color="secondary" >Los Angeles</Text>
												<Text type="small" color="secondary" >Monterrey</Text>
												<Text type="small" color="secondary" ><u>See all cities</u></Text>
											</Chunk>
									</Sectionless>
								</Card>
							</Link>
						</Chunk>
					);
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
			],
			twitter: [
				{
					name: '@tferriss'
				},
				{
					name: '@a16z'
				},
				{
					name: '@ycombinator'
				},
				{
					name: '@davidasinclair'
				},
				{
					name: '@tferriss'
				},
				{
					name: '@a16z'
				},
				{
					name: '@ycombinator'
				},
				{
					name: '@davidasinclair'
				},		
			]
		}

		return (
			<Page hideHeader>
				

				<Stripe 
					style={{paddingTop: 0}} 
					image="https://images.unsplash.com/photo-1502581827181-9cf3c3ee0106?ixlib=rb-1.2.1&auto=format&fit=crop&w=2642&q=80"
					imageHeight={{small: 370, medium: 400, large: 400, xlarge: 475}}
					>
					<OutpostHeader type="transparent" inverted={true} />
					<View style={{justifyContent: 'center', flex: 1, paddingHorizontal: METRICS.space}}>
						<Bounds>
							<Section>
								<Chunk>
									<Text type="hero" inverted style={{textAlign: 'center'}}>Find the others</Text>
								</Chunk>
								<Chunk>
									<Text type="big" inverted style={{textAlign: 'center'}}>People near you are getting together about things you like</Text>
									{/* <HeaderBlurb cycle={false} /> */}
								</Chunk>
							</Section>
						</Bounds>
					</View>
				</Stripe>
				<Stripe style={{backgroundColor: swatches.backgroundShade}}>
					<Bounds>

							<OutpostRow 
								outposts={outposts.subreddit}
								headline="Subreddit stuff"
								who="members"
								/>

							<OutpostRow 
								outposts={outposts.twitter}
								headline="Twitter stuff"
								who="followers"
								/>
	
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