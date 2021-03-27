// DROPDOWN
// this outclick stuff won't work on react native
// there's a lot that is counting on DOM stuff
// but maybe you should be using native components there for menus anyhow

import React, {useState, useRef, useCallback, useEffect} from 'react';
import { View } from '../primitives';
import Touch from './Touch';
import Text from './Text';
import styles from '../styles/styles';
import ReactDOM from 'react-dom';
import {v4 as uuid} from 'uuid';


export const Dropdowner = (props) => {
	const {dropdowns, ...other} = props;
	return(
		<View style={styles.dropdowner}>
			{dropdowns.map((dropdown, i)=>{
				return <Dropdown
							key={dropdown.id}
							content={dropdown.content}
							position={dropdown.position}
							id={dropdown.id}
							{...other}
							/>
			})}
		</View>
	)
}

export const DropdownTouch = (props) => {
	const {
		children,
		addDropdown = () => { console.error('pass in addDropdown fn') }
		//hideDropdown = () => { console.error('pass in hideDropdown fn') }
	} = props;

	const touchRef = useRef(null);
	const {touchActive, setTouchActive} = useState(false);

	const measureAndAddDropdown = useCallback(() => {
		touchRef.current.measure((fx, fy, width, height, px, py) => {
			const x = px;
			const y = py + height;
			console.log(`x${x} y${y} height${height}`);
			addDropdown({x, y});
		});
	})

	return(
		<View ref={touchRef}>
		<Touch
			onPress={(e)=>{
				e.preventDefault();
				measureAndAddDropdown();
			}}
			>
			{children}
		</Touch>
		</View>
	)
}


export const Dropdown = (props) => {
	
	const { 
		hideDropdown,
		removeDropdown,
		position,
		content,
		id
	} = props;

	const onRequestClose = useCallback(()=> {
		if(props.onRequestClose){
			props.onRequestClose()
		}
		hideDropdown(id);
	});
	
	const onCompleteClose = useCallback(()=> {
		if(props.onCompleteClose){
			props.onCompleteClose()
		}
		removeDropdown(id);
	});

	// clicking outside dropdown closes dropdown
	const outerRef = useRef(null);
	const handleClick = useCallback((e) => {
		if(ReactDOM.findDOMNode(outerRef.current).contains(e.target)){
			return false;
		}
		onRequestClose();
	});
	useEffect(()=>{
		document.addEventListener('click', handleClick, false)
		return () => {
			document.removeEventListener('click', handleClick, false);
		};
	}, []);

	return (
		<View 
			style={{
				position: 'absolute',
				left: position.x,
				top: position.y,
				zIndex: 100,
				backgroundColor: 'white'
			}} 
			ref={ outerRef }
			>
			<Text>{JSON.stringify(position)}</Text>
			{content}
		</View>
	)
}