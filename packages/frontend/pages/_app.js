import Head from 'next/head';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';


// design
import swatches from '../components/cinderblock/styles/swatches';
import { BREAKPOINT_SIZES } from '../components/cinderblock/designConstants';

// redux
import {wrapper} from '../store';

import {
  setUser,
  logOut,
  fetchUser,
  logInSuccess
} from '../actions';


// FEATHERS CLIENT
// just using this for auth
// TODO: would be nice to do this without a client library at all
import feathersClient from '../components/FeathersClient'; // already instantiated so we can share
import feathers from '@feathersjs/client'; // but we still need the original to configure
const apiUrl = 'http://localhost:3030'; // TODO: shouldn't this be in an envirnoment config?
const authenticationOptions = {};
if (process.browser) {
  authenticationOptions["storage"] = window.localStorage
}
feathersClient.configure(feathers.authentication(authenticationOptions));
feathersClient.configure(feathers.rest(apiUrl).fetch(fetch));


function ThisApp(props) {

    const dispatch = useDispatch();
    const storeAuth = (authResult, params, context) => {
      dispatch( logInSuccess(authResult) );
    }
    feathersClient.on('login', storeAuth);
    feathersClient.on('logout', (authResult, params, context) => {
      dispatch( logOut() );
    });
    feathersClient.reAuthenticate()
      .then(storeAuth)
      .catch((error)=>{
        dispatch( logOut() );
      }
    );
    

    const {Component, pageProps, store} = props;
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

              /* remove autofill styles (might be evil, but let's try it) */
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

            `}}
          />

          <link rel='stylesheet' type='text/css' href='/static/nprogress.css' />
          <link rel='stylesheet' type='text/css' href='/static/simplemde.min.css' />

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

        <Component {...pageProps} />
      </>
    )
}

export default wrapper.withRedux(ThisApp);