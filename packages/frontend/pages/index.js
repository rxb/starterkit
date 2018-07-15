import React, {Fragment} from 'react';
import { withFormik } from 'formik';

import { Image } from './cinderblock/primitives';
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
	Link,
	List,
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
} from './cinderblock';
import styles from './cinderblock/styles/styles';
import swatches from './cinderblock/styles/swatches';
import Page from './components/Page';

import loremIpsum from 'lorem-ipsum';


import { connect } from 'react-redux';
import {
	fetchShows,
} from '../actions';

//require('isomorphic-fetch');
//const apiHost = 'http://localhost:3030/';

// for ssr auth
import cookies from 'next-cookies';


const LoginFormInner = props => {
		return(
			<Chunk>
				<form name="loginForm">
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
					<Touch onPress={props.handleSubmit}>
						<Button label="Log in" width="full" type="submit" />
					</Touch>
				</form>
			</Chunk>
		);
}



class Hello extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			//shows: this.props.shows,
			users: this.props.users,
			jwt: this.props.jwt,
			modalVisible: false,
			promptVisible: false
		}
		this.toggleModal = this.toggleModal.bind(this);
		this.togglePrompt = this.togglePrompt.bind(this);
		this.addToast = this.addToast.bind(this);
		this.toastRef = React.createRef();
	}

	static async getInitialProps(ctx){
		/*
		const { jwt } = cookies(ctx);
		const shows = await fetch(`${apiHost}shows/`)
			.then(res => res.json())
			.then(json => json.data);
		const users = await fetch(`${apiHost}users/`, {
				headers: {
					'Authorization': `${jwt}`
				}
			})
			.then(res => res.json())
			.then(json => json.data);
		return {
			shows: [...shows, ...shows, ...shows, ...shows],
			users: users,
			jwt: jwt
		}
		*/
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
	addToast(message) {
		this.toastRef.current.addToast(message);
	}

	_renderItemCard(show, i) {
		return(
			<Chunk>
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
			const jsonString = JSON.stringify({
				strategy: 'local',
				...values
			});
			fetch(`${apiHost}authentication/`, {
					method: 'POST',
					headers: {
				      'Accept': 'application/json',
				      'Content-Type': 'application/json'
				    },
					body: jsonString
				})
				.then((response)=>response.json())
				.then((json)=>{
					this.setState({jwt: json.accessToken});
					document.cookie = `jwt=${json.accessToken}`
				});
		};

		const LoginForm = withFormik({
			handleSubmit: handleSubmit,
		})(LoginFormInner);
		return <LoginForm />;
	}

	render() {
		const {
			shows
		} = this.props

		return (
		<Fragment>
			<Page>

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
											<Text type="small" color="secondary">{loremIpsum({count: 3})}</Text>
										</Chunk>

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
											items={shows}
											/>

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
											<Text>{loremIpsum({count: 3})}</Text>
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
											<Text>Consectetur Lorem amet qui do. Veniam officia pariatur dolore exercitation. Enim elit do deserunt qui commodo aliquip adipisicing aliqua ea occaecat.</Text>
										</Chunk>


										{this._renderForm()}


										<Chunk>

											<Touch onPress={this.toggleModal}>
												<Button color="secondary" label="Show modal" width="full" />
											</Touch>
											<Touch onPress={()=>{
												this.addToast(loremIpsum({count: 1}))
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

									{ this.state.jwt &&
										<Section>
											<Text type="sectionHead">Hello I am user</Text>
											<Text>{this.state.jwt}</Text>
											<Text>{JSON.stringify(this.state.users)}</Text>
										</Section>
									}
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
								<Text>{loremIpsum({count: 4})}</Text>
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
		shows: state.shows
	});
}

const actionCreators = {
	fetchShows
}

export default connect(
	mapStateToProps,
	actionCreators
)(Hello);

