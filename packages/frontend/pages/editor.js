import React, { Fragment, useState, useEffect, useCallback, useRef, useContext } from 'react';
import ContentEditable from "react-contenteditable";


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
							<View style={styles.input}>
							<ContentEditable
								style={{fontWeight: 800, fontSize: 32}}
								tagName="p"
								html={formState.getFieldValue('title')} // innerHTML of the editable div
								onChange={e => formState.setFieldValue('title', e.target.value)} // handle innerHTML change
								placeholder="This is the title"
								/>
							<ContentEditable
								style={{fontStyle: 'italic'}}
								tagName="p"
								html={formState.getFieldValue('subtitle')} // innerHTML of the editable div
								onChange={e => formState.setFieldValue('subtitle', e.target.value)} // handle innerHTML change
								placeholder="This is the subtitle"
								/>
							<ContentEditable
								style={{fontWeight: 600}}
								tagName="p"
								html={formState.getFieldValue('head1')} // innerHTML of the editable div
								onChange={e => formState.setFieldValue('head1', e.target.value)} // handle innerHTML change
								placeholder="Item 1 headline"
								/>
							<ContentEditable
								tagName="p"
								html={formState.getFieldValue('details1')} // innerHTML of the editable div
								onChange={e => formState.setFieldValue('details1', e.target.value)} // handle innerHTML change
								placeholder="Item 1 details"
								/>	
							</View>
				
						</Chunk>
					</Section>
					<Section>
						<Chunk>
							<View style={styles.input}>
							<TextInput
								style={{fontWeight: 800, fontSize: 32, marginBottom: 20}}
								value={formState.getFieldValue('title')} // innerHTML of the editable div
								onChange={e => formState.setFieldValue('title', e.target.value)} // handle innerHTML change
								placeholder="This is the title"
								/>
							<TextInput
								style={{fontStyle: 'italic', marginBottom: 20}}
								value={formState.getFieldValue('subtitle')} // innerHTML of the editable div
								onChange={e => formState.setFieldValue('subtitle', e.target.value)} // handle innerHTML change
								placeholder="This is the subtitle"
								/>
							<View 
								focusable={true}
								style={styles.input}
								>
									what
							</View>
							<textarea>
								kjdslfkjdslk
							</textarea>
							</View>
				
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

