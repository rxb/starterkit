const authentication = (state = {}, action) => {
  switch (action.type) {
    case 'LOG_IN_SUCCESS':
    	const token = action.payload.accessToken;
    	return { token };
    case 'LOG_OUT':
    	return {};
    default:
      return state
  }
}

export default authentication