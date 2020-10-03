//https://github.com/vercel/next.js/tree/canary/examples/with-redux-wrapper

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'
import { apiMiddleware, isRSAA, RSAA } from 'redux-api-middleware';
import { HYDRATE, createWrapper } from 'next-redux-wrapper';
import reducer from '../reducers';


const authMiddleware = ({getState, dispatch}) => next => action => {
   const token = (getState().authentication && getState().authentication.token) ? getState().authentication.token : '';
   if (action[RSAA]) {
     action[RSAA].headers = {
       Authorization: 'Bearer ' + token,
       ...action[RSAA].headers
     }
   }
   return next(action)
 }

/*
 const reducer = (state, action) => {
   if (action.type === HYDRATE) {
     const nextState = {
       ...state, // use previous state
       ...action.payload, // apply delta from hydration
     }
     if (state.count.count) nextState.count.count = state.count.count // preserve count value on client side navigation
     return nextState
   } else {
     return combinedReducer(state, action)
   }
 }
 */


const makeStore = (initialState, options) => {
   return createStore(
     reducer,
     applyMiddleware(
       thunkMiddleware,
       authMiddleware,
       apiMiddleware,
     )
   );
};

export const wrapper = createWrapper(makeStore)
