import{
  parseFeathersError,
  convertArrayToObject
} from './utils.js'

const startState = {
  items: [],
  itemsById: {},
  itemIds: [],
  localItemIds: [],
  error: {},
  loading: false
};

let newState, items;

const events = (state = startState, action) => {
  switch (action.type) {
    case 'FETCH_EVENTS':
    case 'FETCH_LOCAL_EVENTS':
      return {...state,  loading: true};
    case 'FETCH_EVENTS_SUCCESS':
      items = action.payload.data;
      return {
        ...state,
        itemIds: items.map( item => item.id ),
        itemsById: {...state.itemsById, ...convertArrayToObject(items, "id")},
        loading: false
      };
    case 'FETCH_LOCAL_EVENTS_SUCCESS':
      items = action.payload.data;
      return {
        ...state,
        localItemIds: items.map( item => item.id ),
        itemsById: {...state.itemsById, ...convertArrayToObject(items, "id")},
        loading: false
      };

    // CREATE
    case 'CREATE_EVENT':
      newState = {...state, loading: true}
      return newState;
    case 'CREATE_EVENT_SUCCESS':
      return {...state, loading: false, items: [action.payload, ...newState.items] };
    case 'CREATE_EVENT_FAILURE':
      newState = {...state, loading: false, error: parseFeathersError(action.payload.response)}
      return newState;

    default:
      return state
  }
}
export default events