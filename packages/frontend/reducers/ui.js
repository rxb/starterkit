// assorted global UI state 
const ui = (state = {}, action) => {
	switch (action.type) {
		case 'UPDATE_UI':
			return { ...state, ...action.payload };
		case 'RESET_UI':
			return {};
		default:
			return state
	}
}

export default ui