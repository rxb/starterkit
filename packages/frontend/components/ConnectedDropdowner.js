// just a HOC to add state to the cinderblock toaster
// cinderblock itself shouldn't be dependent on redux, specifically
// just functions passed in a props

import React, { Fragment, useContext } from 'react';
import { connect } from 'react-redux';

import {
	addDropdown,
	hideDropdown,
	removeDropdown
} from '../actions';

import { Dropdowner } from 'cinderblock';

const ConnectedDropdowner = (props) => (<Dropdowner {...props} />);
const mapStateToProps = (state, ownProps) => ({ dropdowns: state.dropdowns });
const actionCreators = { addDropdown, hideDropdown, removeDropdown }
export default connect(mapStateToProps, actionCreators)(ConnectedDropdowner);