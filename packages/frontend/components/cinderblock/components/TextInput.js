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
		this.onChange = this.onChange.bind(this);
		this.updateTextInput = this.updateTextInput.bind(this);
	}

	componentDidMount(){
		this.updateTextInput(this.props.value);
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

	updateTextInput(text){
		let dirty = false;
		let newState = {};

		this._node = this.textinput._node;
		const height = this._node.scrollHeight;

		// counter
		if(this.props.showCounter && this.props.maxLength){
			dirty = true;
			newState.count = text.length;
			newState.countColor = 'secondary';
			const diff = this.props.maxLength - newState.count;
			if(diff < 10){
				newState.countColor = 'tint';
			}
		}

		// autoexpand
		if(this.props.multiline && this.props.autoExpand && this.state.height != height){
			dirty = true;
			newState.height = height;
		}

		if(dirty){
			this.setState(newState);
		}
	}

	onChange(event){
		const text = event.target.value;
		debounce(this.updateTextInput, 100)(text);
		this.props.onChange(event);
	}

	render() {
		const {
			autoExpand,
			multiline,
			placeholder,
			maxLength,
			onChange,
			showCounter,
			style,
			wrapperStyle,
			...other
		} = this.props;

		return (
			<View style={wrapperStyle}>
				<TextInputWeb
					ref={ref => this.textinput = ref}
					accessibilityLabel={placeholder}
					placeholder={placeholder}
					placeholderTextColor={swatches.textHint}
					multiline={multiline}
					maxLength={maxLength}
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