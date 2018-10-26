/*
In the debate between arrays of objects vs. objects, the answer is: it depends.
Which is more useful for your use case?
If you're always pulling from the API as a dumb client, it seems like array always wins
If you're doing a lot of state maintaining on the client side, then byId starts to look better
https://stackoverflow.com/questions/45130429/must-normalizing-state-shape-for-array-data-involve-round-trip-conversion-betwee
*/

const showComments = (state = [], action) => {
  let newComment, newState, index;
  const findByOptimisticId = (optimisticId) => (
    state.findIndex( comment => comment.optimisticId === optimisticId )
  );
  switch (action.type) {
    case 'FETCH_SHOW_COMMENTS':
      return [];
    case 'FETCH_SHOW_COMMENTS_SUCCESS':
    	return action.payload.data;
    case 'CREATE_SHOW_COMMENT':
      console.log('start');
      newComment = {...action.payload};
      newState = [...state, newComment];
      return newState;
    case 'CREATE_SHOW_COMMENT_SUCCESS':
      console.log('success');
    	newComment = action.payload;
    	newState = [...state];
      newState[findByOptimisticId(action.meta.optimisticId)] = newComment;
      return newState;
    case 'CREATE_SHOW_COMMENT_FAILURE':
      console.log('failure start');
      console.log(action.payload.response);
      console.log('failure stop')
      newState = [...state];
      newState.splice(findByOptimisticId(action.meta.optimisticId), 1);
      return newState;
   case 'DELETE_SHOW_COMMENT':
      return state;
   case 'DELETE_SHOW_COMMENT_SUCCESS':
      newState = [...state];
      newState.splice(newState.findIndex(comment => comment.id == action.payload.id), 1);
      return newState;
    case 'DELETE_SHOW_COMMENT_FAILURE':
      alert(`${action.payload.message}`);
    default:
      return state
  }
}

export default showComments;