const users = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_USERS_SUCCESS':
    	const users = action.payload.data;
    	return users;
    default:
      return state;
  }
}

export default users