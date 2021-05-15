// just a HOC to add state to the cinderblock toaster
// cinderblock itself shouldn't be dependent on redux, specifically
// just functions passed in a props

import React, { Fragment, useContext } from 'react';
import { connect } from 'react-redux';

import {
	addToast,
	hideToast,
	removeToast
} from '../actions';

import { Toaster } from 'cinderblock';

const ConnectedToaster = (props) => (<Toaster {...props} />);
const mapStateToProps = (state, ownProps) => ({ toasts: state.toasts });
const actionCreators = { addToast, hideToast, removeToast }
export default connect(mapStateToProps, actionCreators)(ConnectedToaster);