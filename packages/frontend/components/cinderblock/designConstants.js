/*

get nomenclature
all organized

xsmall
small
medium
xlarge...

const base = 16;
const space = base * .75;
const spaceSection = base * 1.5;

*/

import { Easing } from './primitives';

export const METRICS = {
	base: 16,
	get space() {
		return this.base * 1.25
	},
	get spaceSection() {
		return this.base * 1.25
	},
	get bodySize() {
		return this.base
	},
	get bodyLineHeight() {
		return this.base * 1.5
	},
	get smallSize() {
		return this.base * 0.875
	},
	get smallLineHeight() {
		return this.smallSize * 1.75
	},
	get microSize() {
		return this.base * 0.6
	},
	get microLineHeight() {
		return this.microSize * 2
	},
	get bigSize() {
		return this.base * 1.15
	},
	get bigLineHeight() {
		return this.bigSize * 1.4
	},
	get sectionHeadSize() {
		return this.base * 1.55
	},
	get sectionHeadLineHeight() {
		return this.sectionHeadSize * 1.25
	},
	get pageHeadSize() {
		return this.base * 3
	},
	get pageHeadLineHeight() {
		return this.pageHeadSize * 1.1
	},
	get heroSize() {
		return this.base * 3.6
	},
	get heroLineHeight() {
		return this.pageHeadSize * 1.1
	},
	get pseudoLineHeight(){
		return 6
	},
	borderRadius: 4,
	fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
}

export const FLEX_JUSTIFY_VALUES = [
	"flex-end",
	"center",
	"space-between",
	"space-around"
]

export const FLEX_ALIGN_VALUES = [
	"flex-start",
	"flex-end",
	"center"
];

export const BREAKPOINTS = [
	"small",
	"medium",
	"large",
	"xlarge"
];

export const BREAKPOINT_SIZES = {
	"small": 0,
	"medium": 480,
	"large": 840,
	"xlarge": 1024
}

export const MEDIA_QUERIES = {
	small: `screen`,
	medium: `screen and (min-width: 480px)`,
	large: `screen and (min-width: 840px)`,
	xlarge: `screen and (min-width: 1024px)`,
};

export const MEDIA_SIZES = {
	xs: '16',
	s: '24',
	m: '36',
	l: '48',
	xl: '72',
	xxl: '120',
};

// Apple Easing https://github.com/expo/react-apple-easing/blob/master/AppleEasing.js
const EPSILON = 1e-9;
export const EASE = Easing.bezier(0.25, 0.1, 0.25, 1, EPSILON);