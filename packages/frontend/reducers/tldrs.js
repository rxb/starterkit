const startState = {items: [], loading: false};
const tldrs = (state = startState, action) => {
  switch (action.type) {
    case 'FETCH_TLDRS':
      return {items: [], loading: true};
    case 'FETCH_TLDRS_SUCCESS':
      const tldrs = action.payload.data;
      const items = [...tldrs];
      return {items: items, loading: false};
    default:
      return state
  }
}

export default tldrs