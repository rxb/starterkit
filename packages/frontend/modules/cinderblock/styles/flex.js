import { StyleSheet } from '../primitives';

import { METRICS } from '../designConstants';

const {
	base,
	space,
} = METRICS;

const flexGrowFactors = [1, 2, 3, 4, 5, 6, 7];

const styles = StyleSheet.create({

/*
// Flex


'flex' : {
	alignItems: 'stretch',
	flexDirection: 'row',
},

'flex--row' : {
	flexDirection: 'row',
	marginLeft: -1*base,
},

'flex--column': {
	flexDirection: 'column',
	height: '100%'
},

// FlexItem

'flex-item' : {
	width: 'auto',
	flex: 1,
	flexBasis: 0,
	minWidth: 0,
},


'flex--row__flex-item': {
	paddingLeft: base,
	minHeight: '-webkit-min-content',
},


'flex--column__flex-item': {
	paddingLeft: 0,
	minHeight: '-webkit-min-content',
	minWidth: '-webkit-min-content',
},
*/

// Flex


'flex' : {
	alignItems: 'stretch',
	flexDirection: 'row',
	marginLeft: -1*base,
},

'flex--row' : {
	flexDirection: 'row',
},

'flex--column': {
	flexDirection: 'column',
	height: '100%'
},

// FlexItem

'flex-item' : {
	width: 'auto',
	flex: 1,
	flexBasis: 0,
	minHeight: '-webkit-min-content',
	minWidth: '-webkit-min-content',
	paddingLeft: base,
},


// FLEX GROW FACTORS

...(()=>{
	const growObj = {};
	for(let factor of flexGrowFactors){
		growObj[`flex-item--${factor}`] = { flex: factor };
	}
	return growObj;
})(),

'flex-item--shrink': {
	flex: 0,
	minWidth: '-webkit-min-content'
},


// FLEX VARIANTS
'flex--flush': {
	marginLeft: 0,
},
'flex-item--flush': {
	paddingLeft: 0,
},
'flex--nbsp': {
	marginLeft: -1 * METRICS.pseudoLineHeight * 2,
},
'flex-item--nbsp': {
	paddingLeft: METRICS.pseudoLineHeight * 2,
},

/*
'flex--noGutters': {
	marginLeft: 0,
},
'flex--noGutters__flex-item': {
	paddingLeft: 0,
},
*/

'flex--wrap': {
	flexWrap: 'wrap'
},

'flex--columnReverse': {
	flexDirection: 'column-reverse'
},

'flex--rowReverse': {
	flexDirection: 'row-reverse'
},

// JUSTIFY
'flex--justify-flex-start': {
	justifyContent: 'flex-start'
},
'flex--justify-center': {
	justifyContent: 'center'
},
'flex--justify-flex-end': {
	justifyContent: 'flex-end'
},

// ALIGN
'flex--align-flex-start': {
	alignItems: 'flex-start'
},
'flex--align-center': {
	alignItems: 'center'
},
'flex--align-flex-end': {
	alignItems: 'flex-end'
},



});

export default styles;