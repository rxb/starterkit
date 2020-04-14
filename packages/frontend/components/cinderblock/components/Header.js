import React from 'react';
import { View, Image } from '../primitives';
import styles from '../styles/styles';
import {WithMatchMedia} from './WithMatchMedia';

const Header = (props) => {

	const {
		children,
		style,
		media,
		maxWidth = 'auto',
		position = 'sticky',
		type = 'opaque'
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

	const sectionStyleKeys = [
		'header-section',
		...[ (media && media.medium) ? 'header-section--atMedium' : undefined]
	];
	const sectionCombinedStyles = sectionStyleKeys.map((key, i)=>{
		return styles[key];
	});


	return(
		<View style={[combinedStyles, style, (position == 'sticky') ? {position: 'sticky'} : {position: 'static'}]}>
			<View style={{maxWidth: maxWidth, alignSelf: 'center', width: '100%'}}>
				<View style={sectionCombinedStyles}>
					{children}
				</View>
			</View>
		</View>
	);


}

export default WithMatchMedia(Header);