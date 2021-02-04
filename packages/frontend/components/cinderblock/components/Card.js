import React, {useMemo} from 'react';
import { View } from '../primitives';
import styles from '../styles/styles';

const getCombinedStyles = (props) => {
	const { shadow } = props	
	
	const styleKeys = [
		'card',
		'pseudoLineHeight',
		...[ (shadow) ? 'card--shadow' : undefined],
	];
	return styleKeys.map((key, i)=>{
		return styles[key];
	});
}


const Card = (props) => {
	const {
		children,
		style,
		shadow,
		...other
	} = props;

	const combinedStyles = useMemo(() => getCombinedStyles(props), [shadow])
	const finalStyles = [combinedStyles, style];

	return(
		<View style={finalStyles}>
			{children}
		</View>
	);
}


export default Card;