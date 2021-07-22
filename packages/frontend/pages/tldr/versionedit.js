import React, { Fragment, useState, useCallback, useEffect, useRef, useContext } from 'react';
import ErrorPage from 'next/error'

// SWR
import { request, getTldrUrl } from '@/swr';
import useSWR, { mutate } from 'swr';

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addPrompt, addToast, addDelayedToast } from '@/actions';

// URLS
import { getProfilePageUrl, getTldrPageUrl } from '../../components/tldr/urls';

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
	Section,
	Sectionless,
	Stripe,
	Tabs,
	Text,
	TextInput,
	Touch,
	View,
	useFormState,
	useMediaContext,
	ThemeContext
} from 'cinderblock';
import Page from '@/components/Page';
import TldrHeader from '@/components/tldr/TldrHeader';
import { TldrCardSmall, TldrCard, LoadingPage } from '@/components/tldr/components';
import Router from 'next/router'
import Head from 'next/head'



// SCREEN-SPECIFIC
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const inputJoinedTop = {
	marginBottom: 0,
	borderBottomLeftRadius: 0,
	borderBottomRightRadius: 0,
	zIndex: 1
};
const inputJoinedBottom = {
	marginTop: -1,
	borderTopLeftRadius: 0,
	borderTopRightRadius: 0,
	zIndex: 1
};

const parseDraftContent = (fields) => {
	return {
		title: fields.title,
		blurb: fields.blurb,
		steps: fields.steps.map(item => {
			delete item.id
			return item;
		}).filter(item => (item.head && item.head.length || item.body && item.body.length))
	}
};


