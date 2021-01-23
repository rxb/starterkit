// SHOW 
// testing cache managers instead of redux y friends
// see showconnect.js and showhooks.js for others


import React, {Fragment, useEffect, useState} from 'react';

import {
	fetcher,
	getShowUrl,
	useShow,
	useShowComments,
	postShowComment
} from '../swr';


// Redux
// leave in for now, replace piece by piece
import {connect, useDispatch, useSelector} from 'react-redux';
import {
	deleteShowComment,
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
import Head from 'next/head';

import { 
	runValidations, 
	readFileAsDataUrl, 
	addToastableErrors 
} from '../components/cinderblock/formUtils';

const CommentForm = (props) => {
	
	const formState = useFormState({ 
		initialFields: { body: '' }
	});

	const submitCommentForm =  async () => {
		const error = runValidations(formState.fields, {
			body: {
				notEmpty: {
					msg: "Comment can't be blank"
				},
				notContains: {
					args: "garbage",
					msg: "No comments about garbage, please!"
				}
			}
		});
		formState.setError(error);

		if(!error){
			formState.setLoading(true);
			const data = { ...formState.fields, showId: props.showData.id };
			await postShowComment(data, props.authentication.token)
				.catch(error => formState.setError(error))
			props.mutate();
			formState.resetFields();
			formState.setLoading(false);
		}
	};

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
				<FieldError error={formState.error?.fieldErrors?.body} />
			</Chunk>
			<Chunk>
				<Button
					onPress={submitCommentForm}
					isLoading={formState.loading}
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
	const { 
		data: showData, 
		error: showError 
	} = useShow(props.showId, props.show); // passing in props.show from getInitialProps
	const { 
		data: showCommentsData, 
		error: showCommentsError, 
		mutate: showCommentsMutate,
		meta: showCommentsMeta
	} = useShowComments(props.showId);


	
	// data from redux
	// todo: remove these
	const dispatch = useDispatch(); 
	const user = useSelector(state => state.user);
	const authentication = useSelector(state => state.authentication);


	// errors - do separate useEffect for each error checking
	useEffect(()=>{
		addToastableErrors(dispatch, showCommentsError, {
			BadRequest: 'Something went wrong',
			GeneralError: 'Something went wrong (GeneralError)',
	});
	},[showCommentsError]);


	return (
		<Page>
			<Head>
				<meta property='og:title' content={`Show: ${showData.title}`} />
				<meta property='og:image' content={showData.photoUrl} />
				<title>{showData.title}</title>
			</Head>

			{/*
				<Stripe image={showData.photoUrl} style={{backgroundColor: '#eee'}}>
				</Stripe>
			*/}

			<Stripe>
				<Bounds>
					<Sections>
						<ImageSnap
							image={showData.photoUrl}
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
										<Text>showId: {props.showId}</Text>
										<Text>isServer: {props.isServer ? 'true' : 'false'}</Text>
									</View>
								</Chunk>
								<Flex>
									<FlexItem>
										
										<Chunk>
											<Text type="pageHead">{showData.title}</Text>

											<Text color="secondary">
												United States &middot;
												1998
												{ showData.genres && showData.genres.map((genre, i)=>(
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
												href={{pathname:'/showedit', query: {showId: showData.id}}}
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
								<Text>{showData.description}</Text>
							</Chunk>
						</Section>
						<Section>
							<Chunk>
								<Text type="sectionHead">Comments</Text>
								<Text>{JSON.stringify(showCommentsMeta)}</Text>
							</Chunk>

							{showCommentsData && showCommentsData.map((comment, i)=>{

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
										showCommentsData={showCommentsData}
										mutate={showCommentsMutate} 
										showData={showData}
										authentication={authentication}
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
	const isServer = !!req;	

	// fetch and pass as props, using in the useSWR as intitialData
	const show = await fetcher(getShowUrl(showId));
	return {
		isServer,
		showId: showId,
		show
	};

}



export default Show;