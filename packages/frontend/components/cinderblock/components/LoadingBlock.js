import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from '../primitives';
import styles from '../styles/styles';
import Icon from './Icon';

const LoadingBlock = (props) => {

		const {
			isLoading,
			children,
			style,
			...other
		} = props;


		return(
			<View style={[style, {opacity: (isLoading ? .25 : 1)}]}>
				{children}
			</View>
		);
}

export default LoadingBlock;