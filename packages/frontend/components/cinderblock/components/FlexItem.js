import PropTypes from 'prop-types';
import { View } from '../primitives';
import React, {useMemo} from 'react';
import styles from '../styles/styles';

export const FLEX_CLASS = 'flex';
export const FLEX_ALIGN_CLASS = `${FLEX_CLASS}--align`;
export const FLEX_ITEM_CLASS = 'flex-item';
export const FLEX_ITEM_SHRINK_CLASS = 'flex-item--shrink';
export const FLEX_ITEM_GROW_CLASS = 'flex-item--';
export const FLEX_GROW_FACTORS = [1,2,3,4,5,6,7];

const FlexItem = (props) => {
		const {
			children,
			className,
			shrink,
			growFactor,
			descendantStyles,
			isFirstChild,
			media,
			justify,
			align,
			style,
			...other
		} = props;

		const styleKeys = [
			shrink ? FLEX_ITEM_SHRINK_CLASS : undefined,
			growFactor ? `${FLEX_ITEM_GROW_CLASS}${growFactor}` : undefined,
			isFirstChild ? `${FLEX_ITEM_CLASS}--firstChild` : undefined,
			...[justify ? `${FLEX_CLASS}--${justify}` : undefined],
			...[align ? `${FLEX_ALIGN_CLASS}${align}` : undefined],
		];

		const getItemStyles = (styleKeys) => {
			return styleKeys.map((key, i)=>{
				return styles[key];
			}).filter(function(item){
				return item !== undefined;
			});
		}

		// memoized for perf
		const itemStyles = useMemo(()=> getItemStyles(styleKeys), [styleKeys])
		const combinedStyles = [styles[FLEX_ITEM_CLASS], ...descendantStyles, itemStyles];

		return (
			<View
				style={[combinedStyles, style]}
				{...other}
				>
				{children}
			</View>
		);
}

FlexItem.propTypes = {
	shrink: PropTypes.bool,
	growFactor: PropTypes.oneOf(FLEX_GROW_FACTORS),
};

export default FlexItem;
