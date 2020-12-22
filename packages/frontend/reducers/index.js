import { combineReducers } from 'redux';
import { HYDRATE } from 'next-redux-wrapper';
import authentication from './authentication'
import events from './events'
import prompts from './prompts'
import show from './show'
import shows from './shows'
import showComments from './showComments'
import tags from './tags'
import tldr from './tldr'
import tldrs from './tldrs'
import toasts from './toasts'
import users from './users'
import user from './user'

const combinedReducers = combineReducers({
	authentication,
	events,
	prompts,
	show,
	shows,
	showComments,
	tags,
	tldr,
	tldrs,
	toasts,
	user,
	users,
});

const rootReducer = (state, action) => {
	if(action.type == HYDRATE){
		const nextState = {
			...state, // use previous state
			...action.payload, // apply delta from hydration
		}
		return nextState;
	}
	else{
		return combinedReducers(state, action);
	}
}

export default rootReducer