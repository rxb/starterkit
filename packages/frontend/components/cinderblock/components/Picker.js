import React from 'react';
import { View, Picker as PickerWeb } from 'react-native-web';
import Icon from './Icon';
import styles from '../styles/styles';
import swatches from '../styles/swatches';

/*
Have to use inheritance
because of Picker.Item
which would not be accessible
using composition.

Maybe there is a better way to do this.

class Picker extends PickerWeb{
	static defaultProps = {
		className: 'input',
		style: [styles.input, styles.text]
	}

	constructor(props){
		super(props);
	}

	render() {
            const elementsTree = super.render()
            return (
            	<View style={{position: 'relative'}}>
            		{elementsTree}
            		<View style={styles['input-icon']}>
            			<Icon shape="ChevronDown" color={swatches.textHint} />
            		</View>
            	</View>
            );
      }
}*/

class Picker extends React.Component {
	render() {
		const {
			children,
			style,
			...otherProps
		} = this.props;
	
		return (
			<View style={{position: 'relative'}}>
				<PickerWeb 
					style={[{appearance: 'none'}, styles.input, styles.text, style]} 
					{...otherProps} 
					>
					{children}
				</PickerWeb>
				<View style={styles['input-icon']}>
					<Icon shape="ChevronDown" color={swatches.textHint} />
				</View>
			</View>
		)
	}
}

Picker.Item = PickerWeb.Item;

export default Picker;