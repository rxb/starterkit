import React, {useMemo} from 'react';
import { View } from '../primitives';
import PropTypes from 'prop-types';
import styles from '../styles/styles';
import { BREAKPOINTS, FLEX_ALIGN_VALUES, FLEX_JUSTIFY_VALUES} from '../designConstants';
import {useMediaContext} from './UseMediaContext';


export const DIRECTION_ROW = 'row';
export const DIRECTION_COLUMN = 'column';

export const FLEX_CLASS = 'flex';
export const FLEX_ROW_CLASS = `${FLEX_CLASS}--${DIRECTION_ROW}`;
export const FLEX_COLUMN_CLASS = `${FLEX_CLASS}--${DIRECTION_COLUMN}`;
export const FLEX_WRAP_CLASS = `${FLEX_CLASS}--wrap`;
//export const FLEX_NOGUTTER_CLASS = `${FLEX_CLASS}--noGutters`;
export const FLEX_ALIGN_CLASS = `${FLEX_CLASS}--align`;
export const FLEX_FLUSH_CLASS = `${FLEX_CLASS}--flush`;
export const FLEX_NBSP_CLASS = `${FLEX_CLASS}--nbsp`;

const getStyleKeys = (props, media) => {
			
	const {
		direction,
		switchDirection,
		wrap,
		noGutters,
		justify,
		align,
		rowReverse,
		flush,
		nbsp,
		columnReverse
	} = props;

	const isColumn = direction === DIRECTION_COLUMN;
	
	return [
		FLEX_CLASS,

		// horizontal default
		...[!isColumn ? FLEX_ROW_CLASS : undefined],
		...[!isColumn && switchDirection && media[switchDirection] ? FLEX_COLUMN_CLASS : undefined],

		// vertical default
		...[isColumn ? FLEX_COLUMN_CLASS : undefined],
		...[isColumn && switchDirection && media[switchDirection] ? FLEX_ROW_CLASS : undefined],
		
		// reverse breakpoint modifiers
		...[rowReverse && media[rowReverse] ? 'flex--rowReverse' : undefined],
		...[columnReverse && media[columnReverse] ? 'flex--columnReverse' : undefined],

		// other
		...[wrap ? FLEX_WRAP_CLASS : undefined],
		//...[noGutters ? FLEX_NOGUTTER_CLASS : undefined],
		...[flush ? FLEX_FLUSH_CLASS : undefined],
		...[nbsp ? FLEX_NBSP_CLASS : undefined],

		

	]
}

const getCombinedStyles = (styleKeys) => {
	return styleKeys.map((key, i)=>{
		return styles[key];
	});
}

const getCombinedDescendantStyles = (styleKeys) => {
	// assuming that the child of Flex will always be FlexItem or equivalent
	// if that turns out to not be true, this will need to be rethought
	return styleKeys.map((key, i)=>{
		// making up a thing here
		// two dashes "__" is for direct descendants of the first part
		return styles[`${key}__flex-item`];
	});
}

const Flex = (props) => {

		const { children, style } = props;

		const media = useMediaContext();
		const styleKeys = useMemo(()=> getStyleKeys(props, media), [media]);
		

		const combinedStyles = useMemo(()=> getCombinedStyles(styleKeys), [styleKeys])
		const finalStyles = [combinedStyles, style];

		/*
		const combinedDescendantStyles = useMemo(()=> getCombinedDescendantStyles(styleKeys), [styleKeys])

		// TODO: I really dislike this cloning stuff
		const childrenWithProps = React.Children.map(children,
			(child, i) => {
				if(child){
					const additionalProps = {
						descendantStyles: combinedDescendantStyles,
						isFirstChild: (i==0)
					};
					return React.cloneElement(child, additionalProps);
				}
			}
		);
		*/

		return (
			<View style={finalStyles}>
				{children}
			</View>
		);

}

Flex.propTypes = {
	align: PropTypes.oneOf(FLEX_ALIGN_VALUES),
	justify: PropTypes.oneOf(FLEX_JUSTIFY_VALUES),
	wrap: PropTypes.bool,
	noGutters: PropTypes.bool,
	direction: PropTypes.oneOf([
		DIRECTION_ROW,
		DIRECTION_COLUMN,
	]),
	switchDirection: PropTypes.oneOf(BREAKPOINTS),
	rowReverse: PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.oneOf(BREAKPOINTS)
	]),
	columnReverse: PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.oneOf(BREAKPOINTS)
	]),
};

Flex.defaultProps = {
	direction: DIRECTION_ROW,
};

export default Flex;
