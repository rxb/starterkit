import React, {Fragment} from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from '../primitives';
import styles from '../styles/styles';
import swatches from '../styles/swatches';
import Icon from './Icon';
import {WithMatchMedia} from './WithMatchMedia';
import {findWidestActiveValue} from '../componentUtils';
import Link from './Link';
import Touch from './Touch';
import Router from 'next/router'

const Button = (props) => {

		const {
			children,
			href,
			onPress,
			label,
			shape,
			color = 'primary',
			media,
			isLoading = false,
			width,
			textType = "",
			style,
			...other
		} = props;

		let { variant = {} } = props;


		// TODO: deprecate and remove
		// supporting deprecated width props, for now
		/*
		*/
		if (width == 'snap'){
			variant = {small: 'grow', medium: 'shrink'};
		}
		if (width == 'full'){
			variant = {small: 'grow'}
		}
		const currentVariant = findWidestActiveValue(variant, media);

		// TODO: this is a janky way to set color?
		const inkColor = `button${color.charAt(0).toUpperCase() + color.slice(1)}Ink`;

		// render appropriate touchable component and semantics
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
			// not sure when this would happen, but just in case
			ActionComponent = View
		}

		return(
			<ActionComponent
				style={[styles.button, styles[`button--${color}`], styles[`button--${currentVariant}`], style]}
				{...actionComponentProps}
				{...other}
				>

				<View style={{visibility: (isLoading) ? 'hidden' : 'visible'}}>
					<View style={{flexDirection: 'row', justifyContent: 'center'}}>
						{ shape &&
							<Icon shape={shape} color={swatches[inkColor]} style={{marginLeft: 3, marginRight: 3}} />
						}
						{ label && currentVariant != 'iconOnly' &&
							<Text style={[styles.text, styles[`text${VALID_TEXT_TYPES[textType]}`], styles.buttonText, styles[`buttonText--${color}`]]}>{label}</Text>
						}
					</View>
					{children}
				</View>

				{ isLoading &&
					/* TODO: this "fullscreen center" style should be abstracted */
					<View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
						<ActivityIndicator
							color={'white'}
							/>
					</View>
				}

			</ActionComponent>
		);
}

const VALID_TEXT_TYPES = {
	micro: 'Micro',
	small: 'Small',
	big: 'Big',
	sectionHead: 'SectionHead',
	pageHead: 'PageHead',
	hero: 'Hero'
}

Button.propTypes = {
	width: PropTypes.oneOf([
		'full',
		'snap'
	])
};

export default WithMatchMedia(Button);