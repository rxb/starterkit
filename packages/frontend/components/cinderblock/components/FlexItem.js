import PropTypes from 'prop-types';
import { View } from '../primitives';
import React, {useMemo} from 'react';
import styles from '../styles/styles';

export const FLEX_CLASS = 'flex';
export const FLEX_ALIGN_CLASS = `${FLEX_CLASS}--align-`;
export const FLEX_JUSTIFY_CLASS = `${FLEX_CLASS}--justify-`;
export const FLEX_ITEM_CLASS = 'flex-item';
export const FLEX_ITEM_SHRINK_CLASS = 'flex-item--shrink';
export const FLEX_ITEM_GROW_CLASS = 'flex-item--';
export const FLEX_GROW_FACTORS = [0,1,2,3,4,5,6,7];
export const FLEX_ITEM_FLUSH_CLASS = `${FLEX_ITEM_CLASS}--flush`;
export const FLEX_ITEM_NBSP_CLASS = `${FLEX_ITEM_CLASS}--nbsp`;

const getStyleKeys = (props) => {
	const {
		shrink,
		growFactor,
		isFirstChild,
		justify,
		align,
		flush,
		nbsp,
		...other
	} = props;

	return [
		shrink ? FLEX_ITEM_SHRINK_CLASS : undefined,
		growFactor ? `${FLEX_ITEM_GROW_CLASS}${growFactor}` : undefined,
		isFirstChild ? `${FLEX_ITEM_CLASS}--firstChild` : undefined,
		...[justify ? `${FLEX_JUSTIFY_CLASS}${justify}` : undefined],
		...[align ? `${FLEX_ALIGN_CLASS}${align}` : undefined],
		...[flush ? FLEX_ITEM_FLUSH_CLASS : undefined],
		...[nbsp ? FLEX_ITEM_NBSP_CLASS : undefined],
	];
}

const getItemStyles = (styleKeys) => {
	return styleKeys.map((key, i)=>{
		return styles[key];
	}).filter(function(item){
		return item !== undefined;
	});
}

const FlexItem = (props) => {
		const {
			children,
			shrink,
			growFactor,
			descendantStyles,
			isFirstChild,
			media,
			justify,
			align,
			style,
			flush,
			nbsp,
			...other
		} = props;

		// memoized for perf
		const styleKeys = useMemo(() => getStyleKeys(props), [shrink, growFactor, isFirstChild, justify, align, flush, nbsp]);
		const itemStyles = useMemo(()=> getItemStyles(styleKeys), [styleKeys])
		const finalStyles = [styles[FLEX_ITEM_CLASS], /* ...descendantStyles,*/ itemStyles, style];

		return (
			<View style={finalStyles}>
				{children}
			</View>
		);
}

FlexItem.propTypes = {
	shrink: PropTypes.bool,
	growFactor: PropTypes.oneOf(FLEX_GROW_FACTORS),
};

export default FlexItem;
