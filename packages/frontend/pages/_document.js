import Document, { Head, Main, NextScript } from 'next/document'
import React from 'react'
import { AppRegistry } from 'react-native-web'
import { BREAKPOINT_SIZES } from './cinderblock/designConstants';
import swatches from './cinderblock/styles/swatches';

let index = 0

export default class MyDocument extends Document {
  static async getInitialProps ({ renderPage }) {
    AppRegistry.registerComponent('Main', () => Main)
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

          /* form focus */
          input:focus, textarea:focus, select:focus{
            outline: none;
            border-color: ${swatches.textPrimary};
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
          <title>Starter Kit</title>
          <meta name="viewport" content="width=device-width, initial-scale=1 shrink-to-fit=no" />
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

