import React, { useEffect, useState } from 'react';


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

// convert feathers errors to a more usable format
const convertFeathersErrors = (originalError) => {
	let error = {...originalError};
   if(error.errors && error.errors.length){
      error.fieldErrors = Object.assign({}, ...error.errors.map(err => ({[err.path]: err.message})));
   }
   return error;
}


const useFormState = ( opts = {} ) => {

	const {
		initialFields = {},
		onChange = () => {},
		toastableErrors = {},
		addToast = (message) => {console.error(message) }
	} = opts;
	
	const [fields, setFields] = useState(initialFields);
	useEffect( ()=>{ handleChange() }, [fields]);

	const [loading, setLoading] = useState(false);
	const [error, setErrorDirect] = useState({timestamp: Date.now()});
	const setError = (error = {}) => setErrorDirect(convertFeathersErrors(error));

	// watch for toastable errors 
	useEffect(()=>{
		const message = error?.message || toastableErrors[error?.name] || false;
		if(message){
			addToast(message);
		}
	}, [error]);

	const setFieldValue = (key, value) => {
		const newFields = {...fields, [key]: value};
		setFields(newFields);
	}

	const getFieldValue = (key) => {
		return fields[key] || '';
	}

	const setFieldValues = (updatedFields={}) => {
		const newFields = {...fields, ...updatedFields};
		setFields(newFields);
	}

	const resetFields = () => {
		setFields(initialFields);
	}

	const handleChange = debounce(() => {
		// PURPOSE: when elements outside the form need to know what's happening in the form as fields are being edited, before submit
		onChange(fields, this);
	}, 100);

	return {
		resetFields,
		setFieldValue,
		getFieldValue,
		setFieldValues,
		setLoading,
		loading,
		setError,
		error,
		fields
	}
}

export default useFormState;