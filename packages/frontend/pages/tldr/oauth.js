import React, { Fragment, useState, useEffect, useCallback, useRef, useContext } from 'react';
import { ActivityIndicator } from 'react-native';

// SWR
import { request, getUserUrl } from '@/swr';
import useSWR, { mutate } from 'swr';

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addPrompt, addToast, addDelayedToast } from '@/actions';

// URLS
import { getIndexPageUrl, getProfileEditPageUrl, getLoginRedirect } from '../../components/tldr/urls';

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
import Page from '@/components/Page';
import TldrHeader from '../../components/tldr/TldrHeader';
import Router from 'next/router'
import Head from 'next/head'






const qs = (params) => "?" + Object.keys(params).map(key => key + '=' + params[key]).join('&');

const Oauth = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	const { error } = props;

	const dispatch = useDispatch();
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user;

	useEffect(() => {
		if (user) {
			if (!user.profileComplete) {
				Router.push({ pathname: getProfileEditPageUrl(), query: { isSignup: true } })
			}
			else {
				const redirect = getLoginRedirect() || { pathname: getIndexPageUrl() };
				Router.push(redirect);
			}
		}
	}, [user]);

	return (
		<Page>
			<TldrHeader />
			<Stripe style={{ flex: 1 }}>
				<Bounds style={{ flex: 1 }}>
					<Section style={{ flex: 1 }}>
						<View style={styles.absoluteCenter}>

							<Chunk>
								<ActivityIndicator
									size="large"
									color={SWATCHES.textHint}
								/>
							</Chunk>


						</View>
					</Section>
				</Bounds>
			</Stripe>
		</Page>
	);
}

Oauth.getInitialProps = async (context) => {

	const { store, req, pathname, query } = context;
	const isServer = !!req;

	return {
		isServer
	};

}

export default Oauth;