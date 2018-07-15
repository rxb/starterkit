import React from 'react';
import { View } from '../primitives';
import styles from '../styles/styles';

const Sectionless = (props) => {

	const {
		children,
		isFirstChild,
		noBorder,
		style,
	} = props

	return(
		<View style={[
			styles.sectionless,
			style
		]}>
			{children}
		</View>
	);
}


export default Sectionless;