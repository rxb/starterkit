import React, { Fragment, useContext, useState, useEffect } from 'react';
import ErrorPage from 'next/error'

// SWR
import { request, pageHelper, getTldrUrl, getIssueUrl, getIssueCommentsUrl, getIssueCommentUrl } from '@/swr';
import useSWR, { useSWRInfinite, mutate, cache } from 'swr';

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addPrompt, addToast, updateUi } from '@/actions';

// URLS
import { getTldrPageUrl, getIssuePageUrl, getIssuesPageUrl } from '@/components/tldr/urls';

// COMPONENTS
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
	Header,
	Icon,
	Inline,
	Image,
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
	useFormState,
	useMediaContext,
	View,
	ThemeContext
} from 'cinderblock';
import Page from '@/components/Page';
import TldrHeader from '@/components/tldr/TldrHeader';
import { LoadMoreButton, Emptiness, Tag, IssueStatusIcon, ISSUE_STATUS, ISSUE_STATUS_KEYS, ISSUE_TYPES } from '@/components/tldr/components';


// SCREEN-SPECIFIC 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime).extend(localizedFormat);
import { Utils } from 'cinderblock';
const { runValidations, readFileAsDataUrl } = Utils;


const submitCommentForm = async (formState, props, extraFields) => {

	// TODO: consider optimistic posting
	// There are currently issues for useSWRInfinite
	// https://github.com/vercel/swr/discussions/582
	// https://github.com/vercel/swr/issues/1156
	// Github handles extremely long issues by collapsing the middle, which makes sense
	// Read how the issue came up, then read where the issue is now 
	// (only expand the messy middle if needed)
	// To me that sounds like two separate requests:
	// 1. the newest 20 comments. this is a regular swr, not infinite and can be optimistically added to
	// 2. the oldest 20 comments. this is an infinite swr that keeps adding pages until it meets #1

	const { statusChange } = extraFields || {};

	const {
		dispatch,
		issue,
		issueComments,
		issueCommentsKey,
		authentication,
		user
	} = props;

	const error = runValidations(formState.fields, {
		body: {
			notEmpty: {
				msg: statusChange ? "Add a reason in the comment" : "Comment can't be blank"
			}
		}
	});
	formState.setError(error);

	if (!error) {
		const oldIssueCommentsData = cache.get(issueCommentsKey); // get cache
		const oldFields = { ...formState.fields };
		const newItemData = { ...formState.fields, issueId: issue.data.id, type: statusChange };
		const newIssueCommentsData = {
			...oldIssueCommentsData,
			items: [{
				...newItemData,
				author: user
			}, ...oldIssueCommentsData.items]
		}
		mutate(issueCommentsKey, newIssueCommentsData, false); // optimistic mutate

		try {
			// post comment
			formState.resetFields();
			await request(getIssueCommentUrl(), {
				method: 'POST',
				data: newItemData,
				token: authentication.accessToken
			});
			mutate(issueCommentsKey); // trigger refresh from server

			// optionally close issue
			if (statusChange) {
				await request(getIssueUrl(issue.data.id), {
					method: 'PATCH',
					data: { status: statusChange },
					token: authentication.accessToken
				});
				issue.mutate();
			}
		}
		catch (error) {
			formState.setError(error); // display server errors
			formState.setFieldValues(oldFields); // rollback formstate (in this, fields were reset)
			issueComments.mutate(oldIssueCommentsData); // rollback optimistic mutate
		}

	}
};

