const authentication = (state = {}, action) => {
  switch (action.type) {
    case 'LOG_IN_SUCCESS':
      console.log('log_in_success');
      return { ...action.payload };
    case 'LOG_OUT':
      return {};
    default:
      return state
  }
}

export default authentication