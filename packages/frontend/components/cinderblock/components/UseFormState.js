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
		onChange = () => {}
	} = opts;
		
	const [fields, setFields] = useState(initialFields);
	useEffect( ()=>{ handleChange() }, [fields]);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState({});

	const setFieldValue = (key, value ) => {
		setFields({...fields, [key]: value});
	}

	const getFieldValue = (key) => {
		return fields[key] || '';
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
		setLoading,
		loading,
		setError,
		error,
		fields
	}
}

export default useFormState;