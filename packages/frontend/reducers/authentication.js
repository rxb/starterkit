const authentication = (state = {}, action) => {
  switch (action.type) {
    case 'LOG_IN_SUCCESS':
      return { ...action.payload };
    case 'LOG_OUT':
      return {};
    default:
      return state
  }
}

export default authentication