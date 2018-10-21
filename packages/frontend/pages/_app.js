import fetch from 'isomorphic-unfetch';

import App, {Container} from 'next/app'
import React from 'react'
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import { apiMiddleware, isRSAA, RSAA } from 'redux-api-middleware';
import withRedux from "next-redux-wrapper";
import reducer from '../reducers';

import {
  fetchUser,
  reauthenticate
} from '../actions';

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

// for the ssr, you need to explicitly set fetch
// window.fetch doesn't do it, I guess
const fetchMiddleware = ({getState, dispatch}) => next => action => {
  if (action[RSAA]) {
    action[RSAA].fetch = fetch;
  }
  return next(action)
}

// will need to use next cookies somehow?
const startState = {authentication: {}};
if (process.browser) {
  // all values from localstorage are strings until parsed, even null
  startState['authentication'] = JSON.parse(localStorage.getItem('AUTHENTICATION')) || {};
}

const makeStore = (initialState, options) => {
    return createStore(
      reducer,
      startState,
      applyMiddleware(
        thunk,
        fetchMiddleware,
        authMiddleware,
        // refreshMiddleware,
        apiMiddleware,
      )
    );
};


class ThisApp extends App {

 static async getInitialProps ({ Component, router, ctx }) {

    const {store} = ctx;

    let pageProps = (Component.getInitialProps) ? await Component.getInitialProps(ctx) : {};
    return {pageProps}
  }

  componentDidMount(){
    // if you don't pass through connect
    // you have to be more verbose asi
    this.props.store.subscribe(() => {
      localStorage.setItem('AUTHENTICATION', JSON.stringify(this.props.store.getState().authentication));
    });
    this.props.store.dispatch(fetchUser('self'));
  }

  render () {
    const {Component, pageProps, store} = this.props;
    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    )
  }
}

// withRedux is glue to make redux work on nextjs ssr
// as well as client side
export default withRedux(makeStore)(ThisApp);