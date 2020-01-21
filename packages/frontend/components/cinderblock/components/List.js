import React from 'react';
import PropTypes from 'prop-types';
import { View } from '../primitives';
import { WithMatchMedia } from './WithMatchMedia';
import styles from '../styles/styles';
import {findWidestActiveValue} from '../componentUtils';

// combine styles
const combineStyles = (styleKeys) => styleKeys.map((key, i)=>{
	return styles[key];
});


const List = (props) => {

	const {
		children,
		scrollItemWidth,
		itemsInRow,
		variant = 'linear',
		items = [],
		renderItem = item => item,
		media,
		style,
		...other
	} = props;

	const currentVariant = findWidestActiveValue(variant, media);
	const currentItemsInRow = findWidestActiveValue(itemsInRow, media);
	const currentRenderItem = findWidestActiveValue(renderItem, media);


	// list styles
	const baseClass = `list--${currentVariant}`;
	const combinedStyles = combineStyles([
		baseClass
	]);

	// list-item styles
	const itemBaseClass = `list-item--${currentVariant}`;
	const combinedItemStyles = combineStyles([
		itemBaseClass,
		...[ (currentVariant == 'grid') ? `${itemBaseClass}--${currentItemsInRow}` : undefined ]
	]);
	const scrollItemWidthStyle = (currentVariant == 'scroll' && scrollItemWidth) ? {width: scrollItemWidth} : undefined;

	return(
		<View style={styles[`${baseClass}-wrap`]}>
			<View
				accessibilityRole='list'
				style={[ ...combinedStyles, style ]}
				>
				{ items.map((item, i)=>{
					const firstChildStyle = (i == 0) ? styles[`${itemBaseClass}--firstChild`] : undefined;
					return (
						<View
							key={i}
							accessibilityRole='listitem'
							style={[ ...combinedItemStyles, scrollItemWidthStyle, firstChildStyle ]}
							>
							{ currentRenderItem(item, i) }
						</View>
					);
				})}
				{children}
			</View>
		</View>
	);
}


export default WithMatchMedia(List);