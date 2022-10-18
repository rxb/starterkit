import React, { Fragment, useEffect, useState, useContext } from 'react';
import ErrorPage from 'next/error'

// SWR
import { request, buildQs, pageHelper, getTldrUrl, getTldrsUrl, getUsersSavedTldrsUrl, getTldrsVotesUrl } from '@/swr';
import useSWR, { mutate } from 'swr';

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addPrompt, addToast, addDelayedToast, updateUi } from '@/actions';

// URLS
import { saveLoginRedirect, getProfilePageUrl, getVersionEditPageUrl, getTldrEditPageUrl, getTldrPageUrl, getIssuesPageUrl, getContactPageUrl } from '@/components/tldr/urls';

// COMPONENTS
import {
	Avatar,
	Bounds,
	Button,
	Card,
	CheckBox,
	Chunk,
	FakeInput,
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
	useMediaContext,
	View,
	ThemeContext
} from 'cinderblock';
import Page from '@/components/Page';
import TldrHeader from '@/components/tldr/TldrHeader';
import Router, { useRouter } from 'next/router'


// SCREEN-SPECIFIC
import { TldrCardSmall, TldrCard, DeletePrompt } from '@/components/tldr/components';
import { abbreviateNumber } from '@/components/utils';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)


const DownVotePrompt = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	const {
		onRequestClose,
		tldr
	} = props;
	return (
		<Section>
			<Chunk>
				<Text type="sectionHead">Thanks for the feedback</Text>
			</Chunk>
			<Chunk>
				<Text>Something something about making TLDR.cards even better</Text>
			</Chunk>
			<Chunk>
				<Button
					onPress={() => {
						onRequestClose();
						Router.push(getIssuesPageUrl({ tldrId: tldr.data.id }));
					}}
					label="Open an issue"
					width="full"
				/>
				<Button
					onPress={() => {
						onRequestClose();
						Router.push(getContactPageUrl({ message: encodeURIComponent(`Reporting card:\r\n${location.href}\r\n\r\nOptional details:\r\n`) }));
					}}
					color="secondary"
					label="Report this card"
					width="full"
				/>
			</Chunk>
		</Section>
	);
};

const DownloadPrompt = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	const {
		onRequestClose,
		tldr
	} = props;
	const fakeDownload = () => {
		alert('Pretend this works');
	}

	return (
		<Section>
			<Chunk>
				<Text type="sectionHead">Download</Text>
			</Chunk>
			<Touch onPress={fakeDownload}>
			<Chunk border>
				<Flex>
					<FlexItem shrink>
						<Icon
							shape="Image" 
							/>
					</FlexItem>
					<FlexItem>
						<Text>TikTok-size images</Text>
					</FlexItem>
				</Flex>
			</Chunk>
			</Touch>
			<Touch onPress={fakeDownload}>
			<Chunk border>
				<Flex>
					<FlexItem shrink>
						<Icon
							shape="Image" 
							/>
					</FlexItem>
					<FlexItem>
						<Text>Instagram-size images</Text>
					</FlexItem>
				</Flex>
			</Chunk>
			</Touch>
			<Touch onPress={fakeDownload}>
			<Chunk border>
				<Flex>
					<FlexItem shrink>
						<Icon
							shape="Monitor" 
							/>
					</FlexItem>
					<FlexItem>
						<Text>PPT slides</Text>
					</FlexItem>
				</Flex>
			</Chunk>
			</Touch>
			<Touch onPress={fakeDownload}>
				<Chunk border>
					<Flex>
						<FlexItem shrink>
							<Icon
								shape="Printer" 
								/>
						</FlexItem>
						<FlexItem>
							<Text>Printable PDF</Text>
						</FlexItem>
					</Flex>
				</Chunk>
			</Touch>
			<Touch onPress={fakeDownload}>
				<Chunk border>
					<Flex>
						<FlexItem shrink>
							<Icon
								shape="FileText" 
								/>
						</FlexItem>
						<FlexItem>
							<Text>Text (Markdown)</Text>
						</FlexItem>
					</Flex>
				</Chunk>
			</Touch>

			<Chunk>
				<Button
					onPress={onRequestClose}
					color="secondary"
					label="Cancel"
					width="full"
				/>
			</Chunk>
		</Section>
	);
};


