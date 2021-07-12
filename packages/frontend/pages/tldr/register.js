import React, { Fragment, useState, useEffect, useCallback, useRef, useContext } from 'react';
import ErrorPage from 'next/error'

// SWR
import { request, getUserUrl } from '@/swr';
import useSWR, { mutate } from 'swr';

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addPrompt, addToast, addDelayedToast } from '@/actions';

// URLS
import { getIndexPageUrl, getLoginPageUrl } from '../../components/tldr/urls';

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
	useFormState,
	ThemeContext
} from 'cinderblock';
import Page from 'components/Page';
import TldrHeader from 'components/tldr/TldrHeader';
import Router from 'next/router'
import Head from 'next/head'






// SCREEN-SPECIFIC
import { RegisterForm, RegisterHeader } from 'components/authComponents';


const Register = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

	useEffect(() => {
		if (user) {
			Router.push({ pathname: getIndexPageUrl() })
		}
	}, []);

	return (
		<Page>
			<TldrHeader />
			<Stripe style={{flex: 1}}>
				<Bounds small sparse>
					<Section>
						<Chunk>
							<RegisterHeader toggleHref={getLoginPageUrl()} />
						</Chunk>
					</Section>
					<RegisterForm />
				</Bounds>
			</Stripe>
		</Page>
	);

}

Register.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const { store, req, pathname, query } = context;
	const isServer = !!req;
	return {
		isServer,
	}
}


export default Register;



