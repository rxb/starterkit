import React from 'react';
import { StyleSheet, Touchable } from '../primitives';
import { CheckBox as CheckBoxWeb } from 'react-native-web';
import Label from './Label';
import Text from './Text';
import Inline from './Inline';
import styles from '../styles/styles';
import swatches from '../styles/swatches';

/*

React Native Web checkbox needs to be better
- focus doesn't work
- seems like it can ONLY be a controlled input

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
		// render hijacking is expensive
		// really don't want to rerender on every keydown
		if(this.state.hasFocus != nextState.hasFocus){
			return true;
		}
		if(this.props.value != nextProps.value){
			return true;
		}
		if(this.state.lastManualUpdate != nextState.lastManualUpdate){
			// this one is a bit hacky
			// but it gets the job done
			return true;
		}
		return false;
	}

	render(){
		const {
			id,
			label,
			onChange,
			...other
		} = this.props;

		return (
			<Inline style={[styles.pseudoLineHeight, {alignItems: 'center'}]}>
				<CheckBoxWeb
					ref={ ref => this.checkbox = ref}
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
					<Touchable onPress={()=>{
						this.setState({lastManualUpdate: new Date().getTime() }, this.props.onChange)
					}}>
						<Text accessibilityRole="label">{label}</Text>
					</Touchable>
			</Inline>
		);
	}
}
*/

/*

TODO: 
* file a PR for accessing fake styles, rather than try to render hijack
* figure out temp fix for focus styling

*/

class CheckBox extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			hasFocus: false
		}
	}

	shouldComponentUpdate(nextProps, nextState){
		// render hijacking is expensive
		// really don't want to rerender on every keydown
		if(this.state.hasFocus != nextState.hasFocus){
			return true;
		}
		if(this.props.value != nextProps.value){
			return true;
		}
		if(this.state.lastManualUpdate != nextState.lastManualUpdate){
			// this one is a bit hacky
			// but it gets the job done
			return true;
		}
		return false;
	}

	render(){
		const {
			id,
			label,
			onChange,
			...other
		} = this.props;

		return (
			<Inline style={[styles.pseudoLineHeight, {alignItems: 'center'}]}>
				<CheckBoxWeb
					ref={ ref => this.checkbox = ref}
					style={{
						width: 24,
						height: 24,
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
					<Touchable onPress={()=>{
						this.setState({lastManualUpdate: new Date().getTime() }, this.props.onChange)
					}}>
						<Text accessibilityRole="label">{label}</Text>
					</Touchable>
			</Inline>
		);
	}
}


export default CheckBox;