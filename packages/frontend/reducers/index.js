import { combineReducers } from 'redux';
import authentication from './authentication'
import shows from './shows'

const reducers = combineReducers({
	authentication,
	shows
});

export default reducers