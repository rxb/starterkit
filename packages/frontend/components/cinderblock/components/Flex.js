import React from 'react';
import { View } from '../primitives';
import PropTypes from 'prop-types';
import styles from '../styles/styles';
import { BREAKPOINTS, FLEX_ALIGN_VALUES, FLEX_JUSTIFY_VALUES} from '../designConstants';
import {WithMatchMedia} from './WithMatchMedia';


export const DIRECTION_ROW = 'row';
export const DIRECTION_COLUMN = 'column';

export const FLEX_CLASS = 'flex';
export const FLEX_ROW_CLASS = `${FLEX_CLASS}--${DIRECTION_ROW}`;
export const FLEX_COLUMN_CLASS = `${FLEX_CLASS}--${DIRECTION_COLUMN}`;
export const FLEX_WRAP_CLASS = `${FLEX_CLASS}--wrap`;
export const FLEX_NOGUTTER_CLASS = `${FLEX_CLASS}--noGutters`;
export const FLEX_ALIGN_CLASS = `${FLEX_CLASS}--align`;


const Flex = (props) => {
		const {
			direction,
			switchDirection,
			wrap,
			noGutters,
			justify,
			align,
			rowReverse,
			columnReverse,
			children,
			style,
			media,
			...other
		} = props;

		const isColumn = direction === DIRECTION_COLUMN;


		// decide which types of styles are active
		// only make an array of keys for now
		// this will be used to reference correct styles for the <Flex> and also <FlexItem>s
		const styleKeys = [
			FLEX_CLASS,

			// horizontal default
			...[!isColumn ? FLEX_ROW_CLASS : undefined],
			...[!isColumn && switchDirection && media[switchDirection] ? FLEX_COLUMN_CLASS : undefined],

			// vertical default
			...[isColumn ? FLEX_COLUMN_CLASS : undefined],
			...[isColumn && switchDirection && media[switchDirection] ? FLEX_ROW_CLASS : undefined],

			// TODO: this concept doesn't really work with switchDirection, which assumes there are only two flex-directions, but there are actually 4
			
			// reverse breakpoint modifiers
			...[rowReverse && media[rowReverse] ? 'flex--rowReverse' : undefined],
			...[columnReverse && media[columnReverse] ? 'flex--columnReverse' : undefined],

			// other
			...[wrap ? FLEX_WRAP_CLASS : undefined],
			...[noGutters ? FLEX_NOGUTTER_CLASS : undefined],
			...[justify ? `${FLEX_CLASS}--${justify}` : undefined],
			...[align ? `${FLEX_ALIGN_CLASS}${align}` : undefined],
		]

		const combinedStyles = styleKeys.map((key, i)=>{
			return styles[key];
		}).filter(function(item){
			return item !== undefined;
		});


		// assuming that the child of Flex will always be FlexItem or equivalent
		// if that turns out to not be true, this will need to be rethought
		const combinedDescendantStyles = styleKeys.map((key, i)=>{
			// making up a thing here
			// two dashes "__" is for direct descendants of the first part
			return styles[`${key}__flex-item`];
		}).filter(function(item){
			return item !== undefined;
		});

		const childrenWithProps = React.Children.map(children,
			(child, i) => {
				if(child){
					return React.cloneElement(child, {
						descendantStyles: combinedDescendantStyles,
						isFirstChild: (i==0)
					})
				}
			}
		);

		return (
			<View
				style={[combinedStyles, style]}
				media={media}
				{...other}
			>
				{childrenWithProps}
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

export default WithMatchMedia(Flex);
