import React, { Fragment, useState, useContext } from 'react';
import { connect } from 'react-redux';

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
	View,
	useMediaContext,
	ThemeContext
} from 'cinderblock';




import Page from '@/components/Page';
import OutpostHeader from '@/components/outpost/OutpostHeader';

import Markdown from 'markdown-to-jsx';


const outposts = {
	subreddit: [
		{
			name: '/r/AnimalCrossing',
			title: 'Animal Crossing'
		},
		{
			name: '/r/politics',
			title: 'Politics'
		},
		{
			name: '/r/apple',
			title: 'Apple'
		},
		{
			name: '/r/financialindependence',
			title: 'Financial Independence'
		},
		{
			name: '/r/QueerEye',
			title: 'Queer Eye'
		},
		{
			name: '/r/nonzerodays',
			title: 'Non-Zero Days'
		},
		{
			name: '/r/reactjs',
			title: 'ReactJS'
		},
		{
			name: '/r/sahm',
			title: 'Stay at Home Parents'
		},

	],
	twitter: [
		{
			name: '@tferriss',
			title: 'Tim Ferris'
		},
		{
			name: '@a16z',
			title: 'Andreesen Horowitz'
		},
		{
			name: '@ycombinator',
			title: 'Y Combinator'
		},
		{
			name: '@davidasinclair',
			title: 'David Sinclair PhD'
		},
		{
			name: '@tferriss',
			title: 'Tim Ferris'
		},
		{
			name: '@a16z',
			title: 'Andreesen Horowitz'
		},
		{
			name: '@ycombinator',
			title: 'Y Combinator'
		},
		{
			name: '@davidasinclair',
			title: 'David Sinclair PhD'
		},
	]
}



const HeaderContent = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	const media = useMediaContext();

	const textShadowStyle = {
		textShadowRadius: 20,
		textShadowColor: 'rgba(0,0,0,.25)'
	}
	return (
		<Section>
			<Chunk>
				<Text type="hero"
					inverted
					style={[
						{ textAlign: 'center' },
						textShadowStyle
					]}>Find the others</Text>
			</Chunk>
			<Chunk>
				<Text
					type="big"
					inverted
					style={[
						textShadowStyle,
						{ textAlign: 'center' },
						media && media.large ? { fontSize: 24, lineHeight: 34 } : {}
					]}
				>Meet up about things you follow</Text>
			</Chunk>
		</Section>
	);
};

const SearchForm = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	return (
		<Bounds style={{ maxWidth: 800 }}>
			<View style={{ position: 'relative' }}>
				<TextInput
					id="searchString"
					placeholder="Search"
					autoComplete="off"
					style={{ borderRadius: 4000, paddingLeft: 48, backgroundColor: 'white' }}
					keyboardType="web-search"
				/>
				<View style={{ position: 'absolute', top: 0, left: 16, height: '100%', justifyContent: 'center' }}>
					<Icon shape="Search" />
				</View>
				<View style={{ position: 'absolute', top: 0, right: 10, height: '100%', justifyContent: 'center' }}>
					<View style={{ backgroundColor: SWATCHES.shade, borderRadius: 4000, paddingHorizontal: 12, paddingVertical: 4 }}>
						<Text type="small" color="secondary">New York, NY</Text>
					</View>
				</View>

			</View>
		</Bounds>
	)
}

const OutpostRow = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	const {
		outposts = [],
		headline,
		site,
		toggleModal
	} = props;

	const getSampleCities = (i) => {
		const cities = [
			"Los Angeles",
			"Austin",
			"Macon",
			"Medellin",
			"Nashville",
			"Saskatoon",
			"Osaka",
			"Mexico City",
			"Bentonville",
			"Portland",
			"Pittsburgh",
			"Phoenix"
		];
		return [
			cities[(i) % cities.length],
			cities[(i + 4) % cities.length],
			cities[(i + 9) % cities.length],
			cities[(i + 7) % cities.length]
		];
	}

	const gridItem = (outpost, i) => {
		return (
			<Chunk>
				<Link href="/outpost/events">
					<Card style={[thisCardStyle]}>
						<Sectionless style={{/*backgroundColor: SWATCHES.tint*/ }}>
							<Chunk>
								<View style={{ marginBottom: 4 }}>
									<Text type="small" color="secondary" numberOfLines={1}>
										<Image
											source={{ uri: `https://api.faviconkit.com/${site}/32` }}
											style={{
												width: 13,
												height: 13,
												resizeMode: 'contain',
												flex: 1,
												marginRight: 4,
												marginBottom: -2
											}}
										/>
										{outpost.name}
									</Text>
									<Text type="big" color="tint" numberOfLines={2}>{outpost.title}</Text>
								</View>

								<Text type="small" color="hint" numberOfLines={4}>Meeting in: {getSampleCities(i).join(', ')}...</Text>

							</Chunk>
						</Sectionless>
					</Card>
				</Link>
			</Chunk>
		);
	}

	return (
		<Section>
			<Chunk>
				<Touch onPress={toggleModal}>
					<Text type="sectionHead">{headline}</Text>
				</Touch>
			</Chunk>

			<List
				scrollItemWidth={240}
				items={outposts}
				variant={{
					small: "grid",
					medium: "grid"
				}}
				itemsInRow={{
					small: 2,
					medium: 2,
					large: 4
				}}
				renderItem={{
					small: gridItem,
					medium: gridItem
				}}
			/>
		</Section>
	);
}


function Splash(props) {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

	// modal visibility
	const [modalVisible, setModalVisible] = useState(false);
	const toggleModal = () => {
		setModalVisible(!modalVisible);
	}

	const headerImageSource = `https://source.unsplash.com/Jztmx9yqjBw/1900x800`

	return (
		<Fragment>
			<Page hideHeader>

				<Stripe
					style={{ paddingTop: 0, backgroundColor: '#2E3894' }}
					imageHeight={{ small: 360, medium: 400, large: 400, xlarge: 475 }}
					image={headerImageSource}
				>
					<OutpostHeader type="transparent" inverted={true} />
					<View style={{ justifyContent: 'center', flex: 1, paddingHorizontal: METRICS.space }}>
						<Bounds>
							<HeaderContent />
						</Bounds>
					</View>
				</Stripe>
				<Stripe style={{ backgroundColor: SWATCHES.backgroundShade }}>
					<Bounds>

						<Section style={{ paddingTop: METRICS.space / 2, paddingBottom: METRICS.space / 4 }}>
							<SearchForm />
						</Section>

						<OutpostRow
							outposts={outposts.subreddit}
							headline="Topics and interests from&nbsp;Reddit"
							site="reddit.com"
							toggleModal={toggleModal}
						/>

						<OutpostRow
							outposts={outposts.twitter}
							headline="People and organizations from&nbsp;Twitter"
							site="twitter.com"
							toggleModal={toggleModal}
						/>

					</Bounds>
				</Stripe>

			</Page>

			<Modal
				visible={modalVisible}
				onRequestClose={toggleModal}
			>
				<Stripe>
					<Section>
						<Chunk>
							<Text type="pageHead">Find outposts</Text>
						</Chunk>
						<Chunk>
							<Text>Search for interests, subreddits, or twitter accounts that you follow</Text>
						</Chunk>
						<SearchForm />
						<Button label="Search" width="full" />
					</Section>
				</Stripe>
			</Modal>
		</Fragment>
	);



}

const thisCardStyle = {
	borderWidth: 0,
	shadowRadius: 16,
	shadowColor: 'rgba(0,0,0,.15)',
	marginVertical: 0
}

export default Splash;