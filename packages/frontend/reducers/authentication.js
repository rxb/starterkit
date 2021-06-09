const startingState = { loading: true };
const authentication = (state = startingState, action) => {
	switch (action.type) {
		case 'LOG_IN_SUCCESS':
			return { 
				...action.payload,
				loading: false 
			};
		case 'LOG_OUT':
			return {
				loading: false
			};
		default:
			return state
	}
}

export default authentication