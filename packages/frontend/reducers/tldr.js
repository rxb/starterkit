import{
  findByOptimisticId,
  parseFeathersError
} from './utils.js'

const startState = {
  data: {},
  error: {},
  loading: false
};

/*

TODO:
research: should single-item entities have their own reducer or should they be part of the list reducer? on the backend, they're all part of the same service.

*/

const tldr = (state = startState, action) => {
	let newState;
	switch (action.type) {
		// FETCH
		case 'FETCH_TLDR':
			console.log(action);
			newState = {...startState, loading: true}
			return newState;
		case 'FETCH_TLDR_SUCCESS':
			newState = {...state, data: action.payload}
			console.log('FETCH_TLDR_SUCCESS')
			console.log(newState);
			return newState;

		// CREATE
		case 'CREATE_TLDR':
			newState = {...startState, loading: true}
			return newState;
		case 'CREATE_TLDR_SUCCESS':
			newState = {...state, loading: false, data: action.payload};
			return newState;
		case 'CREATE_TLDR_FAILURE':
			newState = {...state, loading: false, error: parseFeathersError(action.payload.response)}
			return newState;

		// PATCH
		case 'PATCH_TLDR':
			newState = {...state, loading: true}
			return newState;
		case 'PATCH_TLDR_SUCCESS':
			newState = {...state, loading: false, data: action.payload};
			return newState;
		case 'PATCH_TLDR_FAILURE':
			newState = {...state, loading: false, error: parseFeathersError(action.payload.response)}
			return newState;

		// VALIDATE
		case 'UPDATE_ERROR_TLDR':
			newState = {...state, error: action.payload};
			return newState;

		// ???
		default:
			return state
	}
}

export default tldr