const SharePrompt = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	const {
		shareData,
		onRequestClose
	} = props;

	const openShareUrl = (shareUrl) => {
		window.open(shareUrl, '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
	}

	const shareTwitter = (shareData) => {
		const encodedText = encodeURIComponent(`${shareData.title} ${shareData.url}`);
		const shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
		openShareUrl(shareUrl);
	}

	const shareFacebook = (shareData) => {
		const encodedUrl = encodeURIComponent(shareData.url);
		const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
		openShareUrl(shareUrl);
	}

	const shareReddit = (shareData) => {
		const encodedUrl = encodeURIComponent(shareData.url);
		const encodedTitle = encodeURIComponent(shareData.title);
		const shareUrl = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
		openShareUrl(shareUrl);
	}

	return (
		<Section>
			<Chunk>
				<Text type="sectionHead">Let's share this thing</Text>
				<Text>Sharing is caring</Text>
			</Chunk>
			<Chunk>
				<FakeInput
					style={{paddingRight: 48}}
					label={shareData.url}
					shape="Copy"
					onPress={() => {
						try {
							navigator.clipboard.writeText(shareData.url)
							alert('Url copied'); // make this a toast	or inline message
						}
						catch (err) {
							console.error(err);
						}
					}}
				/>
				<Button
					onPress={() => {
						shareTwitter(shareData)
					}}
					shape="Twitter"
					width="full"
					label="Twitter"
				/>
				<Button
					onPress={() => {
						shareFacebook(shareData)
					}}
					shape="Facebook"
					width="full"
					label="Facebook"
				/>
				<Button
					onPress={() => {
						shareReddit(shareData)
					}}
					shape="Link"
					width="full"
					label="Reddit"
				/>
				<Button
					onPress={onRequestClose}
					color="secondary"
					label="Cancel"
					width="full"
				/>
			</Chunk>
		</Section>
	);
};




function Tldr(props) {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);
	const router = useRouter();

	const dispatch = useDispatch();
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

	const tldr = useSWR([getTldrUrl(props.tldrId), authentication.accessToken], { fallbackData: props.tldr });
	const canEdit = (user?.id && tldr?.data?.authorId && user.id == tldr.data.authorId);

	const relatedTldrs = pageHelper(useSWR( tldr.data ? getTldrsUrl({categoryId: tldr.data.categoryId, "id[$nin][]": tldr.data.id, "$limit": 4}) : null ));
	

	// POST-AUTH ACTION
	// check if hash action passed back from oauth, reg
	const [postAuthAction, setPostAuthAction] = useState();
	useEffect(() => {
		const hashAction = window.location.hash.substr(1);
		window.location.hash = '';
		setPostAuthAction(hashAction);
	}, []);
	useEffect(() => {
		if (user.id && tldr.data, postAuthAction) {
			switch (postAuthAction) {
				case 'upvoteTldr':
					upvoteTldr();
					break;
				case 'downvoteTldr':
					downvoteTldr();
					break;
				case 'saveTldr':
					saveTldr();
					break;
			}
			setPostAuthAction(null);
		}
	}, [user.id, postAuthAction, tldr.data]);

	const doOrAuth = (fn, actionOnReturn) => {
		if (!authentication.accessToken) {
			dispatch(updateUi({
				logInModalVisible: true,
				logInModalOptions: {
					redirect: { hash: actionOnReturn },
					callbackForNonRedirectFlow: () => {
						setPostAuthAction(actionOnReturn)
					}
				}
			}));
		}
		else {
			fn();
		}
	};

	const vote = async (nextVote) => {
		tldr.mutate({ ...tldr.data, currentUserVote: nextVote }, false); // optimistic
		if (nextVote) {
			await request(getTldrsVotesUrl(), {
				method: 'POST',
				data: { tldrId: tldr.data.id, vote: nextVote },
				token: authentication.accessToken
			});
		}
		else {
			await request(getTldrsVotesUrl({ tldrId: tldr.data.id }), {
				method: 'DELETE',
				token: authentication.accessToken
			});
		}
		tldr.mutate(); // ok, get real data	
	}

	const upvoteTldr = () => {
		doOrAuth(() => {
			const nextVote = (tldr.data.currentUserVote == 1) ? 0 : 1;
			vote(nextVote);
		}, "upvoteTldr");
	}

	const downvoteTldr = () => {
		doOrAuth(() => {
			const nextVote = (tldr.data.currentUserVote == -1) ? 0 : -1;
			vote(nextVote);
			if (nextVote) {
				setTimeout(() => {
					dispatch(addPrompt(<DownVotePrompt tldr={tldr} />))
				}, 400);
			}
		}, "downvoteTldr");
	}

	const saveTldr = () => {
		doOrAuth(async () => {
			const nextSaved = !tldr.data.currentUserSaved;
			tldr.mutate({ ...tldr.data, currentUserSaved: nextSaved }, false); // optimistic
			await request(getUsersSavedTldrsUrl(), {
				method: nextSaved ? 'POST' : 'DELETE',
				data: { savedTldrId: tldr.data.id },
				token: authentication.accessToken
			});
			tldr.mutate(); // ok, get real data
		}, "saveTldr");
	}

	const shareTldr = async (shareData) => {
		if (navigator.share) {
			try {
				await navigator.share(shareData)
			} catch (err) {
				console.error(err)
			}
		}
		else {
			dispatch(addPrompt(<SharePrompt shareData={shareData} />))
		}
	}


	// DIVERT TO ERROR PAGE
	// error from getInitialProps or the swr
	if (props.error || tldr.error) {
		const error = props.error || tldr.error;
		return <ErrorPage statusCode={error.code} />
	}

	// RENDER
	return (
		<Page>

			<TldrHeader />

			{tldr.data &&
				<Stripe style={{/*paddingTop: 0,*/ backgroundColor: SWATCHES.notwhite }}>
					<Bounds>
						<Flex direction="column" switchDirection="large">
							<FlexItem growFactor={1}>
								<Section style={{ paddingBottom: 0 }}>
									<Chunk>
										<TldrCard tldr={tldr.data} />
									</Chunk>
								</Section>
							</FlexItem>
							<FlexItem growFactor={0} style={{ flexBasis: 350, flex: 0 }}>
								<Section>
									<Chunk border style={{ marginTop: METRICS.space * 3 }}>
										<Flex>
											<FlexItem shrink>
												<Button
													color={tldr.data.currentUserVote == 1 ? 'primary' : 'secondary'}
													style={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0, marginBottom: 1 }}
													shape="ArrowUp"
													onPress={upvoteTldr}
												/>
												<Button
													style={{ borderTopRightRadius: 0, borderTopLeftRadius: 0, marginTop: 1 }}
													color={tldr.data.currentUserVote == -1 ? 'primary' : 'secondary'}
													shape="ArrowDown"
													onPress={downvoteTldr}
												/>

											</FlexItem>
											<FlexItem justify="center">

												{/*
												<Text type="big">18.7k</Text>
												<Text type="micro" color="hint">95% positive</Text>
												*/}
												<Text type="big">{abbreviateNumber(tldr.data.voteResult)}</Text>
												<Text type="big">{tldr.data.voteResult}</Text>
												
													{tldr.data.voteResult >= 0 && 
														<Text type="micro" color="hint">{tldr.data.votePositivity}% upvotes</Text>
													}
													{tldr.data.voteResult < 0 && 
														<Text type="micro" color="hint">{100-tldr.data.votePositivity}% downvotes</Text>
													}
												

											</FlexItem>
										</Flex>
									</Chunk>

									<Chunk border>
										{canEdit &&
											<Button
												shape="Edit"
												label="Edit card"
												width="full"
												color="secondary"
												href={getVersionEditPageUrl({ tldrId: tldr.data.id })}
											/>
										}
										<Flex>
											<FlexItem>
												<Button
													shape="Share2"
													color="secondary"
													width="full"
													onPress={() => {
														shareTldr({
															title: tldr.data.currentTldrVersion.content.title,
															text: tldr.data.currentTldrVersion.content.blurb,
															url: `tldr.cards/${tldr.data.urlKey}`,
														});
													}}
												/>
												<Text type="micro" color="hint" style={{ alignSelf: 'center' }}>Share</Text>
											</FlexItem>
											<FlexItem>
												<Button
													shape="Bookmark"
													color={tldr.data.currentUserSaved ? 'primary' : 'secondary'}
													width="full"
													onPress={saveTldr}
												/>
												<Text type="micro" color="hint" style={{ alignSelf: 'center' }}>{tldr.data.currentUserSaved ? 'Saved' : 'Save'}</Text>
											</FlexItem>
											<FlexItem>
												<Button
													shape="DownloadCloud"
													color="secondary"
													width="full"
													onPress={()=>{
														dispatch(addPrompt(<DownloadPrompt />));
													}}
												/>
												<Text type="micro" color="hint" style={{ alignSelf: 'center' }}>Download</Text>
											</FlexItem>
										</Flex>
									</Chunk>

									<Chunk border>
										<Link href={getIssuesPageUrl({ tldrId: tldr.data.id })}>
											<Flex>
												<FlexItem>
													<Text weight="strong">Issues ({tldr.data.issueCount})</Text>
													<Text type="small" color="secondary">Help improve this card</Text>
												</FlexItem>
												<FlexItem shrink justify="center" style={{ paddingHorizontal: 3 }}>
													<Icon
														color={SWATCHES.textSecondary}
														shape="MessageCircle"
													/>
												</FlexItem>
											</Flex>
										</Link>
									</Chunk>

									<Chunk border>
										<Link href={getProfilePageUrl({ userId: tldr.data.author.id })}>
											<Flex>
												<FlexItem>
													<Text weight="strong">Maintainer</Text>
													<Text type="small" color="secondary">@{tldr.data.author.urlKey} • {tldr.data.author.name}</Text>
												</FlexItem>
												<FlexItem shrink justify="center" style={{ paddingHorizontal: 3 }}>
													<Avatar
														size="small"
														source={{ uri: tldr.data.author.photoUrl }} />
												</FlexItem>
											</Flex>
										</Link>
									</Chunk>

									{canEdit &&
										<Chunk border>
											<Inline>
												<Link href={getTldrEditPageUrl({ tldrId: tldr.data.id })}>
													<Text type="small" color="hint">Settings</Text>
												</Link>
												<Text type="small"> </Text>
												<Touch onPress={() => {
													const prompt = <DeletePrompt
														dipatch={dispatch}
														tldr={tldr.data}
														onSuccess={() => {
															dispatch(addDelayedToast('Card deleted!'));
															Router.push(getProfilePageUrl());
														}}
													/>
													dispatch(addPrompt(prompt))
												}}>
													<Text type="small" color="hint">Delete</Text>
												</Touch>
											</Inline>
										</Chunk>
									}
								</Section>

							</FlexItem>
						</Flex>

					</Bounds>
				</Stripe>
			}

			{tldr.data && relatedTldrs.data &&
				<Stripe style={{ backgroundColor: SWATCHES.backgroundShade }}>
					<Bounds>

						<Section>
							<Chunk>
								<Text type="sectionHead">Related cards</Text>
							</Chunk>
							<List
								variant={{
									small: 'scroll',
									medium: 'grid'
								}}
								itemsInRow={{
									small: 1,
									medium: 2,
									large: 4
								}}
								scrollItemWidth={300}

								items={relatedTldrs.data.items}

								renderItem={(item, i) => {
									return (
										<Chunk key={i}>
											<Link
												href={getTldrPageUrl({ tldrId: item.id })}
											>
												<TldrCardSmall tldr={item} />
											</Link>
										</Chunk>
									);
								}}
							/>

						</Section>

					</Bounds>
				</Stripe>
			}
		</Page>
	);


}

Tldr.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const { store, req, pathname, query } = context;
	const tldrId = query.tldrId;
	const isServer = !!req;

	// fetch and pass as props during SSR, using in the useSWR as intitialData
	try {
		const tldr = (isServer) ? await request(getTldrUrl(tldrId)) : undefined;
		return {
			tldrId: tldrId,
			isServer,
			tldr
		}
	}
	catch (error) {
		return {
			tldrId: tldrId,
			isServer,
			error: error
		}
	}

}






export default Tldr;