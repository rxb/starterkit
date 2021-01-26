//https://github.com/vercel/next.js/tree/canary/examples/with-redux-wrapper

import { createStore } from 'redux';
import { HYDRATE, createWrapper } from 'next-redux-wrapper';
import reducer from '../reducers';





const makeStore = (initialState, options) => {

   const createdStore =  createStore( reducer );
   return createdStore;
};

export const wrapper = createWrapper( makeStore )
