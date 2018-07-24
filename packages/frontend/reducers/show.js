const show = (state = {}, action) => {
  switch (action.type) {
  	case 'FETCH_SHOW':
  		return {};
    case 'FETCH_SHOW_SUCCESS':
    	const show = action.payload;
    	return show;
    default:
      return state
  }
}

export default show