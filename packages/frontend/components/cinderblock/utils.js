import validator from './validator';

export const runValidations = (fields, validators) => {
  let errors = [];
  let args, msg, fieldValidators;
  for(let fKey in fields){
    fieldValidators = validators[fKey];
    for(let vKey in fieldValidators){
      args = [].concat(fieldValidators[vKey].args);
      if( !validator[vKey](...[fields[fKey], ...args]) ){ 
        msg = fieldValidators[vKey].msg || 'There was a problem';
        errors.push({path: fKey, message: msg});
      }
    }
  }
  return (errors.length) ? {name: 'BadRequest', errors} : false;
}

export const readFileAsDataUrl = (inputFile) => {
  const temporaryFileReader = new FileReader();
  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };
    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result);
    };
    temporaryFileReader.readAsDataURL(inputFile);
  });
};


// Add toastable errors
import { addToast } from '../../actions';
export const addToastableErrors = (dispatch, error, messages) => {
  if(error && messages[error.name]){
    dispatch(addToast(messages[error.name]));
  }
}


/*
// nthChildTest

const ordinals = nthChildTest ({
  specialOffer: user 
  header: true,
  signUp: !user,
  suggestions: suggestionsData?.length,
});

{ user && 
  <SpecialOffer />
}

<Header hasBorder={ordinals.header != 1}> { // header isn't the first child so yes to border }
  <Text>Header stuff woo</Text>
</Headder>

*/

export const nthChildTest = (conditionsInOrder) => {
  const ordinals = {};
  const index = 1; // first-child == 1
  for (key in conditions) {
    if(conditionsInOrder[key]){
      ordinals[key] = index;
      index++;
    }
  }
  return ordinals
}