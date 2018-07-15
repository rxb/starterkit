import App, {Container} from 'next/app'
import React from 'react'
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import { apiMiddleware, isRSAA, CALL_API } from 'redux-api-middleware';

import reducer from '../reducers';

const store = createStore(
  reducer,
  applyMiddleware(
    // middleware happens in this order
    thunk,
    // authMiddleware,
    // refreshMiddleware,
    apiMiddleware,
  )
);


class ThisApp extends App {
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
}``

export default ThisApp;