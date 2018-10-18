import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from '../primitives';
import styles from '../styles/styles';
import Icon from './Icon';
import {WithMatchMedia} from './WithMatchMedia';
import Link from './Link';
import Touch from './Touch';
import Router from 'next/router'

const Button = (props) => {

		const {
			href,
			onPress,
			label,
			shape,
			color = 'primary',
			media,
			width = 'snap',
			...other
		} = props;

		const variantStyle = (width == 'full' || media && !media.medium && width == 'snap') ? styles['button--fullWidth'] : undefined;

		let ActionComponent, actionComponentProps;
		if(href){
			ActionComponent = Link;
			actionComponentProps = {
				href: href,
				accessibilityRole: 'link'
			}
		}
		else if(onPress){
			ActionComponent = Touch;
			actionComponentProps = {
				onPress: onPress,
				accessibilityRole: 'button'
			}
		}
		else{
			// what kind of button is this then?
			ActionComponent = View
		}

		return(
			<ActionComponent
				style={[styles.button, styles[`button--${color}`], variantStyle]}
				{...actionComponentProps}
				{...other}
				>
				{ shape &&
					<Icon shape={shape} color="white" />
				}
				<Text style={[styles.text, styles.buttonText, styles[`buttonText--${color}`]]}>{label}</Text>
			</ActionComponent>
		);
}

Button.propTypes = {
	width: PropTypes.oneOf([
		'full',
		'snap'
	])
};

export default WithMatchMedia(Button);