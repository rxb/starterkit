import React, {Fragment, useState, useEffect, useRef} from 'react';
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

//import feathersClient from '../components/FeathersClient'; // already instantiated so we can share

import styles from '../modules/cinderblock/styles/styles';
import swatches from '../modules/cinderblock/styles/swatches';
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
} from '../modules/cinderblock';

import ConnectedToaster from './ConnectedToaster';
import ConnectedPrompter from './ConnectedPrompter';
import ConnectedDropdowner from './ConnectedDropdowner';
import { addToastableErrors } from 'modules/cinderblock/utils';
import { RegisterForm, LoginForm, RegisterHeader, LoginHeader } from 'components/authComponents';


// usePrevious hook
// todo: pull this into another file to be reused
function usePrevious (value) {
	const ref = useRef();
	useEffect(() => { 
		ref.current = value 
	}, [value]);
	return ref.current;
}


// TODO: pass in header


function Page (props) {
	
	// data from redux
	const dispatch = useDispatch(); 
	const ui = useSelector(state => state.ui);
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

	// router-related UI config	
	useEffect(()=>{
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
		function handleResize(){
			dispatch(clearDropdowns());
		}
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	 }, []); 
	 

	// dismiss modal on login
	const prevUser = usePrevious(user);
	useEffect(()=>{
		// got user, so dismiss modal
		if(user.id && prevUser !== user && ui.logInModalVisible){
			dispatch(updateUi({logInModalVisible: false}))
		} 
	}, [user]);
	

	// errors - do separate useEffect for each error checking
	useEffect(()=>{
		addToastableErrors(dispatch, authentication, {
			BadRequest: 'That was one bad request',
			NotAuthenticated: 'You shall not pass'
		});
	},[authentication]);

	const [authUi, setAuthUi] = useState('login');

	return (
		<View style={{minHeight: '100vh', flex: 1}}>

			{props.children}
			
			<Modal
				visible={ui.logInModalVisible}
				onRequestClose={()=>{
					dispatch(updateUi({ 
						logInModalVisible: false, 
						loginModalOptions: {} 
					}))
				}}
				>
				<Stripe>

					{/*ui.logInModalOptions?.explainText && 
							<Chunk>
								<Text>{ui.logInModalOptions.explainText}</Text>
							</Chunk>
					*/}

					<RevealBlock visible={authUi == 'login'} animateExit={false}>
						<Section>
							<LoginHeader toggleOnPress={()=>setAuthUi('register')} />
						</Section>
						<LoginForm 
							redirectOnLocalLogin={true}
							redirectOverride={ui.loginModalOptions?.redirect} 
							/>
					</RevealBlock>

					<RevealBlock visible={authUi == 'register'} animateExit={false}>
						<Section>
							<RegisterHeader toggleOnPress={()=>setAuthUi('login')} />
						</Section>
						<RegisterForm 
							redirectOverride={ui.loginModalOptions?.redirect} 
							/>
					</RevealBlock>

				</Stripe>
			</Modal>
			
			<ConnectedToaster />
			<ConnectedPrompter />
			<ConnectedDropdowner />

		</View>
	);

}



export default Page;