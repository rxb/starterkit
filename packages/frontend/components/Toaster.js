// just a HOC to add state to the cinderblock toaster
// cinderblock itself shouldn't be dependent on redux, specifically
// just functions passed in a props

import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import {
	addToast,
	hideToast,
	removeToast
} from '../actions';

import{ Toast } from './cinderblock';

const Toaster = (props) => ( <Toast {...props} /> );

const mapStateToProps = (state, ownProps) => {
	return ({
		toasts: state.toasts,
	});
}

const actionCreators = {
	addToast,
	hideToast,
	removeToast
}

export default connect(
	mapStateToProps,
	actionCreators
)(Toaster);