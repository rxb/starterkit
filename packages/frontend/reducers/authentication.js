const authentication = (state = {}, action) => {
  switch (action.type) {
    case 'LOG_IN_SUCCESS':
    	const token = action.payload.accessToken;
    	console.log('access token success yeah ok');
    	return { token };
    case 'LOG_OUT':
    	return {};
    default:
      return state
  }
}

export default authentication