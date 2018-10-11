const startState = {items: [], loading: false};
const shows = (state = startState, action) => {
  switch (action.type) {
  	case 'FETCH_SHOWS':
  		return {items: [], loading: true};
    case 'FETCH_SHOWS_SUCCESS':
    	const shows = action.payload.data;
    	const items = [...shows, ...shows, ...shows, ...shows];
    	return {items: items, loading: false};
    default:
      return state
  }
}

export default shows