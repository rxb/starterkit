import React, { Fragment, useContext } from 'react';
import ErrorPage from 'next/error'

// SWR
import { request, pageHelper, getTldrsUrl, getCategoriesUrl, getCategoryUrl } from '@/swr';
import useSWR, { useSWRInfinite, mutate } from 'swr';

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addPrompt, addToast } from '@/actions';

// URLS
import { getIndexPageUrl, getCategoryPageUrl, getTldrPageUrl, getTldrEditPageUrl } from '../../components/tldr/urls';

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
import { TldrCardSmall, CreateTldrCardSmall, CategoryCardSmall, LoadMoreButton } from '../../components/tldr/components';


// SCREEN-SPECIFIC 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)



function Category(props) {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

	const { categoryId } = props;

	const dispatch = useDispatch();
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

	const category = useSWR( getCategoryUrl(categoryId) );

	const PAGE_SIZE = 12;
	const tldrs = pageHelper(useSWRInfinite(
		(index) => [getTldrsUrl({ categoryId, $limit: PAGE_SIZE, $skip: PAGE_SIZE * index }), authentication.accessToken] 
	));

	// DIVERT TO ERROR PAGE
	// error from getInitialProps or the swr
	if (category.error || tldrs.error) {
		const error = category.error || tldrs.error;
		return <ErrorPage statusCode={error.code} />
	}

	return (
		<Page>

			<TldrHeader />

				{ category.data && tldrs.data && 
 				<Stripe style={{ flex: 1, backgroundColor: SWATCHES.notwhite }}>
					<Bounds>
						<Section>
							<Chunk>
								<Text>Category</Text>
								<Text type="pageHead">{category.data.name}</Text>
							</Chunk>
						</Section>
						<Section border>
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
						</Section>
					</Bounds>
				</Stripe>
			}
		</Page>
	);


}

Category.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const { store, req, pathname, query } = context;
	const { categoryId } = query;
	const isServer = !!req;

	return {
		categoryId,
		isServer,
	}
}






export default Category;