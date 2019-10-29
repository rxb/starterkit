import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Head from 'next/head'
import uuid from 'uuid/v1';

import {
	addPrompt
} from '../actions';


import {
	Avatar,
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
	Modal,
	Picker,
	Section,
	Sections,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch,
	View
} from '../components/cinderblock';


import styles from '../components/cinderblock/styles/styles';
import Page from '../components/Page';




class Scratch extends React.Component {

	static async getInitialProps (context) {
		return {};
	}

	constructor(props){
		super(props);
		this.state = {
			isShowing: false
		}
		this.toggle = this.toggle.bind(this);
	}

	toggle(){

		this.setState({isShowing: !this.state.isShowing});
	}

	getAnimatedStyles(anim, atrributes=[]){

		// linear interpolate
		function lerp(minX, maxX, minY, maxY, clampFlag) {
		  var slope = (maxY-minY)/(maxX-minX);
		  return clampFlag ?
		    function(x){ return ((x<minX?minX:x>maxX?maxX:x) - minX) * slope + minY }
		    :
		    function(x){ return (x-minX)*slope + minY }
		}

		// generate "to" styles
		let animatedStyles = {}, value, fnInterpolate;
		for(let key in attributes){
			if(attributes[key]){
				fnInterpolate = lerp(anim.inputRange[0], anim.inputRange[1], anim.outputRange[0], anim.outputRange[1], true);
				value = fnInterpolate(anim.value);
			}
			else{
				value = anim.value
			}
			animatedStyles[key] = value;
		}
		animatedStyles['transition'] = `all ${anim.duration} ${anim.easing}`;

		// ok
		return animatedStyles;
	}


	render() {

		return (
			<Page>
				<Head>
					<meta property='og:title' content='Animation test' />
					<title>Animation test</title>
				</Head>
				<Stripe>
					<Bounds>
						<Sections>
							<Section>
								<Chunk>
									<Text type="pageHead">Animation test</Text>
								</Chunk>
							</Section>
							<Section>
								<Chunk>
									<Button
										label="add thing"
										onPress={()=>{
											this.toggle();
										}}
										/>
								</Chunk>
							</Section>
							<Section>
								<Chunk>
									<View
										style={[
											this.getAnimatedStyles(this.state.anims.visibility, {
												opacity: null,
												marginBottom: {
													inputRange: [0, 1],
										        	outputRange: [-60, 0]
										    	}
											}),
											{width: 100, height: 100, backgroundColor: 'red'}
										]}
										/>
								</Chunk>
							</Section>
						</Sections>
					</Bounds>
				</Stripe>
			</Page>
		);
	}
}


const mapStateToProps = (state, ownProps) => {
	return ({
		user: state.user
	});
}

const actionCreators = {
	addPrompt
};

export default connect(
	mapStateToProps,
	actionCreators
)(Scratch);

