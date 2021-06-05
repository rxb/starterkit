import React, { Fragment, useContext } from 'react';
import ErrorPage from 'next/error'

// SWR
import { request, pageHelper, getTldrUrl, getIssuesUrl } from '@/swr';
import useSWR, { useSWRInfinite, mutate } from 'swr';

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addPrompt, addToast } from '@/actions';

// URLS
import { getTldrPageUrl, getIssuePageUrl } from '../../components/tldr/urls';

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
import TldrHeader from '@/components/tldr/TldrHeader';
import { LoadMoreButton } from '@/components/tldr/components';


// SCREEN-SPECIFIC 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)



function Issues(props) {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

	const { tldrId } = props;

	const dispatch = useDispatch();
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

	const tldr = useSWR( getTldrUrl(tldrId) );

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

				{ issues.data && tldr.data && 
 				<Stripe style={{ flex: 1, backgroundColor: SWATCHES.notwhite }}>
					<Bounds>
						<Section>
							<Chunk>
								<Text>Issues</Text>
								<Text type="pageHead">{tldr.currentTldrVersionContent.title}</Text>
							</Chunk>
						</Section>
						<Section border>
							<Chunk>
								<List
									variant={{
										small: 'linear',
									}}
									items={issues.data}
									paginated={true}
									renderItem={(item, i) => (
										<Chunk key={i}>
											{ !item.last &&
												<Link href={getTldrPageUrl({ tldrId: item.id })}>
													<Text>{item.title} {item.created_at}</Text>
												</Link>
											}
										</Chunk>
									)}
								/>

								<LoadMoreButton swr={issues} />

							</Chunk>
						</Section>
					</Bounds>
				</Stripe>
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