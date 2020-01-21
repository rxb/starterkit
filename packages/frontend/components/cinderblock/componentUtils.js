import { BREAKPOINTS } from './designConstants';

export const findWidestActiveValue = (values, media) => {
	let valuesMap = (typeof values === 'object') ? values : { small: values }
	let activeValue = valuesMap['small'];
	BREAKPOINTS.forEach( BP => {
		if( valuesMap[BP] && media[BP] ){
			activeValue = valuesMap[BP];
		}
	});
	return activeValue;
}