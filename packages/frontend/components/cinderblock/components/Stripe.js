import React from 'react';
import { View, Image } from '../primitives';
import styles from '../styles/styles';
import {WithMatchMedia} from './WithMatchMedia';

const Stripe = (props) => {

	const {
		children,
		image,
		media,
		style,
	} = props


	// media query
	// this could be packaged up
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
				style={[combinedStyles, {resizeMode: 'cover'}, style]}
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