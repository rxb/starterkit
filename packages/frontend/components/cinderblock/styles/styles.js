import { StyleSheet } from '../primitives';
import swatches from './swatches';
import flexStyles from './flex';

import { METRICS, BREAKPOINT_SIZES} from '../designConstants';

const {
	base,
	space,
	borderRadius,
	cardBorderRadius
} = METRICS;


const styles = StyleSheet.create({

	// LAYOUT
	stripe: {
		paddingVertical: space,
		//flex: 1,
	},
	'stripe--atMedium': {
		paddingVertical: space,
		paddingHorizontal: space,
	},
	/*
	'stripe--atLarge': {
		paddingHorizontal: space*1.5,
	},
	*/
	bounds: {
		maxWidth: 1100,
		minWidth: 1,
		marginHorizontal: 'auto',
		width: '100%',
	},
	section: {
		paddingTop: space,
		marginHorizontal: space,
		paddingBottom: 0,
		//borderTopWidth: 1,
		//borderTopColor: swatches.border
	},


	imageSnap: {
		marginHorizontal: 0,
		marginTop: -1 * space,
		resizeMode: 'cover',
		borderRadius: 0,
	},

	
	'imageSnap--atMedium': {
		marginTop: space / 2,
		marginHorizontal: space,
		borderRadius: 6
	},
	

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
		alignItems: 'center',
		minWidth: 0,
		overflow: 'hidden'
	},
	inlineItem: {
		marginLeft: space/3,
		overflow: 'hidden',
		minWidth: 0
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
		paddingLeft: space - space,
		paddingRight: space,
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
		marginHorizontal: -1 * space,
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

	// TOUCH
	'touch': {
		cursor: 'pointer'
	},


	// BUTTON
	button: {
		paddingHorizontal: 13,
		paddingVertical: 13, /* this has something to do with lineheight */
		borderRadius: borderRadius,
		borderRadius: 500,
		userSelect: 'none',
		marginVertical: METRICS.pseudoLineHeight,
		flexDirection: 'row',
		justifyContent: 'center',
		alignSelf: 'flex-start'
	},
	'button--shrink': {},
	'button--iconOnly': {},
	'button--grow': {
		alignSelf: 'stretch',
		flex: 1
	},
	'button--primary': {
		backgroundColor: swatches.tint,
	},
	'button--secondary': {
		backgroundColor: swatches.shade,
	},
	buttonText: {
		textAlign: 'center',
		fontWeight: '600',
		whiteSpace: 'nowrap',
		marginHorizontal: 3
	},
	'buttonText--primary': {
		color: swatches.buttonPrimaryInk,
	},
	'buttonText--secondary': {
		color: swatches.buttonSecondaryInk,
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
		borderRadius: cardBorderRadius,
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
		maxHeight: '90%',
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'white',
		borderTopLeftRadius: cardBorderRadius,
		borderTopRightRadius: cardBorderRadius,
		overflow: 'hidden',
		zIndex: 3,
		minWidth: 'auto',
		maxWidth: 'auto'
	},


	prompt: {
		marginHorizontal: '5%',
		maxWidth: 340,
		minWidth: 300,
		maxHeight: `90%`,
		borderRadius: cardBorderRadius,
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
		letterSpacing: '-.001em',
		//marginVertical: METRICS.pseudoLineHeight
	},
	'textPageHead--atLarge': {
		fontSize: METRICS.pageHeadAtLargeSize,
		lineHeight: METRICS.pageHeadAtLargeLineHeight,
	},
	textHero: {
		fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
		fontSize: METRICS.heroSize,
		lineHeight: METRICS.heroLineHeight,
		fontWeight: '700',
		letterSpacing: '-.001em',
		//marginVertical: METRICS.pseudoLineHeight
	},
	'textHero--atLarge': {
		fontSize: METRICS.heroAtLargeSize,
		lineHeight: METRICS.heroAtLargeLineHeight,
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
		zIndex: 1,
		top: 0,
		left: 0,
		right: 0,	
		backgroundColor: 'white',
		borderBottomColor: swatches.border,
		borderBottomWidth: 1,
	},
	'header--atMedium': {
		paddingHorizontal: space*.75,
	},

	// HEADER SECTION
	'header-section': {
		justifyContent: 'center',
		paddingHorizontal: METRICS.space,
		height: 56
	},
	'header-section--atMedium': {
		paddingHorizontal: METRICS.space,
		height: 64,
	},

	// HEADER TYPES
	// headerTransparent must be placed inside the first stripe
	// paddingTop on first stripe needs to be 0
	// if a pagewrap is used for other pages, might need to hide the standard header
	'headerTransparent': {
		backgroundColor: 'transparent',
		borderBottomWidth: 0,
	},
	'headerTransparent--atMedium': {
		paddingHorizontal: 0,
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