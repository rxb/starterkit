import{
  findByOptimisticId,
  parseFeathersError,
  createReducers
} from './utils.js'


// PREMISE: redux is the display cache
// there are two passes for what actually gets displayed onscreen
// 1. requesting a superset (or exact match) of items from the server to live in the display cache (redux)
// 2. filtering (100% is still a sort of filter) in mapStateToProps to get more specific
// the shape of the internal data in the display cache should be whatever is fastest most of the time (if there is a lot of filtering, reselect can memoize that stuff)

// therefore
// you can select a bunch of stuff
// and display all of it, but if you want to only display some of it, do that in the filter


const showComments = createReducers("SHOW_COMMENTS", true);

export default showComments;