function VersionEdit(props) {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

	const dispatch = useDispatch();

	const { tldr } = props;
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};
	const [previewVersion, setPreviewVersion] = useState({
		version: (tldr.versionsUsedCount + 1),
		content: tldr.draftContent
	});
	const [selectedTab, setSelectedTab] = useState('edit');


	// give existing steps ids (required for drag and drop)
	// and pad out blank steps so there are min 3
	const initialSteps = tldr.draftContent?.steps.map((step, i) => ({ ...step, stepid: i })) || [];
	for (let i = initialSteps.length; i < 3; i++) {
		initialSteps.push({ stepid: i });
	}
	const [stepCursor, setStepCursor] = useState(initialSteps.length);

	const formState = useFormState({
		initialFields: {
			...tldr.draftContent,
			steps: initialSteps,
			id: tldr.id,
			publish: false
		},
		toastableErrors: {
			BadRequest: 'Something went wrong',
			NotAuthenticated: 'Not signed in'
		},
		onChange: fields => {
			const content = parseDraftContent(fields)
			setPreviewVersion({
				...previewVersion,
				content: content
			})
		},
		addToast: msg => dispatch(addToast(msg))
	})

	const moveStep = (dragIndex, hoverIndex) => {
		const dragItem = formState.getFieldValue('steps')[dragIndex];
		const newSteps = [...formState.getFieldValue('steps')];
		newSteps.splice(dragIndex, 1);
		newSteps.splice(hoverIndex, 0, dragItem);
		formState.setFieldValue('steps', newSteps);
	};

	const submitForm = async (finalFields = {}) => {
		// state set is async, so while we're settings them setFields, we don't know when they'll update
		// so for this function, we'll use a local copy, manually updated.
		formState.setFieldValues(finalFields);

		const patchFields = {
			...finalFields,
			id: tldr.id,
			draftContent: parseDraftContent(formState.fields)
		}

		formState.setLoading(true);
		try {
			await request(getTldrUrl(tldr.id), {
				method: 'PATCH',
				data: patchFields,
				token: authentication.accessToken
			});
			const toastMessage = (patchFields.publish) ? "New TLDR version published!" : "TLDR draft saved!"
			dispatch(addDelayedToast(toastMessage));
			const nextPath = (tldr.currentTldrVersionId == undefined && !patchFields.publish) ?
				// if saving draft on a card that has never been published
				// redirect to profile... that's the only place it lives until 1st publish
				{ pathname: getProfilePageUrl(), query: { userId: user.id } } :
				{ pathname: getTldrPageUrl(), query: { tldrId: tldr.id } };
			Router.push(nextPath);
		}
		catch (error) {
			console.log(error);
			formState.setError(error);
			formState.setLoading(false);
		}
	}

	// DIVERT TO ERROR PAGE
	// not logged in or trying to edit something I don't own
	if (!authentication.user || (tldr && tldr.authorId && user.id && (tldr.authorId != user.id)) ) {
		if (authentication.loading) {
			return <LoadingPage />;
		}
		else{
			return <ErrorPage statusCode={401} />;
		}
	}

	// RENDER
	return (
		<Page>
			<TldrHeader />
			<Head>
				<title>Edit tldr</title>
			</Head>
			<Stripe>
				<Bounds large>
					<Section>
						<Text type="pageHead">Edit card</Text>
					</Section>
				</Bounds>
				<Sticky>
					<Bounds large>
						<Section>
							<Tabs
								selectedValue={selectedTab}
								onChange={value => setSelectedTab(value)}
							>
								<Tabs.Item
									label="Edit"
									value="edit"
								/>
								<Tabs.Item
									label="Preview"
									value="preview"
								/>
							</Tabs>
						</Section>
					</Bounds>
				</Sticky>

				<Bounds large>
					<form>

						<Section>

							{(selectedTab == 'edit') &&
								<>
									<Chunk>
										<TextInput
											style={[styles.textPageHead, inputJoinedTop]}
											id="title"
											placeholder="Title"
											value={formState.getFieldValue('title')}
											onChange={e => formState.setFieldValue('title', e.target.value)}
										/>
										<FieldError error={formState.error?.fieldErrors?.title} />
										<TextInput
											style={[{ fontStyle: 'italic' }, inputJoinedBottom]}
											id="blurb"
											placeholder="Short description"
											value={formState.getFieldValue('blurb')}
											onChange={e => formState.setFieldValue('blurb', e.target.value)}
										/>
										<FieldError error={formState.error?.fieldErrors?.blurb} />
									</Chunk>

									<DndProvider backend={HTML5Backend}>
										{formState.getFieldValue('steps')?.map((item, i) => (
											<Reorderable key={item.stepid} index={i} id={item.stepid} moveItem={moveStep}>
												<Chunk>
													<View
														style={{ paddingLeft: 11 }}
													>
														<View
															style={{
																position: 'absolute',
																top: 8,
																bottom: 8,
																left: 0,
																width: 6,
																backgroundColor: SWATCHES.tint,
																opacity: .25,
																borderRadius: 4,
																cursor: 'pointer'
															}}
														/>
														<TextInput
															style={[styles.textBig, inputJoinedTop]}
															id={`step${i}head`}
															value={item.head}
															multiline
															placeholder="Bulletpoint headline"
															onChange={e => formState.setFieldValue('steps', [
																...formState.getFieldValue('steps').slice(0, i),
																{ ...item, head: e.target.value },
																...formState.getFieldValue('steps').slice(i + 1)
															])}
														/>
														<TextInput
															style={[inputJoinedBottom]}
															id={`step${i}body`}
															value={item.body}
															multiline
															placeholder="Bulletpoint description"
															onChange={e => formState.setFieldValue('steps', [
																...formState.getFieldValue('steps').slice(0, i),
																{ ...item, body: e.target.value },
																...formState.getFieldValue('steps').slice(i + 1)
															])}
														/>
													</View>
												</Chunk>
											</Reorderable>
										))}
									</DndProvider>

									<Touch onPress={() => {
										formState.setFieldValue('steps', [
											...formState.getFieldValue('steps'),
											{ title: '', body: '', stepid: (stepCursor + 1) },
										])
										setStepCursor(stepCursor + 1);
									}}>
										<Chunk inline>
											<Icon shape="PlusCircle" />
											<Text> Add new item</Text>
										</Chunk>
									</Touch>
								</>

							}

							{(selectedTab == 'preview') &&
									<Chunk>
										<TldrCard
											tldr={tldr}
											thisVersion={previewVersion}
										/>
									</Chunk>
							}
						</Section>

						<Section>
							<Chunk border>
								<Flex >
									<FlexItem shrink>
										<Button
											color="secondary"
											label="Save as draft"
											isLoading={formState.loading && !formState.getFieldValue('publish')}
											onPress={() => {
												submitForm({ publish: false });
											}}
										/>
									</FlexItem>
									<FlexItem shrink>
										<Button
											color="primary"
											label={(tldr.currentTldrVersionId == undefined) ? 'Publish card' : `Publish as new version (v ${previewVersion.version})`}
											isLoading={formState.loading && formState.getFieldValue('publish')}
											onPress={() => {
												submitForm({ publish: true });
											}}
										/>
									</FlexItem>
								</Flex>
							</Chunk>

							{/*
								<Chunk>
									<Text>{JSON.stringify(tldr)}</Text>
								</Chunk>
								*/}

						</Section>
					</form>

				</Bounds>
			</Stripe>
		</Page>
	);

}

VersionEdit.getInitialProps = async (context) => {
	const { store, isServer, pathname, query } = context;
	const tldrId = query.tldrId; // query params become lowercase
	const tldr = await request(getTldrUrl(tldrId));
	return {
		tldrId,
		tldr
	}
}

export default VersionEdit;

import { useInView } from 'react-intersection-observer';
const Sticky = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	const media = useMediaContext();
	const [ref, inView, entry] = useInView({ threshold: 1 });

	// TODO: 
	// the compensation for stripe padding feels a little hacky but whatever
	// fix it later
	const stickyStyle = {
		backgroundColor: 'white',
		zIndex: 2,
		position: 'sticky',
		top: -1,
		marginBottom: METRICS.space
	}
	const stickyStyleShadow = {
		shadowRadius: 16,
		shadowColor: 'rgba(0,0,0,.15)',
	}
	const stickyStyleMedium = {
		marginHorizontal: -1 * METRICS.space,
		paddingHorizontal: METRICS.space
	}

	return (
		<View
			ref={ref}
			style={[
				stickyStyle,
				(!inView) ? stickyStyleShadow : {},
				(!inView && media.medium) ? stickyStyleMedium : {}
			]}
		>
			{props.children}
		</View>
	);
}

