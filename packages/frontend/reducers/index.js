import { combineReducers } from 'redux';
import authentication from './authentication'
import shows from './shows'
import users from './users'
import user from './user'


const reducers = combineReducers({
	authentication,
	shows,
	user,
	users,
});

export default reducers