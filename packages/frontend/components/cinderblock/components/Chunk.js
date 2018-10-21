import React from 'react';
import { View } from '../primitives';
import styles from '../styles/styles';

const Chunk = (props) => {
	const {
		children,
		inline,
		style,
		...other
	} = props;

	// optimized way to inline layout without explicit <Inline> component
	const inlineStyle = (inline) ? styles.inline : {};

	return(
		<View style={[styles.chunk, inlineStyle, style]}>
			{children}
		</View>
	);
}


export default Chunk;