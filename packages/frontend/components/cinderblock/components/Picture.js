import React from 'react';
import { View, Image, Text } from '../primitives';
import PropTypes from 'prop-types';
import styles from '../styles/styles';

const Picture = (props) => {
	
	const {
		size,
		source,
		style
	} = props;

	const finalStyles = [
		styles['picture'], 
		styles[`picture--${size}`],
		style
	];

	return(
		<Image
			source={source}
			style={finalStyles}
			/>
	);
}

Picture.defaultProps = {
	size: 'medium',
};

Picture.propTypes = {
	size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'xlarge', false]),
	source: PropTypes.object
}

export default Picture;