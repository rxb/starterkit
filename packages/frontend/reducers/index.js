import { combineReducers } from 'redux';
import authentication from './authentication'
import prompts from './prompts'
import toasts from './toasts'

const combinedReducers = combineReducers({
	authentication,
	prompts,
	toasts
});


export default combinedReducers;