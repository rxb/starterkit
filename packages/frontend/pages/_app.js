import React, { useEffect, } from 'react';
import Head from 'next/head'

// REDUX
import { Provider } from 'react-redux';
import { useStore } from '../store';
import { logOut, logInSuccess, updateUi } from '../actions';

// SWR
import { SWRConfig } from 'swr';
import { fetcher } from '@/swr';

// URLS
import { getLoginPageUrl, getOauthPageUrl } from 'components/tldr/urls';

// STYLE
import { ThemeContext, styleConfig, designConstants, initMediaProvider } from 'cinderblock';
const { MEDIA_QUERY_PARAMS_SINGLE } = designConstants;
const MediaProvider = initMediaProvider(MEDIA_QUERY_PARAMS_SINGLE);

// CONFIG STYLES
const METRICS = styleConfig.METRICS;
const SWATCHES = styleConfig.SWATCHES;
const themedStyleConfig = {
	...styleConfig,
	METRICS: METRICS,
	...styleConfig.buildStyles(METRICS, SWATCHES) // media query styles adds {styles, ids}
}

// MODULES
import feathersClient from '../components/FeathersClient';
import Router from 'next/router'

// CHECK FOR BAD OAUTH
// this is hacky, but I don't know how else to detect it
const checkForBadOauth = (error) => {
	if (process.browser && error && error.code == 401 && window.location.pathname == getOauthPageUrl()) {
		Router.push({ pathname: getLoginPageUrl(), query: { error: 'oauth' } })
	}
}

function ThisApp(props) {
	const { Component, pageProps } = props;
	const store = useStore(pageProps.initialReduxState)
	const dispatch = store.dispatch; // not in the Provider yet

	useEffect(() => {
		// auth events
		const storeAuth = (authResult, params, context) => {
			dispatch(logInSuccess(authResult));
			localStorage.setItem("probablyHasAccount", "true");
			dispatch(updateUi({ probablyHasAccount: true }));
		}
		feathersClient.on('login', storeAuth);
		feathersClient.on('logout', (authResult, params, context) => {
			dispatch(logOut());
		});
		feathersClient.reAuthenticate()
			.then(storeAuth)
			.catch((error) => {
				dispatch(logOut());
				checkForBadOauth(error);
		});

		// customize UI for likely return visitor
		const probablyHasAccount = !!localStorage.getItem("probablyHasAccount");
		dispatch(updateUi({ probablyHasAccount: probablyHasAccount }));

	}, [])


	return (
		
		<ThemeContext.Provider value={themedStyleConfig}>
			<MediaProvider>
				<Provider store={store}>
					<SWRConfig value={{ fetcher: fetcher }}>
						<Head>
							<meta name="viewport" content="width=device-width, initial-scale=1 shrink-to-fit=no" />
						</Head>
						<Component {...pageProps} />
					</SWRConfig>
				</Provider>
			</MediaProvider>
		</ThemeContext.Provider>
	)
}

export default ThisApp;