import Document, { Head, Main, NextScript } from 'next/document'
import React from 'react'
import { AppRegistry } from 'react-native-web'


import { BREAKPOINT_SIZES } from '../components/cinderblock/designConstants';
import swatches from '../components/cinderblock/styles/swatches';

let index = 0
export default class MyDocument extends Document {
  static async getInitialProps (ctx) {
    AppRegistry.registerComponent('Main', () => Main)
    const { renderPage } = ctx;
    const { getStyleElement } = AppRegistry.getApplication('Main')
    const page = renderPage()
    const styles = [
      <style
        key={index++}
        dangerouslySetInnerHTML={{ __html: `

          /*
          WEB-ONLY CSS HACKS
          All the weird stuff that React Native will never care about
          */

          html, body, #__next{
            width: 100%;
            height: 'auto',
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
      />,
      getStyleElement()
    ]
    return { ...page, styles }
  }

  render () {
    return (
      <html style={{ height: '100%', width: '100%' }}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1 shrink-to-fit=no" />
          <link rel='stylesheet' type='text/css' href='/static/nprogress.css' />
          <link rel='stylesheet' type='text/css' href='/static/simplemde.min.css' />


  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossOrigin=""/>



 <link rel="stylesheet" type="text/css"
    href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css"
    integrity="sha512-BBToHPBStgMiw0lD4AtkRIZmdndhB6aQbXpX7omcrXeG2PauGBl2lzq2xUZTxaLxYz5IDHlmneCZ1IJ+P3kYtQ=="
    crossOrigin="" />
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css"
    integrity="sha512-RLEjtaFGdC4iQMJDbMzim/dOvAu+8Qp9sw7QE4wIMYcg2goVoivzwgSZq9CsIxp4xKAZPKh5J2f2lOko2Ze6FQ=="
    crossOrigin="" />


        </Head>
        <body>

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
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

