import React, {Fragment} from 'react';
import { View, Image } from 'react-native-web';
import Icon from './Icon';
import Text from './Text';
import Touch from './Touch';
import styles from '../styles/styles';
import swatches from '../styles/swatches';


class FakeInput extends React.Component {
	static defaultProps = {
		onPress: ()=>{},
		onFocus: ()=>{},
		onBlur: ()=>{},
	}

	constructor(props){
		super(props);
		this.state ={}
	}

	render() {
		const {
			label,
			onPress,
			onFocus,
			onBlur,
			shape,
			style,
			...other
		} = this.props;

		return (
			<Touch
				accessibilityRole="button"
				onPress={onPress}
				onFocus={()=>{
					this.setState({hasFocus: true});
					onFocus();
				}}
				onBlur={()=>{
					this.setState({hasFocus: false});
					onBlur();
				}}
				style={[
					styles.input,
					(this.state.hasFocus) ? styles['input--focus'] : {},
					style,
				]}
				>
				<Text color="hint">{label}</Text>
				{shape &&
					<View style={styles['input-icon']}>
						<Icon shape={shape} color={swatches.textHint} />
					</View>
				}
			</Touch>
		);
	}
}

export default FakeInput;