import React from 'react';
import { View, Image } from '../primitives';
import styles from '../styles/styles';
import {WithMatchMedia} from './WithMatchMedia';
import { BREAKPOINTS } from '../designConstants';

// find current values for largest breakpoint with a match in media[*]
const findWidestActiveValue = (values, media) => {
	let valuesMap = (typeof values === 'object') ? values : { small: values }
	let activeValue = valuesMap['small'];
	BREAKPOINTS.forEach( BP => {
		if( valuesMap[BP] && media[BP] ){
			activeValue = valuesMap[BP];
		}
	});
	return activeValue;
}



const Stripe = (props) => {

	const {
		children,
		image,
		imageHeight = {small: 225, medium: 325, large: 400, xlarge: 450},
		media,
		style,
	} = props

	const imageHeightStyle = (image) ? {height: findWidestActiveValue(imageHeight, media)} : {};

	const styleKeys = [
		'stripe',
		...[ (media && media.medium) ? 'stripe--atMedium' : undefined]
	];
	const combinedStyles = styleKeys.map((key, i)=>{
		return styles[key];
	});


	if(image){
		return(
			<Image
				source={{uri: image}}
				style={[combinedStyles, {resizeMode: 'cover'}, style, imageHeightStyle]}
				>
				{children}
			</Image>
		);
	}
	else{
		return(
			<View style={[combinedStyles, style]}>
				{children}
			</View>
		);
	}

}

export default WithMatchMedia(Stripe);