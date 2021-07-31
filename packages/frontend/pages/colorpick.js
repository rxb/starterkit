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

function sortColors(hexColorsArr, isSorted){
	if(isSorted){
		return sortColorsBySpectrum(hexColorsArr)
	}
	else{
		return hexColorsArr.sort(() => Math.random() - 0.5)
	}
}

function sortColorsBySpectrum(hexColorsArr) {
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

import Page from '@/components/Page';
import {CategoryItem} from '@/components/tldr/components';

import { TESTCOLORS1, TESTCOLORS8, SHORTLIST1 } from '@/components/tldr/testcolors';
const TESTCOLORS = TESTCOLORS8;
const PICKEDCOLORS = [];

class ColorTest extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			pickedColors: sortColors(PICKEDCOLORS),
			pickedColors_sorted: sortColors(PICKEDCOLORS, 1),
			isSorted: true,
			TESTCOLORS_SORTED: sortColors(TESTCOLORS, 1),
			TESTCOLORS_SHUFFLED: sortColors(TESTCOLORS)
		}
		this.toggleColor = this.toggleColor.bind(this);
		this.reShuffleColors = this.reShuffleColors.bind(this);
	}

	toggleColor(color){
		const newColors = [...this.state.pickedColors];
		const index = newColors.indexOf(color);
		if (index > -1) {
			// already there so remove
			newColors.splice(index, 1);
		}
		else{
			// not there so add
			newColors.push(color);
		}
		this.setState({
			pickedColors: newColors,
			pickedColors_sorted: sortColors(newColors, 1)
		});
	}

	reShuffleColors() {
		this.setState({
			TESTCOLORS_SHUFFLED: sortColors(TESTCOLORS),
			pickedColors: sortColors(this.state.pickedColors)
		})
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
										<Flex>
											<FlexItem>
												<Text type="pageHead">Color Pick</Text>
												<CheckBox 
												label="sorted" 
												value={this.state.isSorted} 
												onChange={()=>{
													this.setState({
														isSorted: !this.state.isSorted
													})
												}}
												/>
											</FlexItem>
											<FlexItem shrink justify="flex-end">
												{!this.state.isSorted && 
												<Button 
													onPress={this.reShuffleColors} 
													color="secondary" 
													label="shuffle" 
													size="small"
													style={{marginVertical: 0}}
													/>
												}
											</FlexItem>
										</Flex>
										
										
									</Chunk>
								</Section>

								<Section border>
								<Chunk>
									<Text type="sectionHead">{this.state.pickedColors.length} Picked colors</Text>
									
								</Chunk>
								<List
										variant={{
											small: 'grid',
										}}
										itemsInRow={{
											medium: 2,
											large: 3,
											xlarge: 5
										}}
										items={this.state.isSorted ? this.state.pickedColors_sorted : this.state.pickedColors}
										renderItem={(item, i) => {
											return (
												<Chunk>
													<Touch onPress={()=>{
														this.toggleColor(item)
													}}>
													<CategoryItem 
														category={{
															name: item
														}}
														color={item}
														/>
													{/* 
													<View
														style={{
															borderRadius: 4,
															backgroundColor: item,
															height: 150,
														}}
													>
														<Sectionless>
															<Chunk>
																<Text type="big" inverted>{item}</Text>
																<Text type="small" color="secondary" inverted>Text description of color</Text>
															</Chunk>
														</Sectionless>
													</View>
													*/}
													
													</Touch>
												</Chunk>
											);
										}}
									/>

								</Section>
								<Section border>
								<Chunk>
									<Text type="sectionHead">{TESTCOLORS.length} Available colors</Text>
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
										items={ this.state.isSorted ? this.state.TESTCOLORS_SORTED : this.state.TESTCOLORS_SHUFFLED }
										renderItem={(item, i) => {
											return (
												<Chunk>
													<Touch onPress={()=>{
														this.toggleColor(item)
													}}>
													<View
														style={{
															borderRadius: 4,
															backgroundColor: item,
															height: 150,
															outline: (this.state.pickedColors.indexOf(item) > -1) ? '5px solid #000' : 'none'
														}}
													>
														<Sectionless>
															<Chunk>
																<Text type="big" inverted>{item}</Text>
																<Text type="small" color="secondary" inverted>Text description of color</Text>
															</Chunk>
														</Sectionless>
													</View>
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
										<Text>{JSON.stringify(this.state.pickedColors)}</Text>
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