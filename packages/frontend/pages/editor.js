import React, { Fragment, useState, useEffect, useCallback, useRef, useContext } from 'react';

// SWR
import { request } from '@/swr';
import useSWR, { mutate } from 'swr';

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addPrompt, addToast, addDelayedToast } from '@/actions';

// URLS
import { getIndexPageUrl, getRegisterPageUrl, getRequestPasswordPageUrl } from '@/components/tldr/urls';

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
import TldrHeader from '@/components/tldr/TldrHeader';
import Router from 'next/router'
import Head from 'next/head'


const TestTextInput = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	const handleFocus = () => {
		console.log('start')
	}

	const handleBlur = () => {
		console.log('stop')
	}

	return(
		<View 
			focusable={true}
			style={[styles.input, styles.textInput]}
			onFocus={handleFocus}
			onBlur={handleBlur}
			>

		</View>
	);
}


const Editor = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	const { error } = props;

	const formState = useFormState({
		initialFields: {}
	});

	return (
		<Page>
			<Stripe style={{flex: 1}}>
				<Bounds>
					<Section>
						<Chunk>
							<Text type="pageHead">Editor test</Text>
						</Chunk>
					</Section>
					<Section>
						<Chunk>
							<Label>Dummy</Label>
							<TextInput  
								value={formState.getFieldValue('dummy')}
								onChange={e => formState.setFieldValue('dummy', e.target.value)}
								/>
						</Chunk>
						<Chunk>
							<Label>Demo</Label>
							<TestTextInput 
								value={formState.getFieldValue('demo')}
								onChange={e => formState.setFieldValue('demo', e.target.value)}
								multiline
								numberOfLines={4}
								showCounter={true}
								maxLength={1000}
								/>
						</Chunk>
					</Section>
					<Section border>
						<Chunk>
							<Text>{JSON.stringify(formState.fields)}</Text>
						</Chunk>
					</Section>
				</Bounds>
			</Stripe>
		</Page >
	);


}

Editor.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const { store, req, pathname, query } = context;
	const isServer = !!req;

	return {
		isServer,
	}
}


export default Editor;

