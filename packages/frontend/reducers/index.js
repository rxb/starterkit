import { combineReducers } from 'redux';
import authentication from './authentication'
import shows from './shows'
import showComments from './showComments'
import users from './users'
import user from './user'


const reducers = combineReducers({
	authentication,
	shows,
	showComments,
	user,
	users,
});

export default reducers