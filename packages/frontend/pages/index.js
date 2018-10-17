import React, {Fragment} from 'react';
import { withFormik } from 'formik';
import Head from 'next/head'

import styles from '../components/cinderblock/styles/styles';
import swatches from '../components/cinderblock/styles/swatches';
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
	Toast,
	Touch,
	Modal,
	Picker,
	Prompt,
	Section,
	Sections,
	Sectionless,
	Stripe,
	Text,
	TextInput
} from '../components/cinderblock';

import Page from '../components/Page';


import { connect } from 'react-redux';
import {
	logIn,
	fetchShows,
	fetchUser
} from '../actions';


const LoginFormInner = props => {
	return(
		<Chunk>
			<form name="loginForm" onSubmit={()=>{alert('attempting to submit');}}>
				<TextInput
					keyboardType="email-address"
					placeholder="email"
					name="email"
					onChangeText={text => props.setFieldValue('email', text)}
					/>
				<TextInput
					secureTextEntry={true}
					placeholder="password"
					name="password"
					onChangeText={text => props.setFieldValue('password', text)}
					/>
				<Touch onPress={props.handleSubmit} accessibilityRole="submit" isLoading={props.isSubmitting}>
					<Button label="Log in" width="full" />
				</Touch>
			</form>
		</Chunk>
	);
}



