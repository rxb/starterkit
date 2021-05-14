import React, {Fragment, useState, useEffect, useContext} from 'react';
import ErrorPage from 'next/error'

// SWR
import {
	request,
	pageHelper,
	getUserUrl,
	getTldrsUrl,
} from '@/swr';
import useSWR, { mutate, useSWRInfinite }  from 'swr';

// REDUX
import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast, addDelayedToast, updateUi } from '@/actions';

// URLS
import { getIndexPageUrl, getVersionEditPageUrl, getTldrEditPageUrl, getTldrPageUrl, getProfileEditPageUrl} from 'components/tldr/urls';

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
import TldrHeader from '../../components/tldr/TldrHeader';
import {TldrCardSmall, CreateTldrCardSmall, LoadMoreButton, Emptiness} from '../../components/tldr/components';





// SCREEN-SPECIFIC
import Router from 'next/router'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

function Saved (props) {
   const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

		const dispatch = useDispatch(); 

		const authentication = useSelector(state => state.authentication);
		const user = authentication.user || {};
	
		
		const PAGE_SIZE = 12;

		const tldrs = pageHelper(useSWRInfinite(
			(index) => [getTldrsUrl({selfSaved: true, $limit: PAGE_SIZE, $skip: PAGE_SIZE*index}), authentication.accessToken ]		
		));

		// DIVERT TO ERROR PAGE
		if (tldrs.error) {
			const error = tldrs.error;
			return <ErrorPage statusCode={error.code} />
		}
	
		// RENDER
		return (
			<Page>
				<TldrHeader />

				{ tldrs.data && 
					<Stripe style={{flex: 1, backgroundColor: swatches.notwhite}}>
						<Bounds>
							<Section>

								<Chunk>
									<Text type="pageHead">Saved </Text>
								</Chunk>

							</Section>
							<Section border>

									{ tldrs.total == 0 && 
										<Emptiness 
											label="No saved cards yet"
											>
											<Chunk>
												<Link href={ getIndexPageUrl() }>
													<Button 
														label="Go explore cards" 
														size="small" 
														/>
												</Link>
											</Chunk>
										</Emptiness>
									}


									{ tldrs.total > 0 && 
									<>
										<Chunk>
											<Text type="sectionHead">{tldrs.total} cards</Text>
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
										items={tldrs.data}
										paginated={true}
										renderItem={(item, i)=>(
											<Chunk key={i}>
												<Link href={ getTldrPageUrl({tldrId: item.id}) }>
													<TldrCardSmall tldr={item} user={authentication.user} />
												</Link>
											</Chunk>
										)}
										/>

										<LoadMoreButton swr={tldrs} />
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
	const {store, req, pathname, query} = context;
	const userId = query.userId;
	const isServer = !!req;	

	return {
		userId: userId,
		isServer,
	}
}


export default Saved;