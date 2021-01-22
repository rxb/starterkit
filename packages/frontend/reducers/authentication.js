import{
  parseFeathersError
} from './utils.js'

console.log('authentication hello');

const authentication = (state = {}, action) => {
  switch (action.type) {
    case 'LOG_IN':
      console.log('LOG_IN');
      return { loading: true };
    case 'LOG_IN_SUCCESS':
      console.log('LOG_IN_SUCCESS');
    	return { token: action.payload.token, loading: false };
    case 'LOG_IN_FAILURE':
      return { loading: false, error: parseFeathersError(action.payload.response) }
    case 'REAUTHENTICATE':
      return { token: action.payload.token, loading: false };
    case 'LOG_OUT':
    	return { loading: false };
    default:
      return state
  }
}

export default authentication