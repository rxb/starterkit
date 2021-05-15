// just a HOC to add state to the cinderblock prompter
// cinderblock itself shouldn't be dependent on redux, specifically
// just functions passed in a props

import React, { Fragment, useContext } from 'react';
import { connect } from 'react-redux';
import {
	addPrompt,
	hidePrompt,
	removePrompt
} from '../actions';

import { Prompter } from 'cinderblock';

const ConnectedPrompter = (props) => (<Prompter {...props} />);

const mapStateToProps = (state, ownProps) => {
	return ({
		prompts: state.prompts,
	});
}

const actionCreators = {
	addPrompt,
	hidePrompt,
	removePrompt
}

export default connect(
	mapStateToProps,
	actionCreators
)(ConnectedPrompter);