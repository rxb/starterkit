import React, { Fragment, useState, useEffect, useCallback, useRef } from 'react';

// SWR
import { request } from '@/swr';
import useSWR, { mutate } from 'swr';

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addPrompt, addToast, addDelayedToast } from '@/actions';

// URLS
import { getIndexPageUrl, getRegisterPageUrl, getRequestPasswordPageUrl } from 'components/tldr/urls';

// COMPONENTS
import {
   Avatar,
   Bounds,
   Button,
   Card,
   CheckBox,
   Chunk,
   FakeInput,
   FieldError,
   Flex,
   FlexItem,
   FileInput,
   Icon,
   Inline,
   Image,
   Label,
   List,
   Link,
   Modal,
   Picker,
   Reorderable,
   RevealBlock,
   Section,
   Sectionless,
   Stripe,
   Text,
   TextInput,
   Touch,
   View,
   useFormState
} from 'modules/cinderblock';
import Page from 'components/Page';
import TldrHeader from 'components/tldr/TldrHeader';
import Router from 'next/router'
import Head from 'next/head'


// STYLE
import styles from 'modules/cinderblock/styles/styles';
import swatches from 'modules/cinderblock/styles/swatches';
import { METRICS, EASE } from 'modules/cinderblock/designConstants';

// SCREEN-SPECIFIC
import { LoginForm, LoginHeader } from 'components/authComponents';


const Login = (props) => {

   const authentication = useSelector(state => state.authentication);
   const user = authentication.user || {};

   useEffect(()=>{
      if(user){
         Router.push({pathname: getIndexPageUrl()})
      }
   }, []);

   const { error } = props;

   return (
      <Page>
         <TldrHeader />
         <Stripe>
            <Bounds style={{ maxWidth: 480 }}>

               {!error &&
                  <Section>
                     <Chunk>
                        <LoginHeader toggleHref={getRegisterPageUrl()} />
                     </Chunk>
                  </Section>
               }

               {error &&
                  <Section>
                     <Chunk>
                        <Text type="pageHead">Hmmm...</Text>
                     </Chunk>

                     {error == 'oauth' &&
                        <>
                        <Chunk>
                           <Text>Sorry, that didn't work. It's possible you set up your account using a different method. You can <Link href={getRequestPasswordPageUrl()}><Text color="tint">reset your password</Text></Link> if you don't remember it.</Text>
                        </Chunk>
                        </>
                     }
                     {error != 'oauth' &&
                        <Chunk>
                           <Text>Sorry, something didn't work out with that sign in.</Text>
                        </Chunk>
                     }

                  </Section>
               }

               <LoginForm  />

            </Bounds>
         </Stripe>
      </Page >
   );


}

Login.getInitialProps = async (context) => {
   // next router query bits only initially available to getInitialProps
   const { store, req, pathname, query } = context;
   const isServer = !!req;
   const error = query.error;

   return {
      isServer,
      error
   }
}


export default Login;



