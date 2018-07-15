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


		/*

		// sketch can't do SVG yet, so we need a PNG for them
		// to be able to tint this, even on web we need to use svgs not as a standard image
		// would be nice to implement tintcolor from RN

		if(Platform.OS =='sketch')
			return(
				<Image
					source={{uri: `http://localhost:4000/${shape}?color=${color}`}}
					style={{width: 24, height: 24}}
					/>
			);


		if(Platform.OS =='web')
			return(
				<svg className="icon" style={{height: 24, width: 24, stroke: color, fill: 'none'}}>
					<use xlinkHref={`#icon-${shape}`} />
				</svg>
			);

		*/

		const SIZES = {
			small: 16,
			medium: 24,
			large: 36
		}
		const pixelSize = SIZES[size];
		const ThisIcon = Icons[shape];

		return <ThisIcon color={color} size={pixelSize} other />;

}

Icon.defaultProps = {
	size: 'medium',
	color: swatches.textSecondary
};

Icon.propTypes = {
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	shape: PropTypes.object,
	color: PropTypes.string
}

export default Icon;