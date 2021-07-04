import React, { Fragment, useState, useEffect, useRef, useContext } from 'react';

// Add toastable errors
import { addToast } from 'actions';
export const addToastableErrors = (dispatch, error, messages) => {
  if(error && messages[error.name]){
    dispatch(addToast(messages[error.name]));
  }
}

// usePrevious hook
export const usePrevious = (value) => {
	const ref = useRef();
	useEffect(() => {
		ref.current = value
	}, [value]);
	return ref.current;
}


export const abbreviateNumber = (baseNumber, digits) => {

	const num = Math.abs(baseNumber);
	const sign = (baseNumber < 0) ? -1 : 1;

	const lookup = [
	  { value: 1, symbol: "" },
	  { value: 1e3, symbol: "k" },
	  { value: 1e6, symbol: "M" },
	  { value: 1e9, symbol: "G" },
	  { value: 1e12, symbol: "T" },
	  { value: 1e15, symbol: "P" },
	  { value: 1e18, symbol: "E" }
	];
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	var item = lookup.slice().reverse().find(function(item) {
	  return num >= item.value;
	});
	const abbreviatedNumber =  item ? (sign * (num / item.value).toFixed(digits).replace(rx, "$1")) + item.symbol : baseNumber;
 }