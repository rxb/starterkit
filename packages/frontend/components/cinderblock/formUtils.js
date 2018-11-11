import validator from './validator';

export const runValidations = (fields, validators) => {
    let errorCount = 0;
    let fieldErrors = {};
    let args, msg, fieldValidators;
    for(let fKey in fields){
		fieldValidators = validators[fKey];
        for(let vKey in fieldValidators){
        	msg = fieldValidators[vKey].msg || 'There was a problem';
        	args = fieldValidators[vKey].args;
        	args = Array.isArray(args) ? args : [args];
        	args = [fields[fKey], ...args];
        	if( !validator[vKey].apply(validator, args) ){
	        	errorCount++;
	        	fieldErrors[fKey] = msg;
        	}
        }
    }
    return (errorCount) ? {name: 'BadRequest', errorCount, fieldErrors} : {};
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