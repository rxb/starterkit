import { combineReducers } from 'redux';
import authentication from './authentication'
import environment from './environment'
import show from './show'
import shows from './shows'
import showComments from './showComments'
import users from './users'
import user from './user'


const reducers = combineReducers({
	authentication,
	environment,
	show,
	shows,
	showComments,
	user,
	users,
});

export default reducers