const shows = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_SHOWS_SUCCESS':
    	const shows = action.payload.data;
    	return [...shows, ...shows, ...shows, ...shows];
    default:
      return state
  }
}

export default shows