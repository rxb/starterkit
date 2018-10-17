import React from 'react';
import { View, Image } from '../primitives';
import styles from '../styles/styles';
import {WithMatchMedia} from './WithMatchMedia';

const Header = (props) => {

	const {
		children,
		style,
		media,
	} = props


	// media query
	// this could be packaged up
	const styleKeys = [
		'header',
		...[ (media && media.medium) ? 'header--atMedium' : undefined]
	];
	const combinedStyles = styleKeys.map((key, i)=>{
		return styles[key];
	});


	return(
		<View style={[combinedStyles, style]}>
			{children}
		</View>
	);


}

export default WithMatchMedia(Header);