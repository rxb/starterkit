// DROPDOWN
// this outclick stuff won't work on react native
// there's a lot that is counting on DOM stuff
// but maybe you should be using native components there for menus anyhow

import React, {useState, useRef, useCallback, useEffect} from 'react';
import { View } from '../primitives';
import Touch from './Touch';
import styles from '../styles/styles';
import ReactDOM from 'react-dom';
import {v4 as uuid} from 'uuid';


export const Dropdowner = (props) => {
	const {dropdowns, ...other} = props;
	return(
		<View style={styles.dropdowner}>
			<View 
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: 100,
					height: 100,
					backgroundColor: 'blue'
				}}
				/>
			{dropdowns.map((dropdown, i)=>{
				return <Dropdown
							key={dropdown.id}
							dropdown={dropdown}
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
	const {dropdownId, setDropdownId} = useState();
	const {touchActive, setTouchActive} = useState(false);

	const measureAndAddDropdown = () => {
		touchRef.current.measure((fx, fy, width, height, px, py) => {
			const x = px;
			const y = py + height;
			//const id = uuid();
			setDropdownId(id);
			addDropdown({x, y/*, id*/});
		});
	}

	const toggle = () => {
		if(!touchActive){
			setTouchActive(true);
			measureAndAddDropdown();
		}
		/*
		// already, clicking outside dropdown closes dropdown
		else{
			setTouchActive(false);
			hideDropdown(dropdownId);
		}
		*/
	}

	return(
		<Touch
			ref={touchRef}
			onPress={toggle}
			>
			{children}
		</Touch>
	)
}


export const Dropdown = (props) => {
	
	const { 
		dropdown,
		hideDropdown,
		removeDropdown,
		children 
	} = props;

	const onRequestClose = useCallback(()=> {
		if(props.onRequestClose){
			props.onRequestClose()
		}
		hideDropdown(dropdown.id);
	});
	
	const onCompleteClose = useCallback(()=> {
		if(props.onCompleteClose){
			props.onCompleteClose()
		}
		removeDropdown(dropdown.id);
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

	console.log('dropdown render');

	return (
		<View 
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				zIndex: 100,
				width: 100,
				height: 100,
				backgroundColor: 'red'
			}} 
			ref={ outerRef }
			>
			{children}
		</View>
	)
}