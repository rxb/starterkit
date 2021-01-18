import React, { useEffect, useState } from 'react';

/*
Fields.js
Ultra-lightweight form helper for React
*/

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

function useFormState ( opts = {} ) {

	const {
		initialFields = {},
		onSubmit = (fields) => { 
			console.log(`useFormState: implement onSubmit\n${JSON.stringify(fields)}`) 
		},
		onChange = () => {}
	} = opts;
		
	const [fields, setFields] = useState(initialFields);
	useEffect( ()=>{ handleChange() }, [fields]);

	const setFieldValue = (key, value, callback ) => {
		if(callback) 
			console.error("setFieldValue doesn't support callbacks anymore");
		setFields({...fields, [key]: value});
	}

	const getFieldValue = (key) => {
		return fields[key] || '';
	}

	const resetFields = () => {
		setFields(initialFields);
	}

	const handleChange = debounce(() => {
		// PURPOSE
		// when elements outside the form need to know what's happening in the form
		// as fields are being edited, before submit
		onChange(fields, this);
	}, 100);

	const handleSubmit = () => {
		onSubmit(fields, this);
	}

	return {
		handleSubmit,
		resetFields,
		setFieldValue,
		getFieldValue,
		fields
	}
}

export default useFormState;