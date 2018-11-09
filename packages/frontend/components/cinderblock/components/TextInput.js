import React, {Fragment} from 'react';
import ReactDOM from 'react-dom'
import { StyleSheet } from '../primitives';
import { View, TextInput as TextInputWeb } from 'react-native-web';
import Text from './Text';
import styles from '../styles/styles';
import swatches from '../styles/swatches';

function debounce(callback, time = 60) {
	var timeout;
	return function() {
		var context = this;
		var args = arguments;
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(function() {
			timeout = null;
			callback.apply(context, args);
		}, time);
	}
}


class TextInput extends React.Component{
	static defaultProps = {
		autoExpand: true,
		onChange: ()=>{},
		onChangeText: ()=>{},
		value: ''
	}

	constructor(props){
		super(props);
		this.state = {
			height: 0,
			count: 0,
			countColor: 'secondary'
		}
		this.countText = this.countText.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onChangeText = this.onChangeText.bind(this);
	}


	shouldComponentUpdate(nextProps, nextState){
		if(this.props.value != nextProps.value){
			return true;
		}
		if(this.state != nextState){
			return true;
		}
		return false;
	}

	componentDidMount(){
		debounce(this.countText, 100)(this.props.value);
	}

	countText(text){
		const count = text.length;
		let countColor = 'secondary';
		const diff = this.props.maxLength - count;
		if(diff < 10){
			countColor = 'tint';
		}
		this.setState({
			count: count,
			countColor: countColor
		});
	}

	onChangeText(text){
		this.props.onChangeText(text);
		debounce(this.countText, 100)(text);
	}

	onChange(event){
		// don't call setState unless you have to
		console.log('onchange');
		const height = event.nativeEvent.srcElement.scrollHeight;
		if(this.props.multiline && this.props.autoExpand && this.state.height != height){
			console.log(height);
			this.setState({height: height});
		}
		this.props.onChange(event);
	}

	render() {
		const {
			multiline,
			placeholder,
			maxLength,
			onChange,
			onChangeText,
			showCounter,
			style,
			wrapperStyle,
			...other
		} = this.props;

		return (
			<View style={wrapperStyle}>
				<TextInputWeb
					accessibilityLabel={placeholder}
					placeholder={placeholder}
					placeholderTextColor={swatches.textHint}
					multiline={multiline}
					maxLength={maxLength}
					onChangeText={this.onChangeText}
					onChange={this.onChange}
					className='input'
					style={[
						styles.input,
						multiline && styles['input--multiline'],
						multiline && maxLength && showCounter && styles['input--multilineAndCounter'],
						styles.text,
						{minHeight: this.state.height},
						style,
					]}
					{...other}
					/>
				{ maxLength && showCounter &&
					<Text
						color={this.state.countColor}
						type="small"
						style={{position: 'absolute', bottom: 8, right: 8}}
						{...other}
						>{this.state.count}/{this.props.maxLength}</Text>
				}
			</View>
		);
	}
}


export default TextInput;