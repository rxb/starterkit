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
import {BREAKPOINT_SIZES} from 'cinderblock/styles/designConstants';
import Page from '@/components/Page';
import TldrHeader from '../../components/tldr/TldrHeader';
import { TldrCardSmall, CreateTldrCardSmall, CategoryCardSmall, LoadMoreButton } from '../../components/tldr/components';
import StyleSheet from 'react-native-media-query';


// SCREEN-SPECIFIC 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import { TESTCOLORS1 as TESTCOLORS } from '../../components/tldr/testcolors';

const {styles: indexStyles, ids: indexIds} = StyleSheet.create({
	categoryCard1: {
		marginVertical: 0,
		zIndex: 10,
		minHeight: 180,
	},
	categoryCard2: { 
		marginVertical: 0, position: 'absolute', top: 5, right: -5, bottom: -5, left: 5, zIndex: 9 
	},
	categoryCard3: { 
		marginVertical: 0, position: 'absolute', top: 10, right: -10, bottom: -10, left: 10, zIndex: 8 
	},
})


const CategoryItem = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	const {
		category,
		color = SWATCHES.tint
	} = props;
	return (

		<Chunk>
			<View style={{ position: 'relative', marginRight: 10, marginBottom: 18 }}>
				<Card style={[indexStyles.categoryCard1, {backgroundColor: color}]}>
					<View style={{
						height: 60,
						backgroundColor: 'rgba(255, 255, 255, .35)',
					}} />
					<Sectionless style={{
						paddingTop: METRICS.space,
						flex: 1,
					}}>
						<Chunk style={{ flex: 0 }}>
							<Text type="big" inverted>{category.name}</Text>
							<Text type="small" style={{ textAlign: 'left' }} inverted>1,263 cards</Text>
						</Chunk>
					</Sectionless>
				</Card>
				<Card style={indexStyles.categoryCard2} />
				<Card style={indexStyles.categoryCard3} />
			</View>
		</Chunk>

	)
}

function TldrHome(props) {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

	const dispatch = useDispatch();
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

	const categories = pageHelper(useSWR( getCategoriesUrl({ '$limit': 1000 }), { initialData: props.categoriesData }
	));

	// DIVERT TO ERROR PAGE
	// error from getInitialProps or the swr
	if ( categories.error ) {
		const error = categories.error;
		return <ErrorPage statusCode={error.code} />
	}

	return (
		<Page>
			<TldrHeader 
				hideWordmark={false} 
				/>
				<Stripe>
					<Bounds style={{minHeight: '27vw', justifyContent: 'center'}}>
						<Flex>
							<FlexItem>
								<Section>
									<Chunk>
										<Text type="hero" color="tint">
											tldr.cards
										</Text>
									</Chunk>
									<Chunk>
										<Text type="big">Brutally concise and useful index cards</Text>
										<Text type="big">that make you non-helpless about big subjects</Text>
									</Chunk>
									<Chunk>
										<Text type="big" style={{fontWeight: METRICS.textBodyWeight}}>Written and improved by everyone</Text>
									</Chunk>
							</Section>
							</FlexItem>
							<FlexItem>
								<Section style={{height: '100%'}}>
									<View
										style={{
											height: '100%', width: '100%', 
											outline: '1px dotted pink',
											alignItems: 'center',
											justifyContent: 'center'
										}}
										>
										<Text style={{color: 'pink'}}>card box illustration</Text>
									</View>
								</Section>	
							</FlexItem>
						</Flex>

					</Bounds>
				</Stripe>

				{ categories.data && 
				<Stripe style={{ flex: 1, backgroundColor: SWATCHES.notwhite}} border>
					<Bounds>
						<Section>
							<List
								variant={{
									small: 'grid',
								}}
								itemsInRow={{
									small: 2,
									medium: 2,
									large: 4,
									xlarge: 5
								}}
								scrollItemWidth={300}
								items={categories.data.items}
								renderItem={(category, i) => (
									<Chunk key={i}>
										<Link href={getCategoryPageUrl({ categoryId: category.id })}>
											<CategoryItem category={category} color={TESTCOLORS[category.id - 2 % TESTCOLORS.length]} />
										</Link>
									</Chunk>
								)}
								itemIds={catListIds.catListItem}
							/>
						</Section>
					</Bounds>
				</Stripe>
				}
		</Page>
	);
}

// just really needed an extra breakpoint for 3 categories across width
// TODO: consider adding to breakpoints?
const {styles: catListStyles, ids: catListIds} = StyleSheet.create({
	catListItem: {
		'@media screen and (min-width: 640px) and (max-width: 839px)': {
			flexBasis: `33.33%`,
		},
	}
});

TldrHome.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const { store, req, pathname, query } = context;
	const isServer = !!req;

	try {
		const categoriesData = (isServer) ? await request(getCategoriesUrl({ '$limit': 1000 })) : undefined;
		return {
			isServer,
			categoriesData
		}
	}
	catch (error) {
		return {
			isServer,
			error: error
		}
	}
}






export default TldrHome;