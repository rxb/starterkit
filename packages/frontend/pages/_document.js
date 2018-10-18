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
          .input{
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
          }

          /* form focus */
          input:focus, textarea:focus, select:focus{
            outline: none;
            border-color: ${swatches.textPrimary};
            background-color: transparent;
          }

          /* other element focus https://nelo.is/writing/styling-better-focus-states/ */
          /*
          :focus:not(.focus-visible) {
            outline: none;
          }
          */
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

