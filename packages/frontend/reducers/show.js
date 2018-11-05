const startState = {
  item: {},
  error: {},
  loading: false
};

/*

TODO:
research: should single-item entities have their own reducer or should they be part of the list reducer? on the backend, they're all part of the same service.

*/

const show = (state = startState, action) => {
	let newState;
	switch (action.type) {
	case 'FETCH_SHOW':
		newState = {...startState, loading: true}
		return newState;
	case 'FETCH_SHOW_SUCCESS':
		newState = {...state, item: action.payload}
		return newState;
	case 'CREATE_SHOW':
		newState = {...startState, loading: true}
		return newState;
	case 'CREATE_SHOW_SUCCESS':
		newState = {...state, loading: false, item: action.payload};
		return newState;
	case 'CREATE_SHOW_FAILURE':
		newState = {...state, loading: false, error: action.payload.response}
		return newState;
	case 'PATCH_SHOW':
		newState = {...state, loading: true}
		return newState;
	case 'PATCH_SHOW_SUCCESS':
		newState = {...state, loading: false, item: action.payload};
		return newState;
	case 'PATCH_SHOW_FAILURE':
		newState = {...state, loading: false, error: action.payload.response}
		return newState;
	default:
		return state
	}
}

export default show