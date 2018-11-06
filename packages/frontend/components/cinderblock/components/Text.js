import React from 'react';
import { Text as ReactText } from '../primitives';
import styles from '../styles/styles';

const VALID_TYPES = {
	micro: 'Micro',
	small: 'Small',
	big: 'Big',
	sectionHead: 'SectionHead',
	pageHead: 'PageHead',
	hero: 'Hero'
}

const VALID_COLORS = {
	primary: 'Primary',
	secondary: 'Secondary',
	hint: 'Hint',
	tint: 'Tint'
}

const VALID_WEIGHTS = {
	strong: 'Strong',
}


const Text = (props) => {
	const {
		children,
		inverted,
		type,
		color = "primary",
		style,
		weight,
		...other
	} = props;


	const invertedModifier = (inverted) ? '--inverted' : '';
	const styleKeys = [
		'text',
		...[type ? `text${VALID_TYPES[type]}` : undefined ],
		...[color ? `text${VALID_COLORS[color]}${invertedModifier}` : undefined ],
		...[weight ? `text${VALID_WEIGHTS[weight]}` : undefined ]
	];

	const combinedStyles = styleKeys.map((key, i)=>{
		return styles[key];
	});

	return(
		<ReactText
			style={[combinedStyles, style]}
			{...other}
			>
			{children}
		</ReactText>
	);
}


export default Text;