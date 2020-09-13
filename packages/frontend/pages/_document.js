import Document, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'

import { BREAKPOINT_SIZES } from '../components/cinderblock/designConstants';

export default class MyDocument extends Document {

  render () {
    return (
      <Html style={{ height: '100%', width: '100%' }}>
        <Head />
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
      </Html>
    )
  }
}

