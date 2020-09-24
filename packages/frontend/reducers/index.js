import { combineReducers } from 'redux';
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


const reducers = combineReducers({
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

export default reducers