const CommentForm = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	const { user, issue } = props;

	const formState = useFormState({
		initialFields: { body: '' }
	});

	const canChangeStatus = user.id && user.id == issue.data.authorId;

	return (
		<form>
			<Chunk>
				<TextInput
					id="body"
					value={formState.getFieldValue('body')}
					onChange={e => formState.setFieldValue('body', e.target.value)}
					autoComplete="off"
					multiline={true}
					showCounter={true}
					numberOfLines={4}
					maxLength={1000}
				/>
				<FieldError error={formState.error?.fieldErrors?.body} />

				<Inline>
					<Button
						onPress={() => submitCommentForm(formState, props)}
						isLoading={formState.loading}
						label="Post comment"
					/>{canChangeStatus && issue.data.status == ISSUE_STATUS_KEYS.OPEN &&
						<Button
							color="secondary"
							onPress={() => submitCommentForm(formState, props, { statusChange: ISSUE_STATUS_KEYS.CLOSED })}
							isLoading={formState.loading}
							label="Close this issue"
						/>
					}{canChangeStatus && issue.data.status == ISSUE_STATUS_KEYS.CLOSED &&
						<Button
							color="secondary"
							onPress={() => submitCommentForm(formState, props, { statusChange: ISSUE_STATUS_KEYS.OPEN })}
							isLoading={formState.loading}
							label="Reopen this issue"
						/>
					}
				</Inline>
			</Chunk>
		</form>
	);
};

const renderComment = (item, i) => {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);
	return (
		<Chunk key={i}>

			<Flex>
				<FlexItem shrink>
					<Avatar
						source={{ uri: item.author.photoUrl }}
						style={{ marginBottom: METRICS.pseudoLineHeight }}
						size="small"
					/>
				</FlexItem>
				<FlexItem>
					<Text weight="strong" type="small">{item.author.name} </Text>
					{item.type &&
						<View style={{ alignSelf: 'flex-start', paddingHorizontal: 5, marginTop: 3, borderRadius: 3, backgroundColor: ISSUE_STATUS[item.type].color }}>
							<Text type="micro" weight="bold" inverted>
								{`Issue ${ISSUE_STATUS[item.type].pastVerb}`.toUpperCase()}
							</Text>
						</View>
					}
					<Text>{item.body}</Text>
				</FlexItem>
				<FlexItem shrink>
					<Text nowrap type="small" color="hint">{dayjs(item.createdAt).fromNow()}</Text>
				</FlexItem>
			</Flex>
		</Chunk>
	);
}


function Issue(props) {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

	const { issueId } = props;

	const dispatch = useDispatch();
	const ui = useSelector(state => state.ui);
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user;

	// ISSUE
	const issue = useSWR(getIssueUrl(issueId));
	const tldr = useSWR(issue.data?.tldrId ? getTldrUrl(issue.data.tldrId) : null);

	// ISSUE COMMENTS
	const PAGE_SIZE = 12;

	// most recent page
	const issueCommentsKey = [getIssueCommentsUrl({ issueId, $limit: PAGE_SIZE, "$sort[createdAt]": -1 }), authentication.accessToken];
	const issueComments = useSWR(issueCommentsKey);
	const [issueCommentsData, setIssueCommentsData] = useState();
	useEffect(() => {
		const items = issueComments.data?.items || [];
		setIssueCommentsData([...items].reverse())
	}, [issueComments]);

	// if needed, backfill
	// starting at oldest, infinite to "most recent page"
	const needsBackfill = (issueComments.data && issueComments.data.total > PAGE_SIZE);
	const nins = issueComments.data?.items.map(item => item.id);
	const backfillIssueComments = pageHelper(useSWRInfinite(needsBackfill ? (index) => [getIssueCommentsUrl({ issueId, $limit: PAGE_SIZE, $skip: PAGE_SIZE * index, "id[$nin]": nins }), authentication.accessToken] : null));
	const hiddenCommentsCount = (needsBackfill) ? backfillIssueComments.total - backfillIssueComments.data?.length * backfillIssueComments.pageSize : 0;

	// DIVERT TO ERROR PAGE
	// error from getInitialProps or the swr
	if (issueComments.error || issue.error) {
		const error = issueComments.error || issue.error;
		return <ErrorPage statusCode={error.code} />
	}

	return (
		<Page>
			<TldrHeader />

			{issue.data && tldr.data &&
				<>

					<Stripe style={{ flex: 1 }}>
						<Bounds>

							<Flex direction="column" switchDirection="large" reverseSwitchDirection>
								<FlexItem growFactor={2}>
									<Section>
										<Chunk>
											<Card style={{ backgroundColor: SWATCHES.notwhite }}>
												<Sectionless>
													<Chunk>
														<Flex>
															<FlexItem>
																<Text type="small" color="secondary">Current status:</Text>
																<Text weight="strong">{ISSUE_STATUS[issue.data.status].label}</Text>
															</FlexItem>
															<FlexItem shrink justify="center">
																<IssueStatusIcon
																	size="small"
																	status={issue.data.status}
																/>
															</FlexItem>
														</Flex>
													</Chunk>
												</Sectionless>
											</Card>
										</Chunk>
									</Section>
								</FlexItem>


								<FlexItem growFactor={5}>
									<Section>
										<Chunk>
											<Text type="small" color="secondary">
												<Link href={getTldrPageUrl({ tldrId: tldr.data.id })}>
													{tldr.data.author.urlKey}/{tldr.data.urlKey}
												</Link>
												&nbsp;&raquo;&nbsp;
												<Link href={getIssuesPageUrl({ tldrId: tldr.data.id })}>
													issues
												</Link>
											</Text>
											<Text type="pageHead">{issue.data.title}</Text>
											<Tag
												label={ISSUE_TYPES[issue.data.type].label}
												size="small"
											/>

										</Chunk>

										<Chunk>

											<Text>{issue.data.body}</Text>
										</Chunk>
										<Flex>
											<FlexItem shrink>
												<Chunk>
													<Avatar
														source={{ uri: issue.data.author.photoUrl }}
														style={{ marginBottom: METRICS.pseudoLineHeight }}
														size="medium"
													/>
												</Chunk>
											</FlexItem>
											<FlexItem>
												<Chunk>
													<Text weight="strong">opened by {issue.data.author.name}</Text>
													<Text color="secondary" type="small">{dayjs(issue.data.createdAt).fromNow()}</Text>
												</Chunk>
											</FlexItem>
										</Flex>

									</Section>

									<Section border>
										{backfillIssueComments?.total > 0 &&
											<View style={{ /*backgroundColor: 'pink'*/ }}>
												<List
													variant="linear"
													paginated={true}
													items={backfillIssueComments.data}
													renderItem={renderComment}
												/>
												<LoadMoreButton
													style={{
														borderTopWidth: 1,
														borderTopColor: SWATCHES.borderSecondary,
														//alignItems: 'center',
														paddingTop: METRICS.space,
														//backgroundColor: SWATCHES.notwhite,
													}}
													label={`Expand ${hiddenCommentsCount} comments`}
													swr={backfillIssueComments}
													size="small"
												/>
											</View>
										}

										{issueCommentsData &&
											<List
												linearFirstChildPlain={!needsBackfill}
												variant="linear"
												items={issueCommentsData}
												renderItem={renderComment}
											/>
										}

										{issueComments.data?.total == 0 &&
											<Chunk>
												<Text color="hint">No comments yet</Text>
											</Chunk>
										}

										{authentication.user && issueCommentsData &&

											<CommentForm
												issue={issue}
												issueComments={issueComments}
												authentication={authentication}
												user={user}
												issueCommentsKey={issueCommentsKey}
												dispatch={dispatch}
											/>

										}
									</Section>



									{!authentication.user && issueCommentsData &&
										<Section border>
											<Chunk inline>

												{!ui.probablyHasAccount &&
													<Button
														size="small"
														label="Sign up to join discussion"
														onPress={() => {
															dispatch(updateUi({
																logInModalVisible: true,
																logInModalOptions: {
																	authUi: 'register'
																}
															}));
														}}
													/>
												}
												{ui.probablyHasAccount &&
													<Button
														size="small"
														label="Log in to join discussion"
														onPress={() => {
															dispatch(updateUi({
																logInModalVisible: true,
																logInModalOptions: {
																	authUi: 'login'
																}
															}));
														}}
													/>
												}

											</Chunk>
										</Section>
									}

								</FlexItem>


							</Flex>

						</Bounds>
					</Stripe>
				</>
			}
		</Page>
	);
}

Issue.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const { store, req, pathname, query } = context;
	const { issueId } = query;
	const isServer = !!req;

	return {
		issueId,
		isServer,
	}
}


export default Issue;