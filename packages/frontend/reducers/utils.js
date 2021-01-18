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



export const getItemsAndDefaultSort = (arr, keyField = 'id') => {
	 let items = {};
	 let defaultSort = [];
	 arr.forEach(a => {
		items[a[keyField]] = a;
		defaultSort.push(a[keyField]);
	 })
	 return {items, defaultSort};
};


// deprecated
export const convertArrayToObject = ()=>{};


export const defaultStartState = {
	items: {},
	defaultSort: [],
	error: {},
	loading: false
};

export const createApiReducersObject = (actionKey, {
		doOptimisticUpdate=false, 
		insertIntoDefaultSort=(ids, newId)=>[...ids, newId],
		startState = defaultStartState
	}) => {


	const apiReducersObject = {

		// FETCH FIND
		[`FIND_${actionKey}`]: (state, action) => {
			return {
				...startState,
				loading: true
			};
		},
		[`FIND_${actionKey}_SUCCESS`]: (state, action) => {
			const {items, defaultSort} = getItemsAndDefaultSort(action.payload.data);
			return {
				...state,
				items,
				defaultSort,
				error: {},
				loading: false
			}
		},
		[`FIND_${actionKey}_FAILURE`]: (state, action) => {
			return {
				...state,
				error: parseFeathersError(action.payload.response),
				loading: false
			}
		},

		// FETCH GET
		[`GET_${actionKey}`]: (state, action) => {
			return {
				...state,
				error: {},
				loading: true
			};
		},
		[`GET_${actionKey}_SUCCESS`]: (state, action) => {
			const items = {...state.items, [action.payload.id]: action.payload }
			return {
				...state,
				items,
				error: {},
				loading: false
			}
		},
		[`GET_${actionKey}_FAILURE`]: (state, action) => {
			return {
				...state,
				error: parseFeathersError(action.payload.response),
				loading: false
			}
		},


		// CREATE 
		[`CREATE_${actionKey}`]: (state, action) => {
			if(doOptimisticUpdate){
				// insert optimistic info
				const items = { ...state.items, [action.payload.optimisticId]: action.payload};
				const defaultSort = insertIntoDefaultSort(state.defaultSort, action.payload.optimisticId);
				return {
					...state,
					items,
					defaultSort,
					error: {},
					loading: false

				}
			}
			else{
				return {
					...state,
					error: {},
					loading: true
				};
			}
		},
		[`CREATE_${actionKey}_SUCCESS`]: (state, action) => {
			if(doOptimisticUpdate){
				// commit optimistic info, going to leave optimisticId as key
				const items = { ...state.items, [action.meta.optimisticId]: action.payload};
				return{
					...state,
					items,
					defaultSort,
					error: {},
					loading: false
				}
			}
			else{
				// insert
				const items = { ...state.items, [action.payload.id]: action.payload};
				const defaultSort = insertIntoDefaultSort(state.defaultSort, action.payload.id);
				return {
					...state,
					items,
					defaultSort,
					error: {},
					loading: false
				}
			}
		},
		[`CREATE_${actionKey}_FAILURE`]: (state, action) => {
			if(doOptimisticUpdate){
				// rollback optimistic info, error
				const items = {...state.items};
				delete items[action.meta.optimisticId];
				const defaultSort = state.defaultSort.filter(d=>(d==action.meta.optimisticId));
				return{
					...state,
					items,
					defaultSort,
					error: parseFeathersError(action.payload.response),
					loading: false
				}
			}
			else{
				// error
				return {
					...state,
					error: parseFeathersError(action.payload.response),
					loading: false
				}
			}
		},

		// PATCH
		[`PATCH_${actionKey}`]: (state, action) => {
			if(doOptimisticUpdate){
				// insert optimistic info
				const items = { 
					...state.items, 
					[action.payload.id]: {
						...action.payload,
						__rollback: { ...state.items[action.payload.id] }
					}
				};
				return {
					...state,
					items,
					error: {},
					loading: false

				}
			}
			else{
				return {
					...state,
					error: {},
					loading: true
				};
			}
		},
		[`PATCH_${actionKey}_SUCCESS`]: (state, action) => {
			// interestingly, this works the same for optimistic or standard
			const items = { ...state.items, [action.payload.id]: action.payload};
			return {
				...state,
				items,
				error: {},
				loading: false
			}
		},
		[`PATCH_${actionKey}_FAILURE`]: (state, action) => {
			if(doOptimisticUpdate){
				// rollback optimistic info, error
				const items = {
					...state.items,
					[action.payload.id]: { ...state.items[action.payload.id].__rollback }
				};
				return{
					...state,
					items,
					error: parseFeathersError(action.payload.response),
					loading: false
				}
			}
			else{
				// error
				return {
					...state,
					error: parseFeathersError(action.payload.response),
					loading: false
				}
			}
		},

		// DELETE 
		// Not going to do optimistic delete for now
		[`DELETE_${actionKey}`]: (state, action) => {
			// should probably do something
			return state;
		},
		[`DELETE_${actionKey}_SUCCESS`]: (state, action) => {
			newState = {...state};
			newState.items.splice(newState.items.findIndex(item => item.id == action.payload.id), 1);
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
	return apiReducersObject;	
}


export const createReducersFromObject = (reducersObject) => {
	return (state = defaultStartState, action) => {
		if( reducersObject[action.type] ){
			return reducersObject[action.type](state, action);
		}
		else{
			// "default"
			return state;
		}
	}
}