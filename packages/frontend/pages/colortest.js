import React, { Fragment, useContext } from 'react';
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
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch,
	View,
	withFormState,
	ThemeContext
} from 'cinderblock';


function hexToRgb(c) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);
	return result ? [
	  parseInt(result[1], 16),
	  parseInt(result[2], 16),
	  parseInt(result[3], 16)
	 ] : null;
}

function rgbToHsl(c) {
	var r = c[0]/255, g = c[1]/255, b = c[2]/255;
	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;
 
	if(max == min) {
	  h = s = 0; // achromatic
	} else {
	  var d = max - min;
	  s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	  switch(max){
		 case r: h = (g - b) / d + (g < b ? 6 : 0); break;
		 case g: h = (b - r) / d + 2; break;
		 case b: h = (r - g) / d + 4; break;
	  }
	  h /= 6;
	}
	return new Array(h * 360, s * 100, l * 100);
 }

function sortColors(hexColorsArr) {
	return hexColorsArr.map(function(cHex, i) {
		// Convert to HSL and keep track of original indices
		const cRgb = hexToRgb(cHex);
		const cHsl = rgbToHsl(cRgb);
		return {color: cHsl, index: i};
	}).sort(function(c1, c2) {
		// Sort by hue
		return c1.color[0] - c2.color[0];
	}).map(function(data) {
		// Retrieve original RGB color
		return hexColorsArr[data.index];
	});
}

import Page from '../components/Page';

import { TESTCOLORS6 } from '@/components/tldr/testcolors';
const TESTCOLORS = sortColors(TESTCOLORS6);

class ColorTest extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			hiddenColors: []
		}
		this.toggleColor = this.toggleColor.bind(this);
	}

	toggleColor(color){
		const newColors = [...this.state.hiddenColors];
		const index = newColors.indexOf(color);
		if (index > -1) {
			// already there so remove
			newColors.splice(index, 1);
		}
		else{
			// not there so add
			newColors.push(color);
		}
		this.setState({hiddenColors: newColors});
	}


	render() {

		return (
			<ThemeContext.Consumer>
				{ ({ styles, SWATCHES }) => (
					<Page>
						<Stripe>
							<Bounds>

								<Section>
									<Chunk>
										<Text type="pageHead">Color Test</Text>
									</Chunk>

									<List
										variant={{
											small: 'grid',
										}}
										itemsInRow={{
											small: 2,
											medium: 3,
											large: 5
										}}
										items={TESTCOLORS}
										renderItem={(item, i) => {
											return (
												<Chunk>
													<Touch onPress={()=>{
														this.toggleColor(item)
													}}>
													<View
														style={{
															backgroundColor: item,
															height: 100,
															opacity: (this.state.hiddenColors.indexOf(item) > -1) ? 0.05 : 1
														}}
													/>
													<Text>{item}</Text>
													</Touch>
												</Chunk>
											);
										}}
									/>
								</Section>
							</Bounds>
						</Stripe>
						<Stripe>
							<Bounds>
								<Section>
									<Chunk>
										<Text>{JSON.stringify(TESTCOLORS.filter( ( el ) => !this.state.hiddenColors.includes( el ) ))}</Text>
									</Chunk>
								</Section>
							</Bounds>
						</Stripe>
					</Page>
				)}
			</ThemeContext.Consumer>
		);


	}
}


const mapStateToProps = (state, ownProps) => {
	return ({
		//user: state.user,
	});
}

const actionCreators = {};

export default connect(
	mapStateToProps,
	actionCreators
)(ColorTest);