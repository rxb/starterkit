import React from 'react';
import TextInput from './TextInput';
class TextInputFormik extends React.Component {

	static defaultProps = {
    	value: null
  	}

	constructor(props){
		console.log(`text input constructor ${props.note}`)
		super(props);
		this.state = {
			value: props.value
		}
		this.onChange = this.onChange.bind(this);
	}

	onChange(text){
		this.setState({value: text});
	}

	render(){
		const {
			id,
			onChangeText,
			value,
			...other
		} = this.props;

		return(
			<TextInput
				id={id}
				value={this.state.value}
				onChangeText={this.onChange}
				onBlur={(event)=>{
					const {text} = event.nativeEvent;
					onChangeText(text);
				}}
				{...other}
				/>
		);
	}
}
export default TextInputFormik;