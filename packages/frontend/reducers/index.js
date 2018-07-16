import { combineReducers } from 'redux';
import authentication from './authentication'
import shows from './shows'
import users from './users'


const reducers = combineReducers({
	authentication,
	shows,
	users,
});

export default reducers