import { StyleSheet } from '../primitives';

import {
	METRICS,
	FLEX_ALIGN_VALUES,
	FLEX_JUSTIFY_VALUES
} from '../designConstants';

const {
	base,
	space,
	spaceSection
} = METRICS;

const flexGrowFactors = [1, 2, 3, 4, 5, 6, 7];


const upFirst = word =>
  word[0].toUpperCase() + word.toLowerCase().slice(1)

const camelize = text => {
  let words = text.split(/[-_]/g) // ok one simple regexp.
  return words[0].toLowerCase() + words.slice(1).map(upFirst)
}

const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



const styles = StyleSheet.create({


'flex' : {
	alignItems: 'stretch',
	flexDirection: 'row',
},

'flex-item' : {
	width: 'auto',
	flex: 1,
	flexBasis: 0
},

'flex-item--firstChild': {
	paddingLeft: 0
},


'flex--row' : {
	flexDirection: 'row',
},

'flex--row__flex-item': {
	paddingLeft: base,
	minHeight: '-webkit-min-content'
},


'flex--column': {
	flexDirection: 'column',
	height: '100%'
},

'flex--column__flex-item': {
	paddingLeft: 0,
	minHeight: '-webkit-min-content'
},



/*

FLEX GROW FACTORS

*/

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

/*

FLEX VARIANTS

*/


'flex--noGutters__flex-item': {
	paddingLeft: 0,
},

'flex--wrap': {
	flexWrap: 'wrap'
},

'flex--columnReverse': {
	flexDirection: 'column-reverse'
},

'flex--rowReverse': {
	flexDirection: 'row-reverse'
},


/*

FLEX JUSTIFY
ex:
flex--flexEnd = flexJustify: 'flex-end'

*/
...(()=>{
	const justifyObj = {};
	FLEX_JUSTIFY_VALUES.forEach( (fj) => {
		justifyObj[`flex--${camelize(fj)}`] = { justifyContent: fj };
	});
	return justifyObj;
})(),



/*

FLEX ALIGNMENTS
ex:
flex--alignTop = flexAlign: 'top'

*/
...(()=>{
	const alignObj = {};
	FLEX_ALIGN_VALUES.forEach( (fa) => {
		alignObj[`flex--align${capitalize(camelize(fa))}`] = { alignItems: fa };
	});
	return alignObj;
})(),


});

export default styles;