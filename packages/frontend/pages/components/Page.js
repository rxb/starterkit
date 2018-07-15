import React from 'react';
import Head from 'next/head'
import NProgress from 'nprogress'
import Router from 'next/router'

NProgress.configure({ trickle: true, trickleSpeed: 400, showSpinner: false });

Router.onRouteChangeStart = (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start()
}

Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

import {
  Platform,
  Image,
  View,
  Text as ReactText,
  StyleSheet
} from '../cinderblock/primitives';

import {
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
	Link,
	List,
	Touch,
	Modal,
	Picker,
	Prompt,
	Section,
	Sections,
	Sectionless,
	Stripe,
	Text,
	TextInput
} from '../cinderblock';

import styles from '../cinderblock/styles/styles';
import swatches from '../cinderblock/styles/swatches';


const Page = (props) => {

		const {
			children
		} = props;

		return (

			<View style={{minHeight: '100%'}}>

				<Head>
			      {/* Import CSS for nprogress */}
			      <link rel='stylesheet' type='text/css' href='/static/nprogress.css' />
			    </Head>

				<Header>
					<Link href="/">
						<Inline>
							<Icon shape="FileText" />
							<Text>CINDERBLOCK</Text>
						</Inline>
					</Link>
				</Header>

				<View style={{flex: 1}}>
					{children}
				</View>
				<Stripe style={{
					backgroundColor: swatches.backgroundDark,
					flex: 0,
					minHeight: 0,
					flexBasis: 'auto',
				}}>
					<Sections>
						<Section>
							<Chunk>
								<Text inverted color="secondary">This is the footer</Text>
							</Chunk>
						</Section>
					</Sections>
				</Stripe>

			</View>

		);
}

export default Page;