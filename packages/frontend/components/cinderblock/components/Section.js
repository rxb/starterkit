import React from 'react';
import { View } from '../primitives';
import styles from '../styles/styles';

const Section = (props) => {

	const {
		children,
		/*
		isFirstChild,
		noBorder,
		*/
		type,
		style,
		...other
	} = props

	//const typeStyle = (type == 'pageHead') ? styles['section--pageHead'] : undefined;

	return(
		<View style={[
			styles.section,
			/*
			typeStyle,
			(noBorder ? styles['section--noBorder'] : undefined),
			(isFirstChild ? styles['section--firstChild'] : undefined),
			*/
			style
		]}>
			{children}
		</View>
	);
}


export default Section;