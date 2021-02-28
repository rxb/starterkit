import { combineReducers } from 'redux';
import authentication from './authentication'
import prompts from './prompts'
import toasts from './toasts'
import ui from './ui'

const reducers = {
	authentication,
	prompts,
	toasts,
	ui
};

export default combineReducers(reducers);