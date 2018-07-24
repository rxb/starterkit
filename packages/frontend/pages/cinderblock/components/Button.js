import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from '../primitives';
import styles from '../styles/styles';
import Icon from './Icon';
import {WithMatchMedia} from './WithMatchMedia';

const Button = (props) => {

		const {
			label,
			shape,
			color = 'primary',
			media,
			width = 'snap',
			...other
		} = props;

		const variantStyle = (width == 'full' || media && !media.medium && width == 'snap') ? styles['button--fullWidth'] : undefined;

		return(
			<View style={[styles.button, styles[`button--${color}`], variantStyle]} {...other}>
				{ shape &&
					<Icon shape={shape} color="white" />
				}
				<Text style={[styles.text, styles.buttonText, styles[`buttonText--${color}`]]}>{label}</Text>
			</View>
		);
}

Button.propTypes = {
	width: PropTypes.oneOf([
		'full',
		'snap'
	])
};

export default WithMatchMedia(Button);