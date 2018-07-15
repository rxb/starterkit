// primitives has issues with not being transpiled or something
// and next doesn't like to transpile node_modules
// so until this gets resolved: https://github.com/zeit/next.js/issues/706
// i hope this doesn't become a problem
// figure out how to make this kind of thing work for react native
// maybe with a webpack alias

import {
	Animated,
	Easing,
	Image,
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
	Text,
	Touchable,
	Platform,
	StyleSheet,
	View
};