const authentication = (state = {}, action) => {
  switch (action.type) {
    case 'LOG_IN_SUCCESS':
    	return { token: action.payload.accessToken };
    case 'REAUTHENTICATE':
      console.log('reauth');
      return { token: action.payload.token };
    case 'LOG_OUT':
    	return {};
    default:
      return state
  }
}

export default authentication