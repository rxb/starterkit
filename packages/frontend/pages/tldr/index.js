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


// SCREEN-SPECIFIC 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import { CATEGORY_COLORS } from '@/components/tldr/testcolors';


const TextFeature = (props) => {
	const styleKey = props.less ? 'textFeatureLess' : 'textFeature';
	return(
		<Text style={[homeStyles[styleKey], props.style]} styleIds={homeIds[styleKey]}>{props.children}</Text>
	)
}; 

function TldrHome(props) {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

	const dispatch = useDispatch();
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

	const categories = pageHelper(useSWR( getCategoriesUrl({ '$limit': 1000 }), { fallbackData: props.categoriesData }
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
				hideSearch={true}
				type="transparent"
				/>
				<Stripe>
					<View style={homeStyles.heroStripe} dataSet={{ media: homeIds.heroStripe}} >
						<Bounds>
							<Section>
								{/*
								<Chunk>
									<TextFeature>Brutally concise &amp; useful cards</TextFeature>									
									<TextFeature>that make you non-helpless</TextFeature>
									<TextFeature>about important skills &amp; subjects</TextFeature>
								</Chunk>
								*/}
								{/*
								<Chunk>
									<TextFeature>Quick and useful cards</TextFeature>
									<TextFeature>that make you non-helpless</TextFeature>
									<TextFeature>about important skills &amp; subjects</TextFeature>
								</Chunk>
								*/}
								{/*
								<Chunk>
									<TextFeature>Quick cards</TextFeature>
									<TextFeature>to make you non-helpless</TextFeature>
									<TextFeature>about big subjects &amp; skills</TextFeature>
								</Chunk>
								<Chunk>
									<TextFeature less>Written and improved by everyone</TextFeature>
								</Chunk>
								*/}
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
										<Chunk style={homeStyles.explainBlock} dataSet={{ media: homeIds.explainBlock}}>
											<Text style={homeStyles.explainText} dataSet={{ media: homeIds.explainText}} weight="strong">
												Brutally concise &amp; userful cards{"\n"}
												with the most essential knowlege{"\n"}
												about big subjects &amp; skills{"\n"}
											</Text>
											<Text style={homeStyles.explainText} dataSet={{ media: homeIds.explainText}} color="secondary">Written and improved by everyone</Text>
										</Chunk>
									</FlexItem>
								</Flex>
								</View>
							</Section>
						</Bounds>
					</View>
				</Stripe>

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
		</Page>
	);
}

// just really needed an extra breakpoint for 3 categories across width
// TODO: consider adding to breakpoints?
const {styles: homeStyles, ids: homeIds} = StyleSheet.create({
	heroStripe: {
		minHeight: 200,
		paddingTop: 10,
		paddingBottom: 15,
		justifyContent: 'center',
		[MEDIA_QUERIES_SINGLE.large]: {
			paddingTop: 0,
			minHeight: 230,
			paddingBottom: 20,
		}
	},

	heroTextTop: {
		fontSize: 64,
		lineHeight: 64,
		fontWeight: 700,
		marginBottom: 4,
		letterSpacing: '-.001em',
		[MEDIA_QUERIES_SINGLE.large]: {
			fontSize: 72,
			lineHeight: 72,
		}
	},

	heroTextBottom: {
		letterSpacing: '-.001em',
		fontSize: 28,
		lineHeight: 28,
		fontWeight: 700,
		[MEDIA_QUERIES_SINGLE.large]: {
			fontSize: 32,
			lineHeight: 32,
		}
	},

	explainBlock: {
		marginTop: 8,
		[MEDIA_QUERIES_SINGLE.large]: {
			marginTop: 6,
		}
	},

	explainText: {
		lineHeight: 23,
		marginBottom: 5,
		[MEDIA_QUERIES_SINGLE.large]: {
			textAlign: 'right',
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