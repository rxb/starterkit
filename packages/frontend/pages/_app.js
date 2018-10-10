import 'isomorphic-unfetch'

import App, {Container} from 'next/app'
import React from 'react'
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import { apiMiddleware, isRSAA, RSAA } from 'redux-api-middleware';
import reducer from '../reducers';
import cookies from 'next-cookies';

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


// will need to use next cookies somehow?
const startState = {};
if (process.browser) {
  startState['authentication'] = JSON.parse(localStorage.getItem('AUTHENTICATION'));
  startState['environment'] = {client: true}
}



const store = createStore(
  reducer,
  startState,
  applyMiddleware(
    // middleware happens in this order
    thunk,
    authMiddleware,
    // refreshMiddleware,
    apiMiddleware,
  )
);


if (process.browser) {
  store.subscribe(() => {
    localStorage.setItem('AUTHENTICATION', JSON.stringify(store.getState().authentication));
  });
  ;
}


class ThisApp extends App {

  /*
  static async getInitialProps({ Component, router, ctx }) {

    // if you override getInitialProps here
    // you'll need this code to keep getInitialProps working on child pages
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    // end

    return { pageProps }
  }
  */


  componentDidMount(){
    // if you don't pass through connect
    // you have to put the action creator into store.dispatch
    store.dispatch(fetchUser('self'));
  }

  render () {
    const {Component, pageProps, reduxStore} = this.props
    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    )
  }
}

export default ThisApp;