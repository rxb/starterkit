// FIND BY OPTIMISTIC ID
// get index from array of objects by matching temporary optimisticId
export const findByOptimisticId = (items, optimisticId) => {
  return items.findIndex( item => item.optimisticId === optimisticId )
};


// PARSE FEATHERS ERROR
// convert feathers .errors array to a more-usable object (fieldErrors)
// for indicating errors field-by-field
// example data
// {
//    title: "Sorry, can't make a title about 'garbage'",
//    description: "Sorry, description can't be blank",
// }
export const parseFeathersError = (error) => {
  error.fieldErrors = {};
  if(error.errors && error.errors.length > 0){
	  error.errors.forEach( err => {
	    error.fieldErrors[err.path] = err.message;
	  });
	  error.errorCount = error.errors.length;
  }
  return error;
}

export const convertArrayToObject = (arr, keyField) => Object.assign({}, ...arr.map(item => ({[item[keyField]]: item})));


// Create Reducers
// to generate reducers to handle the typical crud action types
// with optional support for optimistic updating
// and for customizing and adding action types
export const createReducers = (actionKey, doOptimisticUpdate=false, customActionTypes={}) => {

	const startState = {
		items: [],
		error: {},
		loading: false
	};

	const defaultActionTypes = {

		// FETCH
		[`FETCH_${actionKey}`]: (state, action) => {
			let newItem, newState, index;
			return {
				...startState,
				loading: true
			};
		},
		[`FETCH_${actionKey}_SUCCESS`]: (state, action) => {
				return {
					items: action.payload.data,
					error: {},
					loading: false
				}
		},
		[`FETCH_${actionKey}_FAILURE`]: (state, action) => {
			// handle these better
			alert(`${action.payload.message}`);
		},

		// CREATE 
		[`CREATE_${actionKey}`]: (state, action) => {
			return {
				items: [...state.items, action.payload],
				error: {},
				loading: false
			}
		},
		[`CREATE_${actionKey}_SUCCESS`]: (state, action) => {
			newState = {...state};
			newComment = action.payload;
			newState.items[findByOptimisticId(newState.items, action.meta.optimisticId)] = newComment;
			return newState;
		},
		[`CREATE_${actionKey}_FAILURE`]: (state, action) => {
			newState = {...state};
			newState.items.splice(findByOptimisticId(newState.items, action.meta.optimisticId), 1);
			newState.error = parseFeathersError(action.payload.response);
			return newState;
		},

		// DELETE 
		[`DELETE_${actionKey}`]: (state, action) => {
			// should probably do something
			return state;
		},
		[`DELETE_${actionKey}_SUCCESS`]: (state, action) => {
			newState = {...state};
			newState.items.splice(newState.items.findIndex(comment => comment.id == action.payload.id), 1);
			return newState;
		},
		[`DELETE_${actionKey}_FAILURE`]: (state, action) => {
			// handle these better
			alert(`${action.payload.message}`);
		},

		// ERRORS display client-side-generated errors
		[`UPDATE_ERROR_${actionKey}`]: (state, action) => {
			return {...state, error: action.payload};
		}

	};
	const actionTypes = {...defaultActionTypes, ...customActionTypes};
	
	return (state = startState, action) => {
		if( actionTypes[action.type] ){
			return actionTypes[action.type](state, action);
		}
		else{
			// "default"
			return state;
		}
	}

}