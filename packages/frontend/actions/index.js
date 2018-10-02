import { CALL_API } from 'redux-api-middleware';
import querystring from 'querystring';

const apiHost = 'http://localhost:3030/';

// FETCH SHOWS
export const fetchShows = () => ({
	[CALL_API]: {
		types: ["FETCH_SHOWS", "FETCH_SHOWS_SUCCESS", "FETCH_SHOWS_FAILURE"],
		endpoint: `${apiHost}shows`,
		method: 'GET',
 	}
});

export const fetchShow = (id) => ({
	[CALL_API]: {
		types: ["FETCH_SHOW", "FETCH_SHOW_SUCCESS", "FETCH_SHOW_FAILURE"],
		endpoint: `${apiHost}shows/${id}`,
		method: 'GET',
 	}
});


// FETCH USERS
export const fetchUsers = () => ({
	[CALL_API]: {
		types: ["FETCH_USERS", "FETCH_USERS_SUCCESS", "FETCH_USERS_FAILURE"],
		endpoint: `${apiHost}users`,
		method: 'GET',
 	}
});

// FETCH USER
export const fetchUser = (id) => ({
	[CALL_API]: {
		types: ["FETCH_USER", "FETCH_USER_SUCCESS", "FETCH_USER_FAILURE"],
		endpoint: `${apiHost}users/${id}`,
		method: 'GET',
 	}
});


// LOG IN
export const logIn = (data) => ({
	[CALL_API]: {
		endpoint: `${apiHost}authentication/`,
		method: 'POST',
		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
		body: JSON.stringify({ ...data, strategy: 'local' }),
		types: ["LOG_IN", "LOG_IN_SUCCESS", "LOG_IN_FAILURE"]
 	}
});

// LOG OUT
export const logOut = () => ({
	type: 'LOG_OUT'
});


// FETCH SHOW COMMENTS
export const fetchShowComments = (data) => ({
	[CALL_API]: {
		types: ["FETCH_SHOW_COMMENTS", "FETCH_SHOW_COMMENTS_SUCCESS", "FETCH_SHOW_COMMENTS_FAILURE"],
		endpoint: `${apiHost}show-comments/?${querystring.stringify({...data, '$limit': 100})}`,
		method: 'GET',
 	}
});

// CREATE SHOW COMMENT

/*
an example of optimistic posting
while reusing existing client data for associations (user/author)
if you really need the associations, you'd need to fetch a new full version of the comment
or figure out some magical sequelize hook stuff that I haven't been able to crack after 2 days of research
*/

let optimisticId = 0;
export const createShowComment = (data, extra) => {
	optimisticId++;
	return ({
		[CALL_API]: {
			endpoint: `${apiHost}show-comments/`,
			method: 'POST',
			headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
			types: [
				{
		    		type: 'CREATE_SHOW_COMMENT',
					payload: { ...data, user: extra.user, optimisticId: optimisticId, optimistic: true}
			    },
			    {
					type: "CREATE_SHOW_COMMENT_SUCCESS",
					payload: (action, state, res) => {
			        	return res.json().then( json => ({...json, user: extra.user, optimisticId: optimisticId}) );
			        }
			    },
			    {
			    	type: "CREATE_SHOW_COMMENT_FAILURE",
			    	payload: { optimisticId: optimisticId }
			    }
		    ]
	 	}
	});
}

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