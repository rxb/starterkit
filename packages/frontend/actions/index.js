import { RSAA } from 'redux-api-middleware';
import {v4 as uuid} from 'uuid';
const apiHost = 'http://localhost:3030/';


// CREATE TLDR
export const createTldr = (data) => ({
	[RSAA]: {
		endpoint: `${apiHost}tldrs/`,
		method: 'POST',
		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
		types: ["CREATE_TLDR","CREATE_TLDR_SUCCESS", "CREATE_TLDR_FAILURE"]
 	}
});

// PATCH TLDR
export const patchTldr = (id, data) => ({
	[RSAA]: {
		endpoint: `${apiHost}tldrs/${id}`,
		method: 'PATCH',
		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
		types: ["PATCH_TLDR","PATCH_TLDR_SUCCESS", "PATCH_TLDR_FAILURE"]
 	}
});

// VALIDATE TLDR FAILURE
export const updateErrorTldr = (error) => ({
    type: 'UPDATE_ERROR_TLDRVERSION',
    payload: error
})

// FETCH TLDRS
export const fetchTldrs = () => ({
	[RSAA]: {
		types: ["FETCH_TLDRS", "FETCH_TLDRS_SUCCESS", "FETCH_TLDRS_FAILURE"],
		endpoint: `${apiHost}tldrs`,
		method: 'GET',
 	}
});

export const fetchTldr = (id) => ({
	[RSAA]: {
		types: ["FETCH_TLDR", "FETCH_TLDR_SUCCESS", "FETCH_TLDR_FAILURE"],
		endpoint: `${apiHost}tldrs/${id}`,
		method: 'GET',
 	}
});


// FETCH EVENTS
export const fetchEvents = (data) => ({
	[RSAA]: {
		types: ["FETCH_EVENTS", "FETCH_EVENTS_SUCCESS", "FETCH_EVENTS_FAILURE"],
		endpoint: `${apiHost}events?${querystring.stringify(data)}`,
		method: 'GET',
 	}
});
export const fetchLocalEvents = (data) => ({
	[RSAA]: {
		types: ["FETCH_LOCAL_EVENTS", "FETCH_LOCAL_EVENTS_SUCCESS", "FETCH_LOCAL_EVENTS_FAILURE"],
		endpoint: `${apiHost}events?${querystring.stringify(data)}`,
		method: 'GET',
 	}
});

export const createEvent = (data) => ({
	[RSAA]: {
		endpoint: `${apiHost}events/`,
		method: 'POST',
		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
		types: ["CREATE_EVENT","CREATE_EVENT_SUCCESS", "CREATE_EVENT_FAILURE"]
 	}
});

// LOG IN WITH FEATHERS CLIENT
// just use plain action creators
export const logInSuccess = (authentication) => ({
	type: 'LOG_IN_SUCCESS',
	payload: authentication
});

export const logOut = () => ({
	type: 'LOG_OUT'
});



/*
// GLOBAL MINOR UI
export const showModal = (id, content) => ({
    type: 'SHOW_MODAL',
    payload: {content: content}
});

export const teardownModal = (id) => ({
    type: 'TEARDOWN_MODAL',
    payload: {content: content}
});

export const removeModal = (id) => ({
    type: 'REMOVE_MODAL',
    payload: {content: content}
});
*/


// TOASTS
export const addToast = (message, options = {}) => ({
	type: 'ADD_TOAST',
	payload: {
		message: message,
		id: uuid(),
		visible: true,
		...options
	}
});

export const hideToast = (id) => ({
	type: 'HIDE_TOAST',
	payload: {
	  id: id,
	}
});

export const removeToast = (id) => ({
	type: 'REMOVE_TOAST',
	payload: {
	  id: id,
	}
});


// PROMPTS
export const addPrompt = (content, options = {}) => ({
	type: 'ADD_PROMPT',
	payload: {
		content: content,
		id: uuid(),
		showable: true,
		...options
	}
});

export const hidePrompt = (id) => ({
	type: 'HIDE_PROMPT',
	payload: {
	  id: id,
	}
});

export const removePrompt = (id) => ({
	type: 'REMOVE_PROMPT',
	payload: {
	  id: id,
	}
});