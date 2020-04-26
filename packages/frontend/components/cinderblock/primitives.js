// primitives has issues with not being transpiled or something
// and next doesn't like to transpile node_modules
// so until this gets resolved: https://github.com/zeit/next.js/issues/706
// i hope this doesn't become a problem
// figure out how to make this kind of thing work for react native
// maybe with a webpack alias

// react-native-web touchables require a base scrollview, which is annoying
// until the responder is rewritten, we need to use an alternate touchable


import {
	Animated,
	Easing,
	Image,
	ImageBackground,
	Text,
	TouchableWithoutFeedback as Touchable,
	Platform,
	StyleSheet,
	View
} from 'react-native-web';

export {
	Animated,
	Easing,
	Image,
	ImageBackground,
	Text,
	Touchable,
	Platform,
	StyleSheet,
	View
};