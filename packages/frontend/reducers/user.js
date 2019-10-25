const user = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_USER_SUCCESS':
    case 'SET_USER':
		return action.payload; // feathers only returns meta & data params for paginated finds, this is get
	case 'LOG_OUT':
		return {};
    default:
     	return state;
  }
}

export default user