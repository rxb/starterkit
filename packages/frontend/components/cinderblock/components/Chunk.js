import React from 'react';
import { View } from '../primitives';
import styles from '../styles/styles';

const Chunk = (props) => {
	const {
		children,
		inline,
		style,
		border,
		...other
	} = props;

	// optimized way to inline layout without explicit <Inline> component
	const inlineStyle = (inline) ? styles.inline : {};
	const borderStyle = (border) ? styles["chunk--border"] : {};
	const finalStyles = [styles.chunk, inlineStyle, borderStyle, style];
	
	return(
		<View style={finalStyles}>
			{children}
		</View>
	);
}


export default Chunk;