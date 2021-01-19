// SHOW 
// testing react hooks
// see showconnect.js for the old way

import React, {Fragment, useEffect, useState} from 'react';

import Head from 'next/head';



import {connect, useDispatch, useSelector} from 'react-redux';
import {
	fetchShow,
	createShowComment,
	deleteShowComment,
	fetchShowComments,
	updateErrorShowComment,
	addPrompt,
	addToast
} from '../actions';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import swatches from '../components/cinderblock/styles/swatches';
import { METRICS } from '../components/cinderblock/designConstants';
import {
	Avatar,
	Bounds,
	Button,
	Card,
	CheckBox,
	Chunk,
	FieldError,
	Flex,
	FlexItem,
	Icon,
	Inline,
	Image,
	ImageSnap,
	Label,
	List,
	Link,
	Modal,
	Picker,
	Section,
	Sections,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch,
	View,
	useFormState
} from '../components/cinderblock';
import Page from '../components/Page';

import { runValidations, readFileAsDataUrl, checkToastableErrors } from '../components/cinderblock/formUtils';



const CommentForm = (props) => {

	const formState = useFormState(props);

	return(
		<form>
			<Chunk>
				<TextInput
					id="body"
					value={formState.getFieldValue('body')}
					onChange={e => formState.setFieldValue('body', e.target.value)}
					placeholder="Post a comment about this show"
					autoComplete="off"
					multiline={true}
					showCounter={true}
					numberOfLines={4}
					maxLength={1000}
					/>
				<FieldError error={formState.fieldErrors.body} />
			</Chunk>
			<Chunk>
				<Button
					onPress={formState.handleSubmit}
					label="Post Comment"
					/>
			</Chunk>
		</form>
	);
};


const DeletePrompt = (props) => {
	const {
		comment,
		deleteShowComment,
		onRequestClose,
		onCompleteClose
	} = props;
	return (
		<Sectionless>
			<Chunk>
				<Text type="sectionHead">Are you sure?</Text>
			</Chunk>
			<Chunk>
				<Text>Deleting your comment {comment.id}</Text>
			</Chunk>
			<Chunk>
				<Button
					onPress={()=>{
						deleteShowComment(comment.id);
						onRequestClose(()=>{
							alert('yes!');
						});
					}}
					label="Yes I'm sure"
					width="full"
					/>
				<Button
					onPress={()=>{
						onRequestClose();
					}}
					label="No thanks"
					color="secondary"
					width="full"
					/>
			</Chunk>

		</Sectionless>
	)
};



function Show(props) {

	// data from redux
	const dispatch = useDispatch(); 
	const show = useSelector(state => state.show);
	const showComments = useSelector(state => state.showComments);
	const user = useSelector(state => state.user);


	// mount / fetch
	useEffect(()=>{
		dispatch(fetchShowComments({showId: props.showId}));
	}, []);


	// errors - do separate useEffect for each error checking
	useEffect(()=>{
		addToastableErrors(dispatch, showComments, {
			BadRequest: 'Something went wrong',
			GeneralError: 'Something went wrong (GeneralError)',
	});
	},[showComments]);

	const { showId } = props;

	return (
		<Page>
			<Head>
				<meta property='og:title' content={`Show: ${show.item.title}`} />
				<meta property='og:image' content={show.item.photoUrl} />
				<title>{show.item.title}</title>
			</Head>

			{/*
				<Stripe image={show.item.photoUrl} style={{backgroundColor: '#eee'}}>
				</Stripe>
			*/}

			<Stripe>
				<Bounds>
					<Sections>
						<ImageSnap
							image={show.item.photoUrl}
							/>
						<Section>
							<View style={{
								/*
								borderBottomWidth: 1,
								borderBottomColor: swatches.border
								*/
							}}>
								<Chunk>
									<View style={{backgroundColor: 'pink', padding: METRICS.space}}>
										<Text>showId: {showId}</Text>
										<Text>isServer: {props.isServer ? 'true' : 'false'}</Text>
									</View>
								</Chunk>
								<Flex>
									<FlexItem>
										
										<Chunk>
											<Text type="pageHead">{show.item.title}</Text>

											<Text color="secondary">
												United States &middot;
												1998
												{ show.item.genres && show.item.genres.map((genre, i)=>(
													<Fragment> &middot; {genre}</Fragment>
												))}
											</Text>
										</Chunk>
									</FlexItem>
									<FlexItem
										shrink
										style={{justifyContent: 'flex-end'}}
										>
										<Chunk>
											<Button
												href={{pathname:'/showedit', query: {showId: show.item.id}}}
												shape="Edit"
												label="Edit show"
												color="secondary"
												variant={{
													small: 'iconOnly',
													large: 'shrink'
												}}
												/>
										</Chunk>
									</FlexItem>
								</Flex>
							</View>
					

							<Chunk>
								<Text>{show.item.description}</Text>
							</Chunk>
						</Section>
						<Section>
							<Chunk>
								<Text type="sectionHead">Comments</Text>
							</Chunk>

							{showComments.items && showComments.items.map((comment, i)=>{

								comment.user = comment.user || {};
								return (
									<Chunk key={i} style={{...(comment.optimistic ? {opacity:.5} : {}) }}>
										<Flex>
											<FlexItem shrink>
												<Avatar
													source={{uri: comment.user.photoUrl}}
													size="medium"
													/>
											</FlexItem>
											<FlexItem>
												<Text>{comment.body}</Text>
												<Text>
													<Text type="small" color="secondary">{comment.user.name} </Text>
													<Text type="small" color="hint">&middot; {dayjs(comment.createdAt).fromNow()} </Text>
													{ comment.user.id == user.id &&
														<Fragment>
															<Link onPress={()=>{
																dispatch(addPrompt(
																	<DeletePrompt
																		comment={comment}
																		deleteShowComment={dispatch(deleteShowComment)}
																		/>
																));
															}}>
																<Text type="small" color="hint">&middot; Delete</Text>
															</Link>
														</Fragment>
													}
												</Text>
											</FlexItem>
										</Flex>
									</Chunk>
								);
							})}

							{user.id &&
								<Fragment>
									<CommentForm
										initialFields={{
											body: ''
										}}
										fieldErrors={showComments.error.fieldErrors}
										onSubmit={ (fields, context) => {
											const validators = {
												body: {
													notEmpty: {
														msg: "Comment can't be blank"
													},
													notContains: {
														args: "garbage",
														msg: "No comments about garbage, please!"
													}
												}
												}
												const error = runValidations(fields, validators);
												dispatch(updateErrorShowComment(error));

												if(!error.errorCount){
												const data = { ...fields, showId: show.id };
												dispatch(createShowComment(data, { user: user } ));
												context.resetFields();
											}
										}}
										/>
								</Fragment>
							}

						</Section>
					</Sections>
				</Bounds>
			</Stripe>
		</Page>
	);

}

Show.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const {store, req, pathname, query} = context;
	const showId = query.showId;
	const response = await store.dispatch(fetchShow(showId));

	const isServer = !!req;	
	return {
		isServer,
		showId: showId,
	};
}



export default Show;