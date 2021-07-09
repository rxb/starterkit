import React, { Fragment, useContext } from 'react';
import ErrorPage from 'next/error'

// SWR
import { request, pageHelper, getTldrUrl, getIssuesUrl } from '@/swr';
import useSWR, { useSWRInfinite, mutate } from 'swr';

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addPrompt, addToast } from '@/actions';

// URLS
import { detourIfAuthNeeded, getTldrPageUrl, getIssuePageUrl, getIssueEditPageUrl } from '../../components/tldr/urls';

// COMPONENTS
import {
	Avatar,
	Bounds,
	Button,
	Card,
	CheckBox,
	Chip,
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
	Text,
	TextInput,
	Touch,
	useMediaContext,
	View,
	ThemeContext
} from 'cinderblock';
import Page from '@/components/Page';
import TldrHeader from '@/components/tldr/TldrHeader';
import { LoadMoreButton, Emptiness, Tag, IssueStatusIcon, ISSUE_TYPES } from '@/components/tldr/components';


// SCREEN-SPECIFIC 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import Router from 'next/router'


function Issues(props) {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);
	const { tldrId } = props;

	const dispatch = useDispatch();
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

	const tldr = useSWR(getTldrUrl(tldrId));

	const PAGE_SIZE = 12;
	const issues = pageHelper(useSWRInfinite(
		(index) => [getIssuesUrl({ tldrId, $limit: PAGE_SIZE, $skip: PAGE_SIZE * index }), authentication.accessToken]
	));

	// DIVERT TO ERROR PAGE
	// error from getInitialProps or the swr
	if (issues.error || tldr.error) {
		const error = issues.error || tldr.error;
		return <ErrorPage statusCode={error.code} />
	}

	return (
		<Page>
			<TldrHeader />

			{issues.data && tldr.data &&
				<>
					<Stripe style={{ minHeight: '70vh' }}>
						<Bounds>
							<Section>
								<Flex>
									<FlexItem>
										<Chunk>
											<Link href={getTldrPageUrl({ tldrId: tldr.data.id })}>
												<Text type="small" color="secondary">{tldr.data.author.urlKey}/{tldr.data.urlKey}</Text>
											</Link>
											<Text type="pageHead">Issues</Text>
										</Chunk>
									</FlexItem>
									{ issues.total > 0 &&
									<FlexItem shrink justify="flex-end">
										<Chunk>
											<Button
												onPress={() => {
													detourIfAuthNeeded(getIssueEditPageUrl({ tldrId: tldr.data.id }), authentication, dispatch, Router);
												}}
												label="New issue"
												style={{ alignSelf: 'center' }}
											/>
										</Chunk>
									</FlexItem>
									}
								</Flex>

							</Section>

							{issues.total == 0 &&
								<Section border>
									<Chunk>
										<Emptiness
											label={`No issues for this card yet`}
										>
											<Chunk>
												<Button
													onPress={() => {
														detourIfAuthNeeded(getIssueEditPageUrl({ tldrId: tldr.data.id }), authentication, dispatch, Router);
													}}
													label="New issue"
													style={{ alignSelf: 'center' }}
												/>
											</Chunk>
										</Emptiness>
									</Chunk>
								</Section>
							}

							{issues.total > 0 &&
								<Section borderedContent>
									<Chunk>
										<List
											variant={{
												small: 'linear',
											}}
											items={issues.data}
											paginated={true}
											linearFirstChildPlain={false}
											renderItem={(item, i) => (
												<Link href={getIssuePageUrl({ issueId: item.id })}>
													<Chunk key={i}>
														<Flex>
															<FlexItem>
																<Flex direction="column" switchDirection="large">
																	<FlexItem>
																		<Tag 
																			label={ISSUE_TYPES[item.type].label} 
																			size="small" 
																			/>
																	</FlexItem>
																	<FlexItem justify="center" growFactor={3}>

																		<Text weight="strong">{item.title}</Text>

																	</FlexItem>
																	<FlexItem justify="center" growFactor={3}>
																		<Text type="small" color="secondary" nowrap>opened {dayjs(item.createdAt).fromNow()} by {item.author.urlKey}</Text>
																	</FlexItem>
																	<FlexItem justify="center" growFactor={2}>
																		<Text nowrap type="small" color="secondary" nowrap>{item.commentCount} comments</Text>
																	</FlexItem>

																</Flex>
															</FlexItem>
															<FlexItem shrink justify="center" >
																<IssueStatusIcon
																	size="small"
																	status={item.status}
																	/>
															</FlexItem>
														</Flex>

													</Chunk>
												</Link>
											)}
										/>
										<LoadMoreButton swr={issues} />
									</Chunk>
								</Section>
							}

						</Bounds>
					</Stripe>
					<Stripe style={{ flex: 1, backgroundColor: SWATCHES.shade }}>
						<Bounds>

							<Section>
								<Chunk>
									<Text type="sectionHead">About issues and stuff</Text>
								</Chunk>
								<Chunk>
									<Text color="secondary">Studiose et maior sane durissimis omnem errore rerum Chremes incursione reliquerunt iustioribus certa extremo laetamur quaerendum verbis eveniet, Istius omnis geometriaque pariuntur censet saxum cernantur pararetur imperitos interpretum. Praestabiliorem habemus ista angusti probatum metuamus vitium.</Text>
								</Chunk>
							</Section>
						</Bounds>

					</Stripe>
				</>
			}
		</Page>
	);


}

Issues.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const { store, req, pathname, query } = context;
	const { tldrId } = query;
	const isServer = !!req;

	return {
		tldrId,
		isServer,
	}
}


export default Issues;