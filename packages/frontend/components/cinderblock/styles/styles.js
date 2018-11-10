import { StyleSheet } from '../primitives';
import swatches from './swatches';
import flexStyles from './flex';

import { METRICS } from '../designConstants';

const {
	base,
	space,
	spaceSection,
	borderRadius
} = METRICS;


const styles = StyleSheet.create({

	// LAYOUT
	stripe: {
		paddingVertical: space*.75,
		flex: 1,
	},
	'stripe--atMedium': {
		paddingHorizontal: space*.75,
	},
	bounds: {
		maxWidth: 1000,
		minWidth: 1,
		marginHorizontal: 'auto',
		width: '100%',
	},
	section: {
		paddingTop: spaceSection,
		marginHorizontal: spaceSection,
		paddingBottom: spaceSection - space,
		//borderTopWidth: 1,
		//borderTopColor: swatches.border
	},

	/*
	'section--pageHead': {
		paddingTop: spaceSection + (space * .33),
		paddingBottom: 0
	},
	*/

	/*
	'section--firstChild': {
		borderTopWidth: 0
	},
	*/

	/*
	// removing the border between two sections
	// often because one of the sections already has a very horizontally-dividing object
	// not for the first child, use section--firstChild for that
	'section--noBorder': {
		borderTopWidth: 0,
		paddingTop: 0
	},
	*/

	// for sets of chunks with no possibility of sections
	// basically, inside simple, small cards
	sectionless: {
		paddingTop: space,
		paddingHorizontal: space,
	},

	chunk: {
		paddingBottom: space
	},

	// stacking up some inline
	inline: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center'
	},
	inlineItem: {
		marginLeft: space/3
	},
	'inlineItem--firstChild': {
		marginLeft: 0
	},

	// LISTS

	// default
	'list--linear':{

	},
	'list-item--linear': {
		borderTopWidth: 1,
		borderTopColor: swatches.border,
		paddingTop: space
	},
	'list-item--linear--firstChild': {
		borderTopWidth: 0,
		paddingTop: space / 2
	},

	// grid

	'list--grid':{
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginLeft: -1*space
	},
	'list-item--grid': {
		flexWrap: 'nowrap',
		paddingLeft: space,
		paddingTop: 0
	},
	...(()=>{
		const gridObj = {};
		for(let factor of [1,2,3,4,5,6,7,8]){
			gridObj[`list-item--grid--${factor}`] = { flexBasis: `${100/factor}%` };
		}
		return gridObj;
	})(),


	// inline

	'list--scroll':{
		flexDirection: 'row',
		flexWrap: 'nowrap',
		overflowX: 'scroll',
		WebkitOverflowScrolling: 'touch',
		paddingLeft: spaceSection - space,
		paddingRight: spaceSection,
		paddingBottom: 30,
		marginBottom: -30,
		overflow: 'hidden',
	},
	'list-item--scroll': {
		width: '45%',
		paddingLeft: space
	},
	'list--scroll-wrap': {
		overflow: 'hidden',
		marginHorizontal: -1 * spaceSection,
	},

	// INPUT
	input: {
		backgroundColor: swatches.notwhite,
		borderColor: swatches.border,
		borderWidth: 1,
		paddingHorizontal: 16,
		paddingVertical: 13, /* this has something to do with lineheight */
		borderRadius: borderRadius,
		color: swatches.textPrimary,
		boxSizing: 'border-box',
		fontFamily: METRICS.fontFamily,
		marginVertical: METRICS.pseudoLineHeight,
	},
	'input--focus': {
        outline: 'none',
        borderColor: swatches.textHint,
        backgroundColor: 'transparent',
        boxShadow: `0 0 0 3px ${swatches.focus}`
	},
	'input--multilineAndCounter': {
		paddingBottom: 13 + METRICS.bodySize
	},
	'input-icon': {
		position: 'absolute',
		right: 13,
		top: 0,
		height: '100%',
		justifyContent: 'center',
		pointerEvents: 'none'
	},

	// BUTTON
	button: {
		paddingHorizontal: 16,
		paddingVertical: 13, /* this has something to do with lineheight */
		borderRadius: borderRadius,
		flexDirection: 'row',
		justifyContent: 'center',
		userSelect: 'none',
		marginVertical: METRICS.pseudoLineHeight,
		alignSelf: 'flex-start'
	},
	'button--fullWidth': {
		alignSelf: 'stretch'
	},
	'button--primary': {
		backgroundColor: swatches.tint,
	},
	'button--secondary': {
		backgroundColor: swatches.shade,
	},
	buttonText: {
		textAlign: 'center',
		fontWeight: '600'
	},
	'buttonText--primary': {
		color: '#ffffff',
	},
	'buttonText--secondary': {
		color: swatches.tint,
	},


	// CHIP
	chip: {
		backgroundColor: '#eee',
		paddingVertical: space*0.5,
		paddingHorizontal: space,
		borderRadius: 20,
		flex: 0,
		flexBasis: 0,
		minHeight: '-webkit-min-content',
		width: 'auto',
		minWidth: '-webkit-min-content'
	},
	chipText: {
		textAlign: 'center'
	},

	// CARD
	card: {
		borderRadius: borderRadius,
		//shadowRadius: 12,
		//shadowColor: 'rgba(0,0,0,.25)',
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: swatches.border,
		overflow: 'hidden'
	},

	// TABS
	tabs: {
		flexDirection: 'row',
		alignItems: 'stretch',
		width: '100%',
		borderBottomWidth: 1,
		borderBottomColor: swatches.border,
	},
	tabItem: {
		minHeight: '-webkit-min-content',
		minWidth: '-webkit-min-content',
		paddingHorizontal: space,
		paddingBottom: 6
	},

	'tabItem--variableWidth':{
		flex: 0
	},

	'tabItem--fullWidth': {
		flex: 1,
		textAlign: 'center'
	},

	'tabItem--selected': {
		borderBottomColor: swatches.tint,
		borderBottomWidth: 3,
		marginBottom: -1
	},
	'tabText--selected': {
		color: swatches.tint
	},

	// MODAL
	'modal-container': {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 3,
		alignItems: 'center',
		justifyContent: 'center'
	},

	'modal-backdrop': {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,.75)',
		zIndex: 3
	},

	modal: {
		marginHorizontal: '5%',
		minWidth: 400,
		maxWidth: 600,
		maxHeight: `95%`,
		top: '5%',
		borderRadius: borderRadius,
		backgroundColor: 'white',
		overflow: 'hidden',
		zIndex: 3
	},

	/*
	'modal--full': {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'white',
		zIndex: 3,
		minWidth: 'auto',
		maxWidth: 'auto'
	},
	*/

	// bottom sheet
	'modal--full': {
		position: 'fixed',
		maxHeight: '80%',
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'white',
		zIndex: 3,
		minWidth: 'auto',
		maxWidth: 'auto'
	},


	prompt: {
		marginHorizontal: '5%',
		maxWidth: 340,
		minWidth: 300,
		maxHeight: `90%`,
		borderRadius: borderRadius,
		backgroundColor: 'white',
		overflow: 'hidden',
		zIndex: 3
	},
	'menu-container': {
		width: '100%',
		height: 0,
		backgroundColor: 'red' // shouldn't be able to see this
	},
	menu: {
		position: 'absolute',
		top: METRICS.pseudoLineHeight,
		right: 0,
		backgroundColor: 'white',
		borderRadius: METRICS.borderRadius,
		shadowRadius: 12,
		shadowColor: 'rgba(0,0,0,.25)',
	},




	// AVATAR
	avatar: {
		resizeMode: 'cover',
		backgroundColor: swatches.shade
	},
	'avatar--small':{
		width: 24,
		height: 24,
		borderRadius: 12
	},
	'avatar--medium':{
		width: 36,
		height: 36,
		borderRadius: 18
	},
	'avatar--large':{
		width: 120,
		height: 120,
		borderRadius: 60
	},

	// TEXT
	text: {
		fontSize: METRICS.bodySize,
		lineHeight: METRICS.bodyLineHeight,
		fontFamily: METRICS.fontFamily,
		fontWeight: '400',
		WebkitFontSmoothing: 'antialiased', // retina/non-retina rendering
		letterSpacing: '0.01em'
	},
	textPrimary: {
		color: swatches.textPrimary,
	},
	textSecondary:{
		color: swatches.textSecondary
	},
	textHint:{
		color: swatches.textHint
	},
	'textPrimary--inverted': {
		color: swatches.textPrimaryInverted,
	},
	'textSecondary--inverted':{
		color: swatches.textSecondaryInverted
	},
	'textHint--inverted':{
		color: swatches.textHintInverted
	},
	textTint:{
		color: swatches.tint,
	},
	textMicro: {
		fontSize: METRICS.microSize,
		lineHeight: METRICS.microLineHeight,
	},
	textSmall: {
		fontSize: METRICS.smallSize,
		lineHeight: METRICS.smallLineHeight,
	},
	textStrong: {
		fontWeight: '600',
	},
	textBig: {
		fontSize: METRICS.bigSize,
		lineHeight: METRICS.bigLineHeight,
		fontWeight: '600'
	},
	textSectionHead: {
		fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
		fontSize: METRICS.sectionHeadSize,
		lineHeight: METRICS.sectionHeadLineHeight,
		fontWeight: '600',
		letterSpacing: '.015em'
	},
	textPageHead: {
		fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
		fontSize: METRICS.pageHeadSize,
		lineHeight: METRICS.pageHeadLineHeight,
		fontWeight: '700',
		letterSpacing: '-.001em'
	},
	textHero: {
		fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
		fontSize: METRICS.heroSize,
		lineHeight: METRICS.heroLineHeight,
		fontWeight: '700',
		letterSpacing: '-.001em'
	},
	textLabel: {
		marginTop: 4,
		marginBottom: 0,
		fontWeight: '500',

	},
	textError: {
		color: swatches.error,
	},

	// HEADER
	header: {
		position: 'sticky',
		zIndex: 1,
		top: 0,
		backgroundColor: 'white',
		paddingHorizontal: METRICS.spaceSection,
		paddingVertical: METRICS.space,
		borderBottomColor: swatches.border,
		borderBottomWidth: 1,
		shadowRadius: 3,
		shadowColor: 'rgba(0,0,0,.15)',
	},
	'header--atMedium': {
		paddingHorizontal: METRICS.spaceSection + (METRICS.space * .66),
	},

	// TOASTER
	toaster: {
		position: 'fixed',
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 3,
	},
	'toaster-inner': {
		maxWidth: 600,
		marginHorizontal: 'auto',
		//width: '100%',
		height: 0,
		overflow: 'visible',
		justifyContent: 'flex-end'
	},
	toast: {
		padding: space,
		backgroundColor: swatches.backgroundDark,
		borderRadius: METRICS.borderRadius,
		marginBottom: space,
		marginHorizontal: space,
		width: 'auto',
		flex: 1,
		boxShadow: '0 0 0 1px rgba(255,255,255,.25)',
		shadowRadius: 12,
		shadowColor: 'rgba(0,0,0,.25)',
	},

	// MODIFIERS
	pseudoLineHeight: {
		marginVertical: METRICS.pseudoLineHeight
	},
});

export default {...styles, ...flexStyles};