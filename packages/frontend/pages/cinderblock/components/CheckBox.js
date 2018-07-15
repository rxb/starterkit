import React from 'react';
import { StyleSheet, Touchable } from '../primitives';
import { CheckBox as CheckBoxRNW } from 'react-native-web';
import Label from './Label';
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
		const props = Object.assign({}, fakeChild.props, {style: [...fakeChild.props.style, this.props.fakeControlStyle]});
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
	render(){
		const {
			label,
			onChange,
			...other
		} = this.props;

		return (
			<Inline>
				<CheckBoxWeb
					style={{
						width: 24,
						height: 24
					}}
					fakeControlStyle={{
						borderColor: (this.state.hasFocus) ? swatches.tint : swatches.border,
						borderWidth: 1
					}}
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
						<Label>{label}</Label>
					</Touchable>
			</Inline>
		);
	}
}

export default CheckBox;