class Hello extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			modalVisible: false,
			promptVisible: false
		}
		this.toggleModal = this.toggleModal.bind(this);
		this.togglePrompt = this.togglePrompt.bind(this);
		this.addToast = this.addToast.bind(this);
		this.toastRef = React.createRef();
	}

	static async getInitialProps(ctx){
		return {}
	}

	componentDidMount(){
		this.props.fetchShows();
	}

	toggleModal() {
		this.setState({modalVisible: !this.state.modalVisible})
	}

	togglePrompt(event) {
		this.setState({promptVisible: !this.state.promptVisible})
	}

	// this should probably come from Redux, ultimately
	// update: wow, previous you, this is smart.
	addToast(message) {
		this.toastRef.current.addToast(message);
	}

	_renderItemCard(show, i) {
		return(
			<Chunk>
				<Link style={styles.textTint} href={{pathname:'/show', query: {showId: show.id}}}>
					<Card key={i}>
						<Image source={{uri: show.photo}} style={{
							height: 200,
						}} />
						<Sectionless>
							<Chunk>
								<Text weight="strong" numberOfLines={1}>{show.title}</Text>
								<Text numberOfLines={2} type="small" color="secondary">A show that you might like</Text>
							</Chunk>
						</Sectionless>
					</Card>
				</Link>
			</Chunk>
		);
	}

	_renderItemLinear(show, i) {
		return(
			<Chunk key={i}>
				<Flex direction="row" growFactor={1}>
					<FlexItem>
						<Image source={{uri: show.photo}} style={{
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


	_renderForm(){
		const handleSubmit = (values, { props, setSubmitting, setErrors }) => {
			this.props.logIn(values);
		};

		const LoginForm = withFormik({
			handleSubmit: handleSubmit,
		})(LoginFormInner);
		return <LoginForm />;
	}

	render() {
		const {
			authentication,
			shows,
			user
		} = this.props

		return (
		<Fragment>
			<Page>
				<Head>
					<meta property='og:title' content='Cinderblock' />
					<meta property='og:description' content='This is the basics of any NextJS / Feathers app' />
					<meta property='og:image' content='http://2.bp.blogspot.com/-kZ7rq0axMJc/UVFXsdNyJcI/AAAAAAAAEMc/EZ4CM8Y-Llo/s640/modern_construction.jpg' />
					<title>Cinderblock</title>
				</Head>
				<Flex direction="column" switchDirection="large" noGutters>
					<FlexItem growFactor={5}>
						<Stripe>
							<Bounds>
								<Sections>
									<Section>
										<Chunk>
											<Text type="pageHead">Oh please work</Text>
										</Chunk>
										<Chunk>
											<Text type="sectionHead">What is this, a crossover episode?</Text>
										</Chunk>
										<Chunk>
											<Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud <Link style={styles.textTint} href={{pathname:'/other', query:{what: 'yeah'}}}>LINK LINK LINK</Link> nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
										</Chunk>
										<Chunk>
											<Text type="small" color="secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud</Text>
										</Chunk>


										{shows.loading &&
											<Chunk>
												<Text>Loading...</Text>
											</Chunk>
										}

										{!shows.loading &&
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
													//small: this._renderItemLinear,
													small: this._renderItemCard,
													medium: this._renderItemCard
												}}
												scrollItemWidth={300}
												items={shows.items}
												/>
										}

									</Section>
									<Section>
										<Chunk>
											<Text type="sectionHead">Some typing</Text>
										</Chunk>
										<Chunk>
											<Tabs>
												<Tabs.Item label="One" value="one" />
												<Tabs.Item label="Two" value="two" />
												<Tabs.Item label="Three" value="three" />
											</Tabs>
										</Chunk>
										<Chunk>
											<Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.</Text>
										</Chunk>
									</Section>
								</Sections>
							</Bounds>
						</Stripe>
					</FlexItem>
					<FlexItem growFactor={2}>
						<Stripe style={{backgroundColor: swatches.backgroundShade}}>
							<Bounds>
								<Sections>
									<Section>
										<Chunk>
											<Text type="sectionHead">Side panel</Text>
										</Chunk>
										<Chunk>
											<Text>Consectetur Lorem amet qui do. Veniam officia pariatur dolore exercitation. Enim elit do deserunt qui commodo aliquip adipisicing aliqua ea occaecat!</Text>
										</Chunk>


										{!user.id && this._renderForm()}


										<Chunk>
											<Touch onPress={this.toggleModal}>
												<Button color="secondary" label="Show modal" width="full" />
											</Touch>
											<Touch onPress={()=>{
												this.addToast("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud")
											}}>
												<Button color="secondary" label="Toast me" width="full" />
											</Touch>

											<Touch onPress={this.togglePrompt}>
												<Button color="secondary" label="Do a prompt" width="full" />
											</Touch>
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

								</Sections>
							</Bounds>
						</Stripe>
					</FlexItem>

				</Flex>

			</Page>

				<Modal
					visible={this.state.modalVisible}
					onRequestClose={this.toggleModal}
					>
					<Stripe>
						<Section isFirstChild>
							<Chunk>
								<Text type="pageHead">Modal Time</Text>
							</Chunk>
							<Chunk>
								<Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud</Text>
							</Chunk>
							<form onSubmit={this.onSubmitHandler}>
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
									<Touch>
										<Button label="Submit" />
									</Touch>
								</Chunk>
							</form>
						</Section>
					</Stripe>
				</Modal>

				<Prompt
					visible={this.state.promptVisible}
					onRequestClose={this.togglePrompt}
					onPressEnter={this.togglePrompt}
					>
					<Section isFirstChild>
						<Chunk>
							<Text type="sectionHead">What do you think?</Text>
						</Chunk>
						<Chunk>
							<Text>Here I asking a question and seeing what to do about it.</Text>
						</Chunk>
						<Chunk>
							<Touch onPress={this.togglePrompt}>
								<Button label="Let's do it" width="full" />
							</Touch>
							<Touch onPress={this.togglePrompt}>
								<Button color="secondary" label="No thanks" width="full" />
							</Touch>
						</Chunk>
					</Section>
				</Prompt>

				<Toast
					ref={this.toastRef}
					/>
			</Fragment>
		);
	}
}


const mapStateToProps = (state, ownProps) => {
	return ({
		shows: state.shows,
		user: state.user,
		authentication: state.authentication
	});
}

const actionCreators = {
	fetchShows,
	fetchUser,
	logIn
}

export default connect(
	mapStateToProps,
	actionCreators
)(Hello);

