import React from 'react';
import Text from './Text';
import styles from '../styles/styles';


const FieldError = (props) => {
	const {
		style,
		error,
		...other
	} = props;

	if(!error){
		return false;
	}
	else{
		return(
			<Text
				kind="small"
				style={[styles['textError'], style]}
				{...other}
				>
				{error}
			</Text>
		);
	}
}


export default FieldError;