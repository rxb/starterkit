import Head from 'next/head';
import React, {useEffect} from 'react';
import { AppRegistry } from 'react-native-web';

// REDUX
import {Provider, useDispatch, useSelector} from 'react-redux';
import {useStore} from '../store';
import { logOut, fetchUser, logInSuccess, updateUi } from '../actions';

// SWR
import { SWRConfig } from 'swr';
import { fetcher } from '@/swr';

// URLS
import { getLoginPageUrl, getOauthPageUrl } from 'components/tldr/urls';

// STYLE
import swatches from '../modules/cinderblock/styles/swatches';
import { METRICS, MEDIA_QUERIES, BREAKPOINT_SIZES } from '../modules/cinderblock/designConstants';
import { initMediaProvider } from '../modules/cinderblock/components/UseMediaContext';
const MediaProvider = initMediaProvider(MEDIA_QUERIES);

// MODULES
import feathersClient from '../components/FeathersClient'; 
import Router from 'next/router'

/*
// CLEARALLTOKENS
// these should get cleared anyhow, but let's just be extra safe
const clearAllTokens = () => {
  if (process.browser) {
    document.cookie = "connect.sid= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    localStorage.removeItem("feathers-jwt");
  }
}
*/

// CHECKFORBADOAUTH
// this is hacky, but I don't know how else to detect it
const checkForBadOauth = (error) => {
  if(process.browser && error && error.code == 401 && window.location.pathname == getOauthPageUrl() ){
    Router.push({pathname: getLoginPageUrl(), query: {error: 'oauth'}}) 
  }
}

function ThisApp(props) {

    const {Component, pageProps} = props;
    const store = useStore(pageProps.initialReduxState)

    const dispatch = store.dispatch; // not in the Provider yet
    const storeAuth = (authResult, params, context) => {
      dispatch( logInSuccess(authResult) );
      localStorage.setItem("probablyHasAccount", "true");
      dispatch( updateUi({probablyHasAccount: true}) );
    }
    feathersClient.on('login', storeAuth);
    feathersClient.on('logout', (authResult, params, context) => {
      dispatch( logOut() );
    });

    feathersClient.reAuthenticate()
      .then(storeAuth)
      .catch((error)=>{
        dispatch( logOut() );
        checkForBadOauth(error);
      }
    );

    useEffect(()=>{
      const probablyHasAccount = !!localStorage.getItem("probablyHasAccount");
      dispatch( updateUi({probablyHasAccount: probablyHasAccount}) );  
    }, [])

    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1 shrink-to-fit=no" />
          <style
            dangerouslySetInnerHTML={{ __html: `

              /*
              WEB-ONLY CSS HACKS
              All the weird stuff that React Native will never care about
              */

              html, body, #__next{
                width: 100%;
                height: 'auto';
                min-height: 100%;
                padding: 0;
                margin: 0;
                display: flex;
                flex-direction: column;
                flex: 1;
              }

              /* form nonstandard styles */
              /*
              .input{
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
              }
              */

              /* form focus */
              *:focus{
                outline-offset: 0;
              }
              input:focus, textarea:focus, select:focus, .focus{
                outline: none;
                border-color: ${swatches.tint};
                background-color: transparent;
                //box-shadow: 0 0 0 3px ${swatches.focus};
                zIndex: 2;
              }

              /* many browsers have broken search inputs */
              input[type="search"]::-webkit-search-cancel-button {

                /* Remove default */
                -webkit-appearance: none;
              
                /* Now your own custom styles */
                height: 24px;
                width: 16px;
                display: block;
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAn0lEQVR42u3UMQrDMBBEUZ9WfQqDmm22EaTyjRMHAlM5K+Y7lb0wnUZPIKHlnutOa+25Z4D++MRBX98MD1V/trSppLKHqj9TTBWKcoUqffbUcbBBEhTjBOV4ja4l4OIAZThEOV6jHO8ARXD+gPPvKMABinGOrnu6gTNUawrcQKNCAQ7QeTxORzle3+sDfjJpPCqhJh7GixZq4rHcc9l5A9qZ+WeBhgEuAAAAAElFTkSuQmCC);
                /* setup all the background tweaks for our custom icon */
                background-repeat: no-repeat;
                background-position: center center;
                cursor: pointer;
              
                /* icon size */
                background-size: 16px;
              
              }

              /* weird autofill font sizes */
              input:-webkit-autofill::first-line{
                font-size: ${METRICS.bodySize}px;
                font-family: ${METRICS.fontFamily};
              }

              /* remove autofill styles (might be evil, but let's try it) 
              @-webkit-keyframes autofill {
                  to {
                      background: ${swatches.notwhite};
                  }
              }
              @-webkit-keyframes autofillfocus {
                  to {
                      background: transparent;
                  }
              }
              input:-webkit-autofill {
                  -webkit-animation-name: autofill;
                  -webkit-animation-fill-mode: both;
              }
              input:-webkit-autofill:focus {
                  -webkit-animation-name: autofillfocus;
              }
              */

            `}}
          />

          <link rel='stylesheet' type='text/css' href='/static/nprogress.css' />

        </Head>

        {/*
          MATCHMEDIA HACK
          at wider screens, prevent showing flash of narrow-screen styling
        */}
        <script dangerouslySetInnerHTML={{__html: `
          if(window.innerWidth > ${BREAKPOINT_SIZES.medium}){
            document.body.style.display = 'none';
            window.addEventListener('load', function() {
              document.body.style.display = '';
            })
          }
        `}} />

        <MediaProvider>
          <Provider store={store}>
              <SWRConfig value={{
                  fetcher: fetcher 
                }}>
                <Component {...pageProps} />
              </SWRConfig>
          </Provider>
        </MediaProvider>

      </>
    )
}

export default ThisApp;