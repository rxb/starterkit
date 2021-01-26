import {v4 as uuid} from 'uuid';
const apiHost = 'http://localhost:3030/';


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
// MODALS
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