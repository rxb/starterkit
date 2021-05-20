import React, { Fragment, useState, useEffect, useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from 'components/utils';

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
import { RegisterForm, LoginForm, RegisterHeader, LoginHeader } from 'components/authComponents';


function LoginModal(props) {
   const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

   // data from redux
   const dispatch = useDispatch();
   const ui = useSelector(state => state.ui);
   const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

	// dismiss modal on login
	const prevUser = usePrevious(user);
	useEffect(() => {
		// got user, so dismiss modal
		if (user.id && prevUser !== user && ui.logInModalVisible) {
			dispatch(updateUi({ logInModalVisible: false }))
		}
	}, [user]);

   // LOGIN MODAL CONFIG
   const {
      redirect = {},
      callbackForNonRedirectFlow = () => { },
   } = ui.logInModalOptions || {};
   const [authUi, setAuthUi] = useState('login');
   useEffect(() => {
      const thisAuthUi = ui.logInModalOptions?.authUi ? ui.logInModalOptions.authUi
         : ui.probablyHasAccount ? 'login' : 'register';
      setAuthUi(thisAuthUi);
   }, [ui.logInModalVisible])

   return (
      <Modal
         visible={ui.logInModalVisible}
         onRequestClose={() => {
            dispatch(updateUi({
               logInModalVisible: false,
               loginModalOptions: {}
            }))
         }}
      >
         <Stripe>
            <RevealBlock visible={authUi == 'login'} animateExit={false}>
               <Section>
                  <LoginHeader toggleOnPress={() => setAuthUi('register')} />
               </Section>
               <LoginForm
                  redirectOverride={redirect}
                  callbackForNonRedirectFlow={callbackForNonRedirectFlow}
                  redirectOnLocalLogin={true}
               />
            </RevealBlock>
            <RevealBlock visible={authUi == 'register'} animateExit={false}>
               <Section>
                  <RegisterHeader toggleOnPress={() => setAuthUi('login')} />
               </Section>
               <RegisterForm
                  redirectOverride={ui.logInModalOptions ? ui.logInModalOptions.redirect : null}
               />
            </RevealBlock>
         </Stripe>
      </Modal>

   )
}

export default LoginModal;