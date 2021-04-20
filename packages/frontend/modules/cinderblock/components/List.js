import React from 'react';
import PropTypes from 'prop-types';
import { View } from '../primitives';
import { useMediaContext } from './UseMediaContext';
import styles from '../styles/styles';
import {findWidestActiveValue} from '../utils';

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
		style,
		itemStyle,
		paginated = false,
		...other
	} = props;

	const media = useMediaContext();

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

	// render items
	const renderItems = (items, pageKey=0) => (items.map((item, i)=>{
		const firstChildStyle = (i == 0) ? styles[`${itemBaseClass}--firstChild`] : undefined;
		return (
			<View
				key={`${pageKey}-${i}`}
				accessibilityRole='listitem'
				style={[ ...combinedItemStyles, scrollItemWidthStyle, itemStyle, firstChildStyle ]}
				>
				{ currentRenderItem(item, i) }
			</View>
		);
	}));


	return(
		<View style={styles[`${baseClass}-wrap`]}>
			<View
				accessibilityRole='list'
				style={[ ...combinedStyles, style ]}
				>
				{ paginated && items.map( (page, i) => renderItems(page.items, i) )}
				{ !paginated && renderItems(items) }
				{children}
			</View>
		</View>
	);
}

export default List;