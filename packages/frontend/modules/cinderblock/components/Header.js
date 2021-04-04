import React from 'react';
import { View, Image } from '../primitives';
import styles from '../styles/styles';
import {useMediaContext} from './UseMediaContext';

const VALID_TYPES = {
	transparent: "Transparent"
}

const VALID_POSITIONS = {
	static: "static",			// moves with scroll, takes up space
	absolute: "absolute", 	// moves with scroll, doesn't take up space (almost always transparent)
	sticky: "sticky", 		// does not move with scroll, but initially takes up space
	fixed: "fixed"				// does not move with scroll, doesn't take up space
}

const Header = (props) => {

	const {
		children,
		style,
		maxWidth = 1100,
		position = 'sticky',
		type = 'separated'
	} = props

	const media = useMediaContext();

	// media query
	// this could be packaged up

	const styleKeys = [
		'header',
		...[type ? `header${VALID_TYPES[type]}` : undefined ],
		...[ (media && media.medium) ? 'header--atMedium' : undefined],
		...[ (type && media && media.medium) ? `header${VALID_TYPES[type]}--atMedium` : undefined],
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
		<View style={[ combinedStyles, style, {position: VALID_POSITIONS[position]} ]}>
			<View style={{maxWidth: maxWidth, alignSelf: 'center', width: '100%'}}>
				<View style={sectionCombinedStyles}>
					{children}
				</View>
			</View>
		</View>
	);


}

export default Header;