import React from 'react';
import { View, Image, Platform } from '../primitives';
import PropTypes from 'prop-types';
import styles from '../styles/styles';
import swatches from '../styles/swatches';
import * as Icons from 'react-feather';

const Icon = (props) => {
		const {
			color,
			size,
			shape,
			...other
		} = props;

		const SIZES = {
			small: 16,
			medium: 24,
			large: 36
		}
		const pixelSize = SIZES[size];

		const ThisIcon = Icons[shape];
		return <ThisIcon color={color} size={pixelSize} {...other} />;

		//return <View />;

}

Icon.defaultProps = {
	size: 'medium',
	color: swatches.textSecondary
};

Icon.propTypes = {
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	shape: PropTypes.string,
	color: PropTypes.string
}

export default Icon;