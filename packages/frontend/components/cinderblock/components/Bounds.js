import React from 'react';
import { View } from '../primitives';
import styles from '../styles/styles';

const Bounds = (props) => {
	const {
		style,
		children
	} = props;
	const finalStyles = [styles.bounds, style];
	return(
		<View style={finalStyles}>
			{children}
		</View>
	);
}


export default Bounds;