const authentication = (state = {}, action) => {
  switch (action.type) {
    case 'LOG_IN_SUCCESS':
    	const token = action.payload.accessToken;
    	return { token };
    default:
      return state
  }
}

export default authentication