import React, { Fragment, useContext } from 'react';
import ErrorPage from 'next/error'

// SWR
import { request, pageHelper, getTldrsUrl, getCategoriesUrl, getCategoryUrl } from '@/swr';
import useSWR, { mutate } from 'swr';
import useSWRInfinite from 'swr/infinite' 

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
	ThemeContext,
	designConstants
} from 'cinderblock';

import {MEDIA_QUERIES_SINGLE} from 'cinderblock/styles/designConstants';
import Page from '@/components/Page';
import TldrHeader from '../../components/tldr/TldrHeader';
import { CategoryItem, CategoryItem2, TldrCardSmall, CreateTldrCardSmall, CategoryCardSmall, LoadMoreButton, TldrSearch } from '@/components/tldr/components';
import StyleSheet from 'react-native-media-query';


const CategoriesStripe = (props) => {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

	const categories = pageHelper(useSWR( getCategoriesUrl({ '$limit': 1000 }), { fallbackData: props.categoriesData }
	));

	// DIVERT TO ERROR PAGE
	// error from getInitialProps or the swr
	if ( categories.error ) {
		const error = categories.error;
		return (
			<Stripe style={{ flex: 1, backgroundColor: SWATCHES.notwhite}} border>
				<Bounds>
					<Section>
						<Chunk>
							<Text>There's a problem. Sorry about that.</Text>
						</Chunk>
					</Section>
				</Bounds>
			</Stripe>
		)
	}


	return(
		<>
		{ categories.data && 
			<Stripe style={{ flex: 1, backgroundColor: SWATCHES.notwhite}} border>

				<Bounds>
					<Section>
						<TldrSearch 
							variant="header" 
							hero={true}
							style={{
								marginTop: -68,
								marginBottom: 48,
								zIndex: 5,
								width: '100%',
								maxWidth: 680,
								marginHorizontal: 'auto'
							}} 
							/>
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
										{/* 
										<CategoryItem2 category={category} color={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />											
										*/}
										<CategoryItem2 category={category} color={category.color} />

									</Link>
								</Chunk>
							)}
							listIds={homeIds.catList}
							itemIds={homeIds.catListItem}
						/>
					</Section>
				</Bounds>
			</Stripe>
			}
		</>
	);
}

function TldrHome(props) {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

	const dispatch = useDispatch();
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

	return (
		<Page>
			<TldrHeader 
				hideSearch={true}
				type="transparent"
				/>
				<Stripe>
					<View style={homeStyles.heroStripe} dataSet={{ media: homeIds.heroStripe}} >
						<Bounds>
							<Section>
								<View style={{
									maxWidth: 790, 
									alignSelf: 'center',
									width: '100%'
								}}>
								<Flex direction="column" switchDirection="large">
									<FlexItem>
										<Chunk>
											<Text style={homeStyles.heroTextTop} dataSet={{ media: homeIds.heroTextTop}}>Get smart</Text>
											<Text style={homeStyles.heroTextBottom} dataSet={{ media: homeIds.heroTextBottom}}>enough to start</Text>
										</Chunk>
									</FlexItem>
									<FlexItem>
										<View style={homeStyles.explainBlock} dataSet={{ media: homeIds.explainBlock}}>
										<Chunk>
											{/*
											<Text style={[homeStyles.explainText, {fontWeight: 500}]} dataSet={{ media: homeIds.explainText}}>
												Brutally concise cards{"\n"}
												with the most useful knowledge{"\n"}
												about big subjects &amp; skills
											</Text>
											*/}
											{/*
											<Text style={[homeStyles.explainText, {fontWeight: 500}]} dataSet={{ media: homeIds.explainText}}>
												Brutally concise cards{"\n"}
												with key knowledge{"\n"}
												about big subjects &amp; skills
											</Text>
											*/}
											<Text style={[homeStyles.explainText, {fontWeight: 500}]} dataSet={{ media: homeIds.explainText}}>
												Audaciously concise cards{"\n"}
												with the most useful knowledge{"\n"}
												about big subjects &amp; skills
											</Text>
											<Text style={[homeStyles.explainText, {marginTop: 12}]} dataSet={{ media: homeIds.explainText}} color="secondary">Written and improved by everyone</Text>
										</Chunk>
										</View>
									</FlexItem>
								</Flex>
								</View>
							</Section>
						</Bounds>
					</View>
				</Stripe>

				<CategoriesStripe categoriesData={props.categoriesData} />

		</Page>
	);
}

// just really needed an extra breakpoint for 3 categories across width
// TODO: consider adding to breakpoints?
const {styles: homeStyles, ids: homeIds} = StyleSheet.create({
	heroStripe: {
		minHeight: 200,
		paddingTop: 15,
		paddingBottom: 15,
		justifyContent: 'center',
		[MEDIA_QUERIES_SINGLE.large]: {
			paddingTop: 0,
			minHeight: 230,
			paddingBottom: 20,
		}
	},

	heroTextTop: {
		/*
		fontSize: 54,
		lineHeight: 58,
		*/
		fontSize: 42,
		lineHeight: 42,
		fontWeight: 700,
		letterSpacing: '-.01em',
		textAlign: 'center',
		[MEDIA_QUERIES_SINGLE.large]: {
			textAlign: 'left',
			fontSize: 72,
			lineHeight: 74,
		}
	},

	heroTextBottom: {
		/*
		fontSize: 28,
		lineHeight: 28,
		*/
		fontSize: 42,
		lineHeight: 42,
		letterSpacing: '-.01em',
		fontWeight: 700,
		textAlign: 'center',
		[MEDIA_QUERIES_SINGLE.large]: {
			textAlign: 'left',
			fontSize: 36,
			lineHeight: 42,
		}
	},

	explainBlock: {
		/*
		borderTopWidth: 1,
		borderTopColor: designConstants.SWATCHES.border,
		paddingTop: 16,
		paddingHorizontal: 8,
		alignSelf: 'center',
		*/
		paddingTop: 4,
		[MEDIA_QUERIES_SINGLE.large]: {
			alignSelf: 'flex-end',
			marginTop: 0,
			borderTopWidth: 0,
			paddingHorizontal: 0
		}
	},

	explainText: {
		lineHeight: 22,
		fontSize: 16,
		textAlign: 'center',
		[MEDIA_QUERIES_SINGLE.large]: {
			textAlign: 'right',
			lineHeight: 23,
			fontSize: 16
		}
	},

	/*
	textFeature: {
		textAlign: 'center',
		fontSize: 22,
		lineHeight: 22*1.3,
		fontWeight: 600,
		[MEDIA_QUERIES_SINGLE.large]: {
			fontSize: 26,
			lineHeight: 26*1.25,
		}
	},
	textFeatureLess: {
		textAlign: 'center',
		fontSize: 20,
		lineHeight: 20*1.3,
		fontWeight: 300,
		color: designConstants.SWATCHES.textSecondary,
		[MEDIA_QUERIES_SINGLE.large]: {
			fontSize: 23,
			lineHeight: 23*1.25,
		}
	},
	*/

	catList: {
		[MEDIA_QUERIES_SINGLE.xlarge]: {
			marginLeft: -1 * designConstants.METRICS.space*1.5,
		},
	},
	catListItem: {
		'@media screen and (min-width: 640px) and (max-width: 839px)': {
			flexBasis: `33.33%`,
		},
		[MEDIA_QUERIES_SINGLE.xlarge]: {
			paddingLeft: designConstants.METRICS.space*1.5,
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