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


// deprecated
export const checkToastableErrors = (newProps, oldProps, messages) => {
	for (const key in messages){
		if(newProps[key].error && newProps[key].error !== oldProps[key].error){
			const message = messages[key][newProps[key].error.name];
			if(message){
				newProps.addToast(message);
			}
		}
	}
}

// Add toastable errors
import { addToast } from '../../actions';
export const addToastableErrors = (dispatch, error, messages) => {
  if(error && messages[error.name]){
    dispatch(addToast(messages[error.name]));
  }
}