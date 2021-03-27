import { combineReducers } from 'redux';
import authentication from './authentication'
import prompts from './prompts'
import toasts from './toasts'
import dropdowns from './dropdowns'
import ui from './ui'

const reducers = {
	authentication,
	prompts,
	toasts,
	dropdowns,
	ui
};

export default combineReducers(reducers);