import React from 'react';
import { View, Image } from '../primitives';
import styles from '../styles/styles';
import {WithMatchMedia} from './WithMatchMedia';
import { METRICS, BREAKPOINTS } from '../designConstants';
import { findWidestActiveValue } from '../componentUtils';


const ImageSnap = (props) => {

	const {
		children,
		image,
		imageHeight = {small: 250, medium: 300, large: 350, xlarge: 450},
		media,
		style,
		isFirstChild
	} = props

	const imageHeightStyle = {height: findWidestActiveValue(imageHeight, media)};
	const styleKeys = [
		'stripe',
		...[ (media && media.medium) ? 'imageSnap--atMedium' : undefined]
	];
	const combinedStyles = styleKeys.map((key, i)=>{
		return styles[key];
	});


	return(
		<Image
			source={{uri: image}}
			style={[ style, styles.imageSnap, imageHeightStyle, combinedStyles ]}
			>
			{children}
		</Image>
	);


}

export default WithMatchMedia(ImageSnap);