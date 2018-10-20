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

class CharCount extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			count: 0,
			color: this.getColor()
		}
		this.updateCount = this.updateCount.bind(this);
	}
	getColor(count = 0){
		let color = 'secondary';
		const diff = this.props.maxLength - count;
		if(diff < 10){
			color = 'tint';
		}
		return color;
	}
	updateCount(text){
		const count = text.length;
		this.setState({
			count: count,
			color: this.getColor(count)
		});
	}
	render(){
		const {
			...other
		} = this.props;
		return(
			<Text
				color={this.state.color}
				type="small"
				{...other}
				>{this.state.count}/{this.props.maxLength}</Text>
		)
	}
}

class TextInput extends React.Component{
	static defaultProps = {
		onChange: ()=>{},
		onChangeText: ()=>{}
	}

	constructor(props){
		super(props);
		this.state = {
			height: 0
		}
		this.counter = React.createRef();
		this.countText = this.countText.bind(this);
	}

	countText(text){
		if(this.props.maxLength && this.props.showCounter){
			this.counter.current.updateCount(text);
		}
	}

	render() {
		const {
			multiline,
			placeholder,
			maxLength,
			onChange,
			onChangeText,

			autoExpand = true,
			showCounter,
			style,
			...other
		} = this.props;

		return (
			<View>
				<TextInputWeb
					accessibilityLabel={placeholder}
					placeholder={placeholder}
					placeholderTextColor={swatches.textHint}
					multiline={multiline}
					maxLength={maxLength}
					onChangeText={(text)=>{
						this.props.onChangeText(text);
						debounce(this.countText, 100)(text);
					}}
					onChange={(event) => {
						// don't call setState unless you have to
						const height = event.nativeEvent.srcElement.scrollHeight;
						if(multiline && autoExpand && this.state.height != height){
							this.setState({height: height});
						}
						onChange(event);
					}}
					className='input'
					style={[
						styles.input,
						multiline && styles['input--multiline'],
						styles.text,
						{minHeight: this.state.height},
						style
					]}
					{...other}
					/>
				{ maxLength && showCounter &&
					<CharCount ref={this.counter} maxLength={maxLength} style={{/*position: 'absolute', bottom: 8, right: 8*/}} />
				}
			</View>
		);
	}
}


export default TextInput;