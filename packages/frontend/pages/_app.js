import 'isomorphic-unfetch';

import App, {Container} from 'next/app'
import React from 'react'
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import { apiMiddleware, isRSAA, RSAA } from 'redux-api-middleware';
import withRedux from "next-redux-wrapper";
import reducer from '../reducers';

import {
  setUser,
  logOut,
  setToken,
  fetchUser,
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
        authMiddleware,
        // refreshMiddleware,
        apiMiddleware,
      )
    );
};


// FEATHERS CLIENT

// Using this just for auth.
// Commenting out socket transport until it's actually necessary in this project

import feathersClient from '../components/FeathersClient'; // already instantiated so we can share
import feathers from '@feathersjs/client'; // but we still need the original to configure

//import io from 'socket.io-client';
const apiUrl = 'http://localhost:3030';
//const socket = io(apiUrl);

const authenticationOptions = {};
if (process.browser) {
  authenticationOptions["storage"] = window.localStorage
}
feathersClient.configure(feathers.authentication(authenticationOptions));
feathersClient.configure(feathers.rest(apiUrl).fetch(fetch));
//feathersClient.configure(feathers.socketio(socket));
feathersClient.reAuthenticate();


class ThisApp extends App {

  componentDidMount(){
    feathersClient.on('login', (authResult, params, context) => {
      // if actions don't pass through connect, they need the verbose version:
      this.props.store.dispatch( setToken(authResult.token) );
      this.props.store.dispatch( setUser(authResult.user) );
    });

    feathersClient.on('logout', (authResult, params, context) => {
      this.props.store.dispatch( logOut() );
    });

    // existing token?
    feathersClient.reAuthenticate();

    /*
    // comment out for now
    // old non-feathersclient version of token management + user checking
    this.props.store.subscribe(() => {
      localStorage.setItem('AUTHENTICATION', JSON.stringify(this.props.store.getState().authentication));
    });
    this.props.store.dispatch(fetchUser('self'));
    */

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