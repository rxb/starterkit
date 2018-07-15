import React from 'react';
import { View } from '../primitives';
import styles from '../styles/styles';


const Inline = (props) => {
	const {
		children,
		space
	} = props;


	return(
		<View style={styles.inline}>
			{children}
		</View>
	);
}

export default Inline;