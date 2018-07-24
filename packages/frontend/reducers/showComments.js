const showComments = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_SHOW_COMMENTS':
      return [];
    case 'FETCH_SHOW_COMMENTS_SUCCESS':
    	return action.payload.data;
    case 'CREATE_SHOW_COMMENT_SUCCESS':
    	const newComment = action.payload;
    	const newState = [...state, newComment];
    	return newState;
    default:
      return state
  }
}

export default showComments;