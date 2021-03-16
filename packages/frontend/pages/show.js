import React, {Fragment, useEffect, useState} from 'react';

// SWR
import {
	request,
	parsePageObj,
	getShowUrl,
	getShowCommentUrl,
	getShowCommentsUrl
} from '../swr';
import useSWR, { cache }  from 'swr';

// REDUX
import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast } from '../actions';

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
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch,
	View,
	useFormState
} from '../components/cinderblock';
import CinderblockPage from '../components/CinderblockPage';
import Head from 'next/head';

// STYLE
import swatches from '../components/cinderblock/styles/swatches';
import { METRICS } from '../components/cinderblock/designConstants';


// SCREEN-SPECIFIC
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import { 
	runValidations, 
	readFileAsDataUrl, 
	addToastableErrors 
} from '../components/cinderblock/utils';

// keep big functions outside of render

const submitCommentForm =  async (formState, props) => {
	
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
		const oldShowCommentsData = cache.get(props.showCommentsKey); // get cache
		const oldFields = {...formState.fields};
		const newItemData = { ...formState.fields, showId: props.showData.id };
		props.mutate({ 
			...oldShowCommentsData, 
			data: [...oldShowCommentsData.data, {
				...newItemData, 
				user: props.user
			}] 
		}, false); // optimistic mutate
		try{
			formState.resetFields();
			await request( getShowCommentUrl(), {
				method: 'POST', 
				data: newItemData,
				token: props.authentication.accessToken
			});
			props.mutate(); // trigger refresh from server
		} 
		catch(error) {
			formState.setError(error); // display server errors
			formState.setFieldValues(oldFields); // rollback formstate (in this, fields were reset)
			props.mutate(oldShowCommentsData); // rollback optimistic mutate
		} 
	}
};


const CommentForm = (props) => {
	
	const formState = useFormState({ 
		initialFields: { body: '' }
	});

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
					onPress={ () => submitCommentForm(formState, props) }
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
		authentication,
		onRequestClose,
		onCompleteClose
	} = props;
	
	const [loading, setLoading] = useState(false);

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
					onPress={async ()=>{
						try{
							setLoading(true);
							await request( getShowCommentUrl(comment.id), {
								method: 'DELETE', 
								token: authentication.accessToken
							});
							props.mutate();
							onRequestClose();
						} 
						catch(error){
							alert(JSON.stringify(error));
						}
						finally{
							setLoading(false);
						}
					}}
					label="Yes I'm sure"
					width="full"
					isLoading={loading}
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

	const dispatch = useDispatch(); 
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

	const show = useSWR(getShowUrl(props.showId), {initialData: props.show}); // passing from getInitialProps
	const {data: showData = {}, error: showError, mutate: showMutate} = show;
	
	const showCommentsKey = getShowCommentsUrl({showId: props.showId, $limit: 50});
	const showComments = useSWR(showCommentsKey);
	const { data: showCommentsData, error: showCommentsError, mutate: showCommentsMutate, meta: showCommentsMeta } = parsePageObj(showComments);

	// errors - do separate useEffect for each error checking
	useEffect(()=>{
		addToastableErrors(dispatch, showCommentsError, {
			BadRequest: 'Something went wrong',
			GeneralError: 'Something went wrong (GeneralError)',
	});
	},[showCommentsError]);

	return (
		<CinderblockPage>
			<Head>
				<meta property='og:title' content={`Show: ${showData.title}`} />
				<meta property='og:image' content={showData.photoUrl} />
				<title>{showData.title}</title>
			</Head>

			<Stripe>
				<Bounds>
						<ImageSnap
							image={showData.photoUrl}
							style={{backgroundColor: swatches.shade}}
							/>
		
							<Section>
								<Flex>
									<FlexItem>
										
										<Chunk>
											<Text type="pageHead">{showData.title}</Text>

											<Text color="secondary">
												United States &middot;
												1998
												{ showData.genres && showData.genres.map((genre, i)=>(
													<Fragment key={i}> &middot; {genre}</Fragment>
												))}
											</Text>
										</Chunk>
									</FlexItem>
									{user.id && 
										<FlexItem
											shrink
											align="center"
											justify="center"
											>
											<Chunk>
												<Button
													href={{pathname:'/showedit', query: {showId: showData.id}}}
													shape="Edit"
													label="Edit"
													color="secondary"
													variant={{
														small: 'iconOnly',
														large: 'shrink'
													}}
													/>
											</Chunk>
										</FlexItem>
									}
								</Flex>
						</Section>
						<Section>
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
													style={{marginBottom: METRICS.pseudoLineHeight}}
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
																		authentication={authentication}
																		comment={comment}
																		mutate={showCommentsMutate}
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
										showData={showData}
										authentication={authentication}
										user={user}
										mutate={showCommentsMutate} 
										showCommentsKey={showCommentsKey}
										/>
								</Fragment>
							}

						</Section>
						<Section>
								<Chunk>
									<View style={{backgroundColor: 'pink', padding: METRICS.space}}>
										<Text>showId: {props.showId}</Text>
										<Text>isServer: {props.isServer ? 'true' : 'false'}</Text>
									</View>
								</Chunk>
						</Section>

				</Bounds>
			</Stripe>
		</CinderblockPage>
	);

}

Show.getInitialProps = async (context) => {

	// next router query bits only initially available to getInitialProps
	const {store, req, pathname, query} = context;
	const showId = query.showId;
	const isServer = !!req;	

	// fetch and pass as props during SSR, using in the useSWR as intitialData
	const show = (isServer) ? await request( getShowUrl(showId) ) : undefined;

	return {
		isServer,
		showId: showId,
		show
	};

}



export default Show;