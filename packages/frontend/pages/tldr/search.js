import React, { Fragment, useContext, useEffect, useState } from 'react';
import ErrorPage from 'next/error'

// SWR
import { request, pageHelper, getTldrsUrl } from '@/swr';
import useSWR, { mutate } from 'swr';
import useSWRInfinite from 'swr/infinite' 

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addPrompt, addToast } from '@/actions';

// URLS
import { detourIfAuthNeeded, getIndexPageUrl, getCategoryPageUrl, getTldrPageUrl, getTldrEditPageUrl } from '../../components/tldr/urls';

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
	Text,
	TextInput,
	Touch,
	useMediaContext,
	View,
	ThemeContext
} from 'cinderblock';
import Page from '@/components/Page';
import TldrHeader from '../../components/tldr/TldrHeader';
import { TldrCardSmall, CreateTldrCardSmall, Emptiness, LoadMoreButton } from '../../components/tldr/components';

// SCREEN-SPECIFIC 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import Router from 'next/router'


function Search(props) {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

	const { q } = props;

	const dispatch = useDispatch();
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};


	const PAGE_SIZE = 12;
	const tldrs = pageHelper(useSWRInfinite(
		(index) => [getTldrsUrl({_search: q, $limit: PAGE_SIZE, $skip: PAGE_SIZE * index }), authentication.accessToken] 
	));


	// DIVERT TO ERROR PAGE
	// error from getInitialProps or the swr
	if (tldrs.error) {
		const error = tldrs.error;
		return <ErrorPage statusCode={error.code} />
	}

	return (
		<Page>

			<TldrHeader />

				{ tldrs.data && 
 				<Stripe style={{ flex: 1, backgroundColor: SWATCHES.notwhite }}>
					<Bounds>
						<Section>
							<Chunk>
								<Text>{tldrs.total > 0 ? `${tldrs.total} search results` : 'Search results'}</Text>
								<Text type="pageHead">{q}</Text>
							</Chunk>
						</Section>
						<Section border>
							{ tldrs.total > 0 && 
							<Chunk>
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
									items={tldrs.data}
									paginated={true}
									renderItem={(item, i) => (
										<Chunk key={i}>
											{ !item.last &&
												<Link href={getTldrPageUrl({ tldrId: item.id })}>
													<TldrCardSmall
														user={user}
														tldr={item}
														dispatch={dispatch}
														mutate={tldrs.mutate}
													/>
												</Link>
											}
											{ item.last &&
												<Link href={getTldrEditPageUrl({ categoryId: category.data.id })}>
													<CreateTldrCardSmall />

												</Link>
											}
										</Chunk>
									)}
								/>

								<LoadMoreButton swr={tldrs} />

							</Chunk>
							}
					
							{ tldrs.total == 0 && 
								<Chunk>
									<Emptiness
										label={`No cards for "${q}" yet`}
										>
										<Chunk>
											<Button
												onPress={()=>{
													detourIfAuthNeeded( getTldrEditPageUrl(), authentication, dispatch, Router);
												}}
												label="Create a card"
												style={{alignSelf: 'center'}}
												/>
												{/* 
											<Button
												color="secondary"
												href={getIndexPageUrl()}
												label="Browse cards"
												style={{alignSelf: 'center'}}
												/>
												*/}
										</Chunk>
									</Emptiness>
								</Chunk>
							}

						</Section>
					</Bounds>
				</Stripe>
			}
		</Page>
	);


}

Search.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const { store, req, pathname, query } = context;
	const { q } = query;
	const isServer = !!req;

	return {
		q,
		isServer,
	}
}






export default Search;