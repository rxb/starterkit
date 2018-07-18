import React from 'react';
import { View, Image } from '../primitives';
import PropTypes from 'prop-types';
import styles from '../styles/styles';

const Avatar = (props) => {
	const {
		size,
		source
	} = props;

	const style = styles[`avatar--${size}`];

	return(
		<Image
			source={source}
			style={style}
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