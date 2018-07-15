import { CALL_API } from 'redux-api-middleware';
const apiHost = 'http://localhost:3030/';


// FETCH SHOWS
export const fetchShows = () => ({
	[CALL_API]: {
		types: ["FETCH_SHOWS", "FETCH_SHOWS_SUCCESS", "FETCH_SHOWS_FAILURE"],
		endpoint: `${apiHost}shows`,
		method: 'GET',
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