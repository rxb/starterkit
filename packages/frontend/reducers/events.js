import{
  parseFeathersError
} from './utils.js'

const startState = {
  items: [],
  error: {},
  loading: false
};

let newState;

const events = (state = startState, action) => {
  switch (action.type) {
    case 'FETCH_EVENTS':
      return {...state, items: [], loading: true};
    case 'FETCH_EVENTS_SUCCESS':
      return {...state, items: action.payload.data, loading: false};

    // CREATE
    case 'CREATE_EVENT':
      newState = {...state, loading: true}
      return newState;
    case 'CREATE_EVENT_SUCCESS':
      return {...state, loading: false, items: [...newState.items, action.payload] };
    case 'CREATE_EVENT_FAILURE':
      newState = {...state, loading: false, error: parseFeathersError(action.payload.response)}
      return newState;

    default:
      return state
  }
}
export default events