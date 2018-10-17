import React from 'react';
import { View } from '../primitives';
import styles from '../styles/styles';

const Section = (props) => {

	const {
		children,
		isFirstChild,
		noBorder,
		style,
	} = props

	return(
		<View style={[
			styles.section,
			(noBorder ? styles['section--noBorder'] : undefined),
			(isFirstChild ? styles['section--firstChild'] : undefined),
			style
		]}>
			{children}
		</View>
	);
}


export default Section;