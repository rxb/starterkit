import React, { Fragment, useEffect, useState, useContext } from 'react';

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addToast, addPrompt } from '@/actions';

// SWR
import { request, pageHelper, getShowsUrl } from '@/swr';
import useSWR, { mutate } from 'swr';

// COMPONENTS
import {
	Bounds,
	Button,
	Card,
	CheckBox,
	Chunk,
	Flex,
	FlexItem,
	Icon,
	Inline,
	Image,
	Link,
	List,
	LoadingBlock,
	Tabs,
	Touch,
	Modal,
	Picker,
	Section,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	ThemeContext
} from 'cinderblock';
import CinderblockPage from '../components/starterkit/CinderblockPage';
import LoginForm from '../components/LoginForm';
import ShowCard from '../components/starterkit/ShowCard';
import Head from 'next/head'



const FakePrompt = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	const {
		onRequestClose
	} = props;
	return (
		<Section>
			<Chunk>
				<Text type="sectionHead">What do you think?</Text>
			</Chunk>
			<Chunk>
				<Text>Here I asking a question and seeing what to do about it.</Text>
			</Chunk>
			<Chunk>
				<Button
					onPress={onRequestClose}
					label="Let's do it"
					width="full"
				/>
				<Button
					onPress={onRequestClose}
					color="secondary"
					label="No thanks"
					width="full"
				/>
			</Chunk>
		</Section>
	);
};



function Hello() {

	const shows = pageHelper(useSWR(getShowsUrl()));

	// data from redux
	const dispatch = useDispatch();
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

	// modal visibility
	const [modalVisible, setModalVisible] = useState(false);
	const toggleModal = () => {
		setModalVisible(!modalVisible);
	}

	const _renderItemCard = (show, i) => {
		return (
			<Chunk key={i}>
				<Link style={styles.textTint} href={{ pathname: '/show', query: { showId: show.id } }}>
					<ShowCard show={show} />
				</Link>
			</Chunk>
		);
	}

	const _renderItemLinear = (show, i) => {
		return (
			<Chunk key={i}>
				<Flex direction="row" growFactor={1}>
					<FlexItem>
						<Image source={{ uri: show.photoUrl }} style={{
							height: 80,
						}} />
					</FlexItem>
					<FlexItem growFactor={3}>
						<Chunk>
							<Text weight="strong" numberOfLines={1}>{show.title}</Text>
							<Text numberOfLines={2} type="small" color="secondary">A show that you might like</Text>
						</Chunk>
					</FlexItem>
				</Flex>
			</Chunk>
		);
	}


	return (
		<Fragment>
			<CinderblockPage>

				<Head>
					<meta property='og:title' content='Cinderblock' />
					<meta property='og:description' content='This is the basics of any NextJS / Feathers app' />
					<meta property='og:image' content='http://2.bp.blogspot.com/-kZ7rq0axMJc/UVFXsdNyJcI/AAAAAAAAEMc/EZ4CM8Y-Llo/s640/modern_construction.jpg' />
					<title>Cinderblock</title>
				</Head>

				<Flex direction="column" switchDirection="large" flush>
					<FlexItem growFactor={5} flush>
						<Stripe>
							<Bounds>
								<Section>
									<Chunk>
										<Text type="hero">Hey hello!</Text>
									</Chunk>
									<Chunk>
										<Text type="big">What is this, a crossover episode?</Text>
									</Chunk>

									<Chunk>
										<Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. <Link style={styles.textTint} href={{ pathname: '/other', query: { what: 'yeah' } }}>Check out this test form</Link> nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</Text>
									</Chunk>
									<Chunk>
										<Text type="small" color="secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud</Text>
									</Chunk>

								</Section>
								<Section>
									{!shows.data && shows.error &&
										<Chunk>
											<Text>Loading...</Text>
										</Chunk>
									}

									{shows.data &&
										<List
											variant={{
												small: "scroll",
												//small: "linear",
												medium: "grid"
											}}
											itemsInRow={{
												small: 1,
												medium: 2,
												large: 3
											}}
											renderItem={{
												//small: _renderItemLinear,
												small: _renderItemCard,
												medium: _renderItemCard
											}}
											scrollItemWidth={300}
											items={[...shows.data.items, ...shows.data.items]}
										/>
									}

								</Section>
								<Section>
									<Chunk>
										<Text type="sectionHead">Testing tabs</Text>
									</Chunk>
									<Chunk>
										<Tabs>
											<Tabs.Item label="One" value="one" />
											<Tabs.Item label="Two" value="two" />
											<Tabs.Item label="Three" value="three" />
										</Tabs>
									</Chunk>
									<Chunk>
										<Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
									</Chunk>
								</Section>
							</Bounds>
						</Stripe>
					</FlexItem>
					<FlexItem growFactor={2} flush>
						<Stripe style={{ backgroundColor: SWATCHES.backgroundShade }}>
							<Bounds>
								<Section>
									<Chunk>
										<Text type="sectionHead">Side panel</Text>
									</Chunk>
									<Chunk>
										<Text>Consectetur Lorem amet qui do. Veniam officia pariatur dolore exercitation. Enim elit do deserunt qui commodo aliquip adipisicing aliqua ea occaecat!</Text>
									</Chunk>

									{!user.id &&
										<LoginForm />
									}

									<Chunk>
										<Button
											onPress={toggleModal}
											color="secondary"
											label="Show modal"
											width="full"
										/>
										<Button
											color="secondary"
											label="Toast me"
											width="full"
											onPress={() => {
												dispatch(addToast("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."));
											}}
										/>
										<Button
											onPress={() => {
												dispatch(addPrompt(<FakePrompt />))
											}}
											color="secondary"
											label="Do a prompt"
											width="full"
										/>
									</Chunk>


									<Chunk>
										<Inline>
											<Icon shape="FileText" />
											<Icon shape="Gift" />
											<Icon shape="Moon" />
											<Icon shape="Heart" />
											<Icon shape="Zap" />
										</Inline>
									</Chunk>
								</Section>

							</Bounds>
						</Stripe>
					</FlexItem>

				</Flex>

			</CinderblockPage>

			<Modal
				visible={modalVisible}
				onRequestClose={toggleModal}
			>
				<Stripe>
					<Section type="pageHead">
						<Chunk>
							<Text type="pageHead">Modal Time</Text>
						</Chunk>
						<Chunk>
							<Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud</Text>
						</Chunk>
					</Section>
					<Section>
						<form>
							<Chunk>
								<Text type="label">Pick one of these</Text>
								<Picker>
									<Picker.Item label="One" value="java" />
									<Picker.Item label="Two" value="js" />
									<Picker.Item label="Three" value="js" />
									<Picker.Item label="Four" value="js" />
								</Picker>
							</Chunk>
							<Chunk>
								<Text type="label">Tell me about yourself</Text>
								<TextInput placeholder="description" multiline numberOfLines={4} />
							</Chunk>
							<Chunk>
								<input type="hidden" name="strategy" value="local" />
								<Button label="Submit" />
							</Chunk>
						</form>
					</Section>
				</Stripe>
			</Modal>

		</Fragment>
	);
}

export default Hello;