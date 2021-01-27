import { combineReducers } from 'redux';
import authentication from './authentication'
import prompts from './prompts'
import toasts from './toasts'

const reducers = {
	authentication,
	prompts,
	toasts
};

export default combineReducers(reducers);