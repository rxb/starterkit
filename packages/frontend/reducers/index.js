import { combineReducers } from 'redux';
import authentication from './authentication'
import show from './show'
import shows from './shows'
import showComments from './showComments'
import toasts from './toasts'
import users from './users'
import user from './user'


const reducers = combineReducers({
	authentication,
	show,
	shows,
	showComments,
	toasts,
	user,
	users,
});

export default reducers