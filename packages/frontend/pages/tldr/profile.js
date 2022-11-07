import React, { Fragment, useState, useEffect, useContext } from 'react';
import ErrorPage from 'next/error'

// SWR
import {
	request,
	pageHelper,
	getUserUrl,
	getTldrsUrl,
} from '@/swr';
import useSWR, { mutate } from 'swr';
import useSWRInfinite from 'swr/infinite' 

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addPrompt, addToast, addDelayedToast, updateUi } from '@/actions';

// URLS
import { getIndexPageUrl, getVersionEditPageUrl, getTldrEditPageUrl, getTldrPageUrl, getProfileEditPageUrl } from 'components/tldr/urls';

// COMPONENTS
import {
	Avatar,
	Bounds,
	Button,
	Card,
	CheckBox,
	Chunk,
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
	Tabs,
	Text,
	TextInput,
	Touch,
	useMediaContext,
	View,
	ThemeContext
} from 'cinderblock';
import Page from '@/components/Page';
import TldrHeader from '@/components/tldr/TldrHeader';
import { TldrCardSmall, CreateTldrCardSmall, LoadMoreButton, Emptiness } from '@/components/tldr/components';


// SCREEN-SPECIFIC
import { COUNTRIES } from '@/components/utils';
import Router from 'next/router'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime)
dayjs.extend(LocalizedFormat)

function TldrProfile(props) {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

	const dispatch = useDispatch();

	const authentication = useSelector(state => state.authentication);
	const userId = props.userId || authentication?.user?.id;

	// trying to get self when not logged in? redirect to home
	useEffect(() => {
		if (!userId && !authentication.token) {
			dispatch(addDelayedToast("Need to be logged in for that"));
			Router.push({ pathname: getIndexPageUrl() })
		}
	}, [userId]);

	const user = useSWR(getUserUrl(userId));
	const isSelf = (authentication && user.data?.id == authentication?.user?.id);
	// TODO: admin permission

	const PAGE_SIZE = 12;
	const authorTldrs = pageHelper(useSWRInfinite(
		(index) => [getTldrsUrl({ authorId: userId, $limit: PAGE_SIZE, $skip: PAGE_SIZE * index }), authentication.accessToken]
	));


	// DIVERT TO ERROR PAGE
	if (user.error || authorTldrs.error) {
		const error = user.error || authorTldrs.error;
		return <ErrorPage statusCode={error.code} />
	}

	// RENDER
	return (
		<Page>
			<TldrHeader />

			{userId && user.data && authorTldrs.data &&
				<Stripe style={{ flex: 1, backgroundColor: SWATCHES.notwhite }}>
					<Bounds>
						<Section>
							<Chunk style={{ paddingBottom: METRICS.pseudoLineHeight }}>
								<Avatar
									source={{ uri: user.data.photoUrl }}
									size="xlarge"
								/>
							</Chunk>
							<Chunk>
								<Text type="pageHead">{user.data.name}</Text>
								<Text color="secondary">@{user.data.urlKey}</Text>
							</Chunk>
						</Section>
						<Section border>
							{user.data.bio &&
								<Chunk>
									<View style={{ maxWidth: 740 }}>
										<Text>{user.data.bio}</Text>									
									</View>
								</Chunk>
							}
							<Chunk>
								<Flex direction="column" switchDirection="large">
									{user.data.link &&
										<FlexItem shrink>
											<Link href={user.data.link}>
												<Text nowrap style={{marginBottom: 1}}>
													<Icon
														shape="Globe"
														color={SWATCHES.tint}
														size="small"
														style={{verticalAlign: 'middle'}}
													/>
													<Text color="tint" type="small" style={{verticalAlign: 'middle'}}> {user.data.link}</Text>
												</Text>
											</Link>
										</FlexItem>
										}
										<FlexItem shrink>
											<Flex direction="row">
											{user.data.country && 
												<FlexItem shrink>
													<Text nowrap>
														<Icon
															shape="MapPin"
															color={SWATCHES.textHint}
															size="small"
															style={{verticalAlign: 'middle'}}
														/>
														<Text type="small" style={{verticalAlign: 'middle'}}> {COUNTRIES[user.data.country]}</Text>
													</Text>
												</FlexItem>
											}
											<FlexItem shrink>
												<Text nowrap>
													<Icon
														shape="Calendar"
														color={SWATCHES.textHint}
														size="small"
														style={{verticalAlign: 'middle'}}
													/>
													<Text  type="small" style={{verticalAlign: 'middle'}}> Joined {dayjs(user.data.createdAt).format('L')}</Text>
												</Text>
											</FlexItem>
										</Flex>
									</FlexItem>
								</Flex>
							</Chunk>
						</Section>


						<Section border>

							{authorTldrs.total == 0 &&
							<>
								<Emptiness
									label={isSelf ? "You haven't created any cards yet" : `@${user.data.urlKey} hasn't created any cards yet`}
								>
									{isSelf &&
										<Chunk>
											<Button
												href={getTldrEditPageUrl()}
												label="Create a new card"
												size="small"
											/>
										</Chunk>
									}
								</Emptiness>
							</>
							}

							{authorTldrs.total > 0 &&
								<>
									<Chunk>
										<Text type="sectionHead">
											{authorTldrs.total} cards
										</Text>
									</Chunk>

									<List
										variant={{
											small: 'grid',
										}}
										itemsInRow={{
											small: 1,
											medium: 2,
											large: 4
										}}
										scrollItemWidth={300}
										paginated={true}
										items={authorTldrs.data}
										renderItem={(item, i) => {
											const href = (item.currentTldrVersion != undefined) ?
												getTldrPageUrl({ tldrId: item.id }) :
												getVersionEditPageUrl({ tldrId: item.id });
											return (
												<Chunk key={i}>
													{!item.last &&
														<Link href={href}>
															<TldrCardSmall 
																tldr={item} 
																user={authentication.user} 
																/>
														</Link>
													}
													{item.last &&
														<Link href={getTldrEditPageUrl()}>
															<CreateTldrCardSmall />
														</Link>
													}
												</Chunk>
											);
										}}
									/>

									<LoadMoreButton swr={authorTldrs} />
								</>
							}





						</Section>
					</Bounds>
				</Stripe>
			}
		</Page>
	);


}

TldrProfile.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const { store, req, pathname, query } = context;
	const userId = query.userId;
	const isServer = !!req;

	return {
		userId: userId,
		isServer,
	}
}




export default TldrProfile;