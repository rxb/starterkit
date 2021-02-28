import React, {useMemo} from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { View, Text } from '../primitives';
import styles from '../styles/styles';
import swatches from '../styles/swatches';
import {TEXT_TYPES, TEXT_COLORS, TEXT_WEIGHTS} from '../designConstants';
import Icon from './Icon';
import {useMediaContext} from './UseMediaContext';
import {findWidestActiveValue} from '../utils';
import Link from './Link';
import Touch from './Touch';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1); 

const getCombinedStyles = (props) => {

	const {
		color,
		inverted,
		currentVariant,
		size,
		textType
	} = props;
	const invertedModifier = (inverted) ? 'Inverted' : '';

	// BUTTON 
	const buttonStyleKeys = [
		'button',
		`button--${currentVariant}`,
		`button--${size}`,
		...[color ? `button--${color}${invertedModifier}` : undefined ]
	];
	const button = buttonStyleKeys.map((key, i)=>{
		return styles[key];
	});

	// BUTTON TEXT
	const textStyleKeys = [
		'text',
		...[textType ? `text${TEXT_TYPES[textType]}` : undefined ],
		'buttonText',
		...[color ? `buttonText--${color}${invertedModifier}` : undefined ],
	];
	const text =  textStyleKeys.map((key, i)=>{
		return styles[key];
	});

	return { button, text }
}

const Button = (props) => {

	const {
		// style props
		color,
		size,
		inverted,
		// rest
		href,
		width,
		onPress,
		label,
		shape,
		isLoading,
		style,
		children,
		...other
	} = props
	const media = useMediaContext();

	// inferred props
	let textType, iconSize;
	switch(size){
		case 'small':
			textType = "small";
			iconSize = "small";
			break;
		case 'medium':
			iconSize = "medium";
			textType = "body";
			break;
		case 'large':
			textType = "big";
			iconSize = "large";
			break;
	}

	// width is shorthand for variants
	// this is pretty janky
	// maybe reconsider and do like list
	let variant;
	if(!props.variant){
		switch(width){
			case 'snap':
				variant = {small: 'grow', medium: 'shrink'};
				break;
			case 'full':
				variant = {small: 'grow'};
				break;
			default:
				variant = {small: 'shrink'};
				break;
		}
	}
	else{
		variant = props.variant
	}
	const currentVariant = findWidestActiveValue(variant, media);

	// touchable component and semantics
	let ActionComponent, actionComponentProps;
	if(href){
		ActionComponent = Link;
		actionComponentProps = {
			href: href,
			accessibilityRole: 'link'
		}
	}
	else{
		ActionComponent = Touch;
		actionComponentProps = {
			onPress: onPress,
			accessibilityRole: 'button'
		}
	}

	// styles 
	const combinedStyles = useMemo(()=>getCombinedStyles({...props, currentVariant, textType}), [color, inverted, currentVariant, size, textType ]);
	const buttonFinalStyles = [ combinedStyles.button, style];
	const textFinalStyles = combinedStyles.text;
	const inkColor = swatches[`button${capitalize(color)}${ inverted ? 'Inverted' : ''}Ink`];

	return(
		<ActionComponent
			style={buttonFinalStyles}
			{...actionComponentProps}
			{...other}
			>
			<View style={isLoading ? styles.visibilityHidden : styles.visibilityVisibile}>
				<View style={styles.buttonContent}>
					{ shape &&
						<Icon 
							shape={shape} 
							color={inkColor} 
							style={{marginLeft: 3, marginRight: 3}} 
							size={iconSize}
							/>
					}
					{ label && currentVariant != 'iconOnly' &&
						<Text 
							style={textFinalStyles}
							>{label}</Text>
					}
				</View>
				{children}
			</View>
			
			{ isLoading &&
				<View style={styles.absoluteCenter}>
					<ActivityIndicator
						color={inkColor}
						/>
				</View>
			}

		</ActionComponent>
	);
}

Button.defaultProps = {
	size: 'medium',
	onPress: () => {},
	color: 'primary'
}

export default Button;