import React, { Fragment, useState, useEffect, useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	addToast,
	showToast,
	clearDropdowns,
	showDelayedToasts,
	logIn,
	logInFailure,
	updateUi
} from '../actions';

import NProgress from 'nprogress'
import Router from 'next/router'

import {
	Avatar,
	Bounds,
	Button,
	Card,
	CheckBox,
	Chunk,
	Flex,
	FlexItem,
	Header,
	Icon,
	Inline,
	Image,
	LoadingBlock,
	Link,
	List,
	Tabs,
	Touch,
	Menu,
	Modal,
	Picker,
	RevealBlock,
	Section,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	View,
	ThemeContext
} from 'cinderblock';

import LoginModal from './LoginModal';
import ConnectedToaster from './ConnectedToaster';
import ConnectedPrompter from './ConnectedPrompter';
import ConnectedDropdowner from './ConnectedDropdowner';
import { addToastableErrors } from 'components/utils';

function Page(props) {

	// data from redux
	const dispatch = useDispatch();
	const ui = useSelector(state => state.ui);
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

	// router-related UI config	
	useEffect(() => {
		NProgress.configure({ trickle: true, trickleSpeed: 400, showSpinner: false });
		Router.onRouteChangeStart = (url) => {
			NProgress.start();
		}
		Router.onRouteChangeComplete = () => {
			NProgress.done();
			dispatch(clearDropdowns());
			setTimeout(() => dispatch(showDelayedToasts()), 500);
		}
		Router.onRouteChangeError = () => NProgress.done();
	}, []);

	// dismiss dropdowns on window resize
	useEffect(() => {
		function handleResize() {
			dispatch(clearDropdowns());
		}
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);


	// errors - do separate useEffect for each error checking
	useEffect(() => {
		addToastableErrors(dispatch, authentication, {
			BadRequest: 'That was one bad request',
			NotAuthenticated: 'You shall not pass'
		});
	}, [authentication]);

	return (
		<View style={{ minHeight: '100vh', flex: 1 }}>

			{props.children}

			{/* global ui */}
			<LoginModal />
			<ConnectedToaster />
			<ConnectedPrompter />
			<ConnectedDropdowner />

		</View>
	);
}

export default Page;