const authentication = (state = {}, action) => {
  console.log(action);
  switch (action.type) {
    case 'LOG_IN':
      return { loading: true };
    case 'LOG_IN_SUCCESS':
    	return { token: action.payload.accessToken, loading: false };
    case 'LOG_IN_FAILURE':
      return { loading: false, error: action.payload.response }
    case 'REAUTHENTICATE':
      return { token: action.payload.token, loading: false };
    case 'LOG_OUT':
    	return { loading: false };
    default:
      return state
  }
}

export default authentication