import React, {useMemo} from 'react';
import { View } from '../primitives';
import styles from '../styles/styles';

const getCombinedStyles = (props) => {
	const {
		border
	} = props	
	
	const styleKeys = [
		'section',
		...[ (border) ? 'section--border' : undefined],
	];
	return styleKeys.map((key, i)=>{
		return styles[key];
	});
}

const Section = (props) => {

	const {
		children,
		type,
		style,
		border,
		...other
	} = props

	const combinedStyles = useMemo( ()=>getCombinedStyles(props), [border]);
	const finalStyles = [ combinedStyles, style ];

	return(
		<View style={finalStyles}>
			{children}
		</View>
	);
}


export default Section;