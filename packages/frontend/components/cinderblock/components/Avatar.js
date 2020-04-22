import React from 'react';
import { View, Image } from '../primitives';
import PropTypes from 'prop-types';
import styles from '../styles/styles';

const Avatar = (props) => {
	const {
		size,
		source,
		style
	} = props;

	return(
		<Image
			source={source}
			style={[styles['avatar'], styles[`avatar--${size}`], style]}
			/>
	);
}

Avatar.defaultProps = {
	size: 'medium',
};

Avatar.propTypes = {
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	source: PropTypes.object
}

export default Avatar;