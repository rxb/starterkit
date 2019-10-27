import { RSAA } from 'redux-api-middleware';
import querystring from 'querystring';
import uuid from 'uuid/v1';

const apiHost = 'http://localhost:3030/';

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


// CREATE SHOW
export const createShow = (data) => ({
	[RSAA]: {
		endpoint: `${apiHost}shows/`,
		method: 'POST',
		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
		types: ["CREATE_SHOW","CREATE_SHOW_SUCCESS", "CREATE_SHOW_FAILURE"]
 	}
});

// PATCH SHOW
export const patchShow = (id, data) => ({
	[RSAA]: {
		endpoint: `${apiHost}shows/${id}`,
		method: 'PATCH',
		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
		types: ["PATCH_SHOW","PATCH_SHOW_SUCCESS", "PATCH_SHOW_FAILURE"]
 	}
});

// VALIDATE SHOW FAILURE
export const updateErrorShow = (error) => ({
    type: 'UPDATE_ERROR_SHOW',
    payload: error
})

// FETCH SHOWS
export const fetchShows = () => ({
	[RSAA]: {
		types: ["FETCH_SHOWS", "FETCH_SHOWS_SUCCESS", "FETCH_SHOWS_FAILURE"],
		endpoint: `${apiHost}shows`,
		method: 'GET',
 	}
});

export const fetchShow = (id) => ({
	[RSAA]: {
		types: ["FETCH_SHOW", "FETCH_SHOW_SUCCESS", "FETCH_SHOW_FAILURE"],
		endpoint: `${apiHost}shows/${id}`,
		method: 'GET',
 	}
});


// FETCH TAGS
export const fetchTags = () => ({
	[RSAA]: {
		types: ["FETCH_TAGS", "FETCH_TAGS_SUCCESS", "FETCH_TAGS_FAILURE"],
		endpoint: `${apiHost}tags`,
		method: 'GET',
 	}
});


// FETCH USERS
export const fetchUsers = () => ({
	[RSAA]: {
		types: ["FETCH_USERS", "FETCH_USERS_SUCCESS", "FETCH_USERS_FAILURE"],
		endpoint: `${apiHost}users`,
		method: 'GET',
 	}
});

// FETCH USER
export const fetchUser = (id) => ({
	[RSAA]: {
		types: ["FETCH_USER", "FETCH_USER_SUCCESS", "FETCH_USER_FAILURE"],
		endpoint: `${apiHost}users/${id}`,
		method: 'GET',
 	}
});


// LOG IN
/*
// without client
export const logIn = (data) => ({
	[RSAA]: {
		endpoint: `${apiHost}authentication/`,
		method: 'POST',
		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
		body: JSON.stringify({ ...data, strategy: 'local' }),
		types: ["LOG_IN", "LOG_IN_SUCCESS", "LOG_IN_FAILURE"]
 	}
});
*/

// LOG IN WITH FEATHERS CLIENT
// just use plain action creators
export const logIn = () => ({
	type: 'LOG_IN'
});
export const logInSuccess = (token) => ({
	type: 'LOG_IN_SUCCESS',
	payload: {token: token}
});
export const logInFailure = (error) => ({
	type: 'LOG_IN_FAILURE',
	payload: {response: error}
});

// REAUTHENTICATE
export const reauthenticate = (token) => {
	return ({
		type: 'REAUTHENTICATE',
		payload: {token: token}
	})
};

export const setToken = (token) => {
	return ({
		type: 'REAUTHENTICATE',
		payload: {token: token}
	})
};

export const setUser = (user) => {
	return ({
		type: 'SET_USER',
		payload: user
	})
};

// LOG OUT
export const logOut = () => ({
	type: 'LOG_OUT'
});


// LOG IN AND FETCH USER
// COMBO ACTION
// HOLY SHIT IT WORKS
export function logInAndFetchUser(data) {
	return (dispatch, getState) => {
		return dispatch(logIn(data)).then( () => {
			return dispatch(fetchUser('self'));
		});
	}
}

// FETCH SHOW COMMENTS
export const fetchShowComments = (data) => ({
	[RSAA]: {
		types: ["FETCH_SHOW_COMMENTS", "FETCH_SHOW_COMMENTS_SUCCESS", "FETCH_SHOW_COMMENTS_FAILURE"],
		endpoint: `${apiHost}show-comments/?${querystring.stringify({...data, '$limit': 100})}`,
		method: 'GET',
 	}
});

// CREATE SHOW COMMENT

/*
example of optimistic posting
while reusing existing client data for associations (user/author)
if you need stuff that can't be passed along in extraPayload, you'll need to wait for the real payload to be returned
and to get associations on create, sequlize will make you requery in the after hook (see show-comments hooks)
*/

let optimisticId = 0;
const buildOptimisticActions = (baseType, data, extraPayload, extraMeta) => {
	optimisticId++;
	return [
		{
			type: baseType,
			payload: { ...data, ...extraPayload, optimisticId: optimisticId, optimistic: true},
			meta: { optimisticId: optimisticId, ...extraMeta }
	    },
	    {
			type: `${baseType}_SUCCESS`,
			payload: (action, state, res) => {
	        	return res.json().then( json => ({...json, ...extraPayload}) );
	        },
			meta: { optimisticId: optimisticId, ...extraMeta }
	    },
	    {
			type: `${baseType}_FAILURE`,
			meta: { optimisticId: optimisticId, ...extraMeta }
		}
	];
}

export const updateErrorShowComment = (error) => ({
    type: 'UPDATE_ERROR_SHOW_COMMENT',
    payload: error
})


export const createShowComment = (data, extra) => ({
	[RSAA]: {
		endpoint: `${apiHost}show-comments/`,
		method: 'POST',
		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
		types: buildOptimisticActions('CREATE_SHOW_COMMENT', data, {user: extra.user})
 	}
});


export const deleteShowComment = (commentId) => ({
	[RSAA]: {
		types: ["DELETE_SHOW_COMMENT", "DELETE_SHOW_COMMENT_SUCCESS", "DELETE_SHOW_COMMENT_FAILURE"],
		endpoint: `${apiHost}show-comments/${commentId}`,
		method: 'DELETE',
 	}
});



/*
// just for reference
// here's the long-form api actions
// that redux-api-middleware is streamlining

export function fetchEvents() {
	// returning a function here is a thunk
	return function (dispatch) {
		// First dispatch: the app state is updated to inform
		// that the API call is starting.
		dispatch(requestEvents())
		// returning this is not required (but it's in the example)
		return fetch(`https://api.meetup.com/self/events?desc=true&scroll=next_upcoming&fields=self&page=20&key=${MEETUP_API_KEY}`)
		  .then(
		  	// don't totally get this comma situation but ok
			response => response.json(),
			error => console.log('An error occured.', error)
		  )
		  .then(json =>
		  	// dispatch the action to receive results
			dispatch(receiveEvents(json))
		  )
	}
}
function receiveEvents(json) {
  return {
    type: 'RECEIVE_EVENTS',
    events: json,
    receivedAt: Date.now()
  }
}
function requestEvents() {
  return {
    type: 'REQUEST_EVENTS',
  }
}
*/