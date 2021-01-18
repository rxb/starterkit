import{
  parseFeathersError,
  createApiReducersObject,
  createReducersFromObject
} from './utils.js'

const reducersObject = createApiReducersObject("SHOW_COMMENTS", {doOptimisticUpdate: true});
const showComments = createReducersFromObject(reducersObject);

export default showComments;