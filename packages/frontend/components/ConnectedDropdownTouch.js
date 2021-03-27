// just a HOC to add state to the cinderblock toaster
// cinderblock itself shouldn't be dependent on redux, specifically
// just functions passed in a props

import React, {Fragment} from 'react';
import { connect } from 'react-redux';

import {
	addDropdown,
	hideDropdown,
	removeDropdown
} from '../actions';

import{ DropdownTouch } from './cinderblock';

const ConnectedDropdownTouch = (props) => ( <DropdownTouch {...props} />);
const mapStateToProps = (state, ownProps) => ({ dropdowns: state.dropdowns });
const actionCreators = { addDropdown, hideDropdown, removeDropdown }
export default connect( mapStateToProps, actionCreators )(ConnectedDropdownTouch);