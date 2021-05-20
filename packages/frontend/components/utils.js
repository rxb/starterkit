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