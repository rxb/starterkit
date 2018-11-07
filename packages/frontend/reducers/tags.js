const startState = {items: [], loading: false};
const tags = (state = startState, action) => {
  switch (action.type) {
  	case 'FETCH_TAGS':
  		return {items: [], loading: true};
    case 'FETCH_TAGS_SUCCESS':
    	const tags = action.payload.data;
    	const items = [...tags];
    	return {items: items, loading: false};
    default:
      return state
  }
}

export default tags