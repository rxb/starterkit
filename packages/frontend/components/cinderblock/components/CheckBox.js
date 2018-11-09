import React from 'react';
import { StyleSheet, Touchable } from '../primitives';
import { CheckBox as CheckBoxRNW } from 'react-native-web';
import Label from './Label';
import Text from './Text';
import Inline from './Inline';
import styles from '../styles/styles';
import swatches from '../styles/swatches';

/*

React Native Web checkbox needs to be better
- focus doesn't work
- seems like it can ONLY be a controlled input

*/


/*
A bit of render hijacking
To enable CheckBox styling
*/
class CheckBoxWeb extends CheckBoxRNW {
	constructor(props){
		super(props);
	}
	render() {
    	const elementsTree = super.render();
    	const newChildren = [...elementsTree.props.children];
    	const fakeChild = newChildren[0];
		const props = Object.assign({}, fakeChild.props, {style: [...fakeChild.props.style, this.props.fakeControlStyle], className: this.props.fakeControlClassName});
    	newChildren[0] = React.cloneElement(newChildren[0], props);
    	return React.cloneElement(elementsTree, {}, newChildren);
    }
}

class CheckBox extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			hasFocus: false
		}
	}

	shouldComponentUpdate(nextProps, nextState){
		if(this.state.hasFocus != nextState.hasFocus){
			return true;
		}
		if(this.props.value != nextProps.value){
			return true;
		}
		return false;
	}

	render(){
		const {
			label,
			onChange,
			...other
		} = this.props;

		return (
			<Inline style={[styles.pseudoLineHeight, {justifyContent: 'center'}]}>
				<CheckBoxWeb
					style={{
						width: 24,
						height: 24
					}}
					fakeControlStyle={{
						...styles.input,
						borderColor: (this.state.hasFocus) ? swatches.textPrimary : swatches.border,
						borderWidth: 1
					}}
					fakeControlClassName={
						(this.state.hasFocus) ? 'input focus' : 'input'
					}
					onFocus={()=>{
						this.setState({hasFocus: true});
					}}
					onBlur={()=>{
						this.setState({hasFocus: false});
					}}
					onChange={onChange}
					color={swatches.tint}
					{...other}
					/>
					<Touchable onPress={onChange}>
						<Text>{label}</Text>
					</Touchable>
			</Inline>
		);
	}
}

export default CheckBox;