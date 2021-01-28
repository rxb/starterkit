import React from 'react';
import { View, Image, ImageBackground } from '../primitives';
import styles from '../styles/styles';
import {useMediaContext} from './UseMediaContext';
import { BREAKPOINTS } from '../designConstants';

// find current values for largest breakpoint with a match in media[*]
const findWidestActiveValue = (values, media) => {
	let valuesMap = (typeof values === 'object') ? values : { small: values }
	let activeValue = valuesMap['small'];
	BREAKPOINTS.forEach( BP => {
		if( typeof valuesMap[BP] !== 'undefined' && media[BP] ){
			activeValue = valuesMap[BP];
		}
	});
	return activeValue;
}



const Stripe = (props) => {

	const {
		children,
		image,
		imageHeight = {small: 225, medium: 325, large: 400, xlarge: 450},
		style,
		forwardedRef,
		...other
	} = props

	const media = useMediaContext();

	const imageHeightStyle = (image) ? {height: findWidestActiveValue(imageHeight, media)} : {};

	const styleKeys = [
		'stripe',
		...[ (media && media.medium) ? 'stripe--atMedium' : undefined],
	];
	const combinedStyles = styleKeys.map((key, i)=>{
		return styles[key];
	});


	if(image){
		return(
			<ImageBackground
				ref={forwardedRef}
				source={{uri: image}}
				style={[combinedStyles, {resizeMode: 'cover', flex: 0}, style, imageHeightStyle]}
				{...other}
				>
				{children}
			</ImageBackground>
		);
	}
	else{
		return(
			<View 
				ref={forwardedRef}
				style={[combinedStyles, style]} 
				{...other}
				>
				{children}
			</View>
		);
	}
};

const WrappedComponent = React.forwardRef((props, ref) => {
	return <Stripe {...props} forwardedRef={ref} />;
});

export default WrappedComponent;