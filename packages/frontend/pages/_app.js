// TODO: clean up authentication, reconsider

import App, {Container} from 'next/app';
import Head from 'next/head';
import React from 'react';
import swatches from '../components/cinderblock/styles/swatches';

import {wrapper} from '../store';

import {
  setUser,
  logOut,
  fetchUser,
  logInSuccess
} from '../actions';


// FEATHERS CLIENT: just using this for auth.
// Commenting out socket transport until it's actually necessary in this project
import feathersClient from '../components/FeathersClient'; // already instantiated so we can share
import feathers from '@feathersjs/client'; // but we still need the original to configure

//import io from 'socket.io-client';
const apiUrl = 'http://localhost:3030';
//const socket = io(apiUrl);

const authenticationOptions = {};
if (process.browser) {
  authenticationOptions["storage"] = window.localStorage
}
feathersClient.configure(feathers.authentication(authenticationOptions));
feathersClient.configure(feathers.rest(apiUrl).fetch(fetch));
//feathersClient.configure(feathers.socketio(socket));
//feathersClient.reAuthenticate();






class ThisApp extends App {

  componentDidMount(){
    const storeAuthAndUser = (authResult, params, context) => {
      this.props.store.dispatch( logInSuccess(authResult.accessToken) );
      this.props.store.dispatch( setUser(authResult.user) );
    }
    feathersClient.on('login', storeAuthAndUser);
    feathersClient.on('logout', (authResult, params, context) => {
      this.props.store.dispatch( logOut() );
    });
    feathersClient.reAuthenticate()
      .then(storeAuthAndUser)
      .catch((error)=>{
        // no auth
        // console.log(error);
      }
    );

    /*
    // comment out for now
    // old non-feathersclient version of token management + user checking
    this.props.store.subscribe(() => {
      localStorage.setItem('AUTHENTICATION', JSON.stringify(this.props.store.getState().authentication));
    });
    this.props.store.dispatch(fetchUser('self'));
    */

  }

  render () {
    const {Component, pageProps, store} = this.props;
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

          {/*
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
          integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
          crossOrigin=""/>
          <link rel="stylesheet" type="text/css" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css"
              integrity="sha512-BBToHPBStgMiw0lD4AtkRIZmdndhB6aQbXpX7omcrXeG2PauGBl2lzq2xUZTxaLxYz5IDHlmneCZ1IJ+P3kYtQ=="
              crossOrigin="" />
          <link rel="stylesheet" type="text/css" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css"
              integrity="sha512-RLEjtaFGdC4iQMJDbMzim/dOvAu+8Qp9sw7QE4wIMYcg2goVoivzwgSZq9CsIxp4xKAZPKh5J2f2lOko2Ze6FQ=="
              crossOrigin="" />
          */}

        </Head>
        <Component {...pageProps} />
      </>
    )
  }
}

//https://github.com/vercel/next.js/tree/canary/examples/with-redux-wrapper
export default wrapper.withRedux(ThisApp);