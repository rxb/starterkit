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
import swatches from '@/components/cinderblock/styles/swatches';
import { METRICS } from '@/components/cinderblock/designConstants';
import {v4 as uuid} from 'uuid';

export const Dropdowner = (props) => {
	const {dropdowns, ...other} = props;
	return(
		<View style={styles.dropdowner}>
			{dropdowns.map((dropdown, i)=>{
				return <Dropdown
							key={dropdown.id}
							content={dropdown.content}
							x={dropdown.x}
							y={dropdown.y}
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
		dropdown,
		addDropdown,
		hideDropdown,
		dropdowns,
		style
	} = props;

	const touchRef = useRef(null);
	const [touchActive, setTouchActive] = useState(false);
	const [dropdownId, setDropdownId] = useState();

	useEffect(()=>{
		// active is set by whether the dropdown exists in redux
		setTouchActive( dropdowns.find( element => element.id == dropdownId ) );
	}, [dropdowns]);

	const measureAndAddDropdown = useCallback(() => {
		touchRef.current.measure((fx, fy, width, height, px, py) => {
			const x = px;
			const y = py + height + window.pageYOffset;
			const id = uuid();
			setDropdownId(id);
			addDropdown(dropdown, {x, y, id: id});
		});
	})

	return(
		<View ref={touchRef} style={style}>
		<Touch
			onPress={(e)=>{
				e.preventDefault();
				if(!touchActive){
					// the outclick handles closing
					measureAndAddDropdown();
				}
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
		x, y,
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
		onCompleteClose();
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
				left: x,
				top: y,
				zIndex: 100,
				backgroundColor: 'white',
				borderWidth: 1,
				borderColor: swatches.border,
				borderRadius: METRICS.borderRadius
			}} 
			ref={ outerRef }
			>
			{content}
		</View>
	)
}