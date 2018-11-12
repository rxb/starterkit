// FIND BY OPTIMISTIC ID
// get index from array of objects by matching temporary optimisticId
export const findByOptimisticId = (items, optimisticId) => {
  return items.findIndex( comment => comment.optimisticId === optimisticId )
};


// PARSE FEATHERS ERROR
// convert feathers .errors array to a more-usable object (fieldErrors)
// for indicating errors field-by-field
// example data
// {
//    title: "Sorry, can't make a title about 'garbage'",
//    description: "Sorry, description can't be blank",
// }
export const parseFeathersError = (error) => {
  error.fieldErrors = {};
  error.errors.forEach( err => {
    error.fieldErrors[err.path] = err.message;
  });
  error.errorCount = error.errors.length;
  return error;
}