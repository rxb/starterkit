import 'isomorphic-unfetch';

import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Head from 'next/head'
import uuid from 'uuid/v1';

import {
	logInAndFetchUser,
	reauthenticate,
	setUser,
	logOut,
	addPrompt
} from '../actions';


import {
	Avatar,
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
	Label,
	List,
	Link,
	LoadingBlock,
	Modal,
	Picker,
	Section,
	Sections,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch
} from '../components/cinderblock';


import styles from '../components/cinderblock/styles/styles';
import Page from '../components/Page';
import LoginForm from '../components/LoginForm';


// FEATHERS CLIENT
// let's try to get feathers client going
import feathers from '@feathersjs/client';
//import io from 'socket.io-client';

const apiUrl = 'http://localhost:3030';
//const socket = io(apiUrl);

const client = feathers();
const authenticationOptions = {};
if (process.browser) {
	authenticationOptions["storage"] = window.localStorage
}
client.configure(feathers.authentication(authenticationOptions));
client.configure(feathers.rest(apiUrl).fetch(fetch));
//client.configure(feathers.socketio(socket));



class Scratch extends React.Component {

	static async getInitialProps (context) {
		return {};
	}

	constructor(props){
		super(props);
		this.state = {
			things: [],
			showPrompt: false,
			user: {}
		}
	}

	logout(){
		client.logout();
	}

	loginLocal(fields){
		client.authenticate({strategy: 'local', email: fields.email, password: fields.password});
		// FYI, oauth login from passed access token in query string happens automatically on page load
		// in react native it might need some help
	}

	componentDidMount(){

		client.on('login', (authResult, params, context) => {
			this.setState({user: authResult.user});
			this.props.reauthenticate(authResult.token);
			this.props.setUser(authResult.user);
		});

		client.on('logout', (authResult, params, context) => {
			this.setState({user: {} });
			this.props.logOut();
		});

		// existing token?
		client.reAuthenticate();

	}

	render() {

		const DeletePrompt = (props) => {
			const {
				thing,
				onRequestClose
			} = props;
			return (
				<Sectionless>
					<Chunk>
						<Text type="sectionHead">Are you sure?</Text>
					</Chunk>
					<Chunk>
						<Text>Deleting your comment {thing.id}</Text>
					</Chunk>
					<Chunk>
						<Button
							onPress={()=>{
								const things = [...this.state.things];
								const index = things.findIndex(item => item.id == thing.id);
								if(index >= 0){
									things.splice(index, 1);
									this.setState({things: things});
								}
								onRequestClose();
							}}
							label="Yes I'm sure"
							width="full"
							/>
						<Button
							onPress={()=>{
								onRequestClose();
							}}
							label="No thanks"
							color="secondary"
							width="full"
							/>
					</Chunk>

				</Sectionless>
			)
		};


		const {
			user
		} = this.props;
		const {
			things
		} = this.state;

		return (
			<Fragment>
			<Page>
				<Head>
					<meta property='og:title' content='Scratch' />
					<title>Scratch</title>
				</Head>
				<Stripe>
					<Bounds>
						<Sections>
							<Section type="pageHead">
								<Chunk>
									<Text type="pageHead">Scratch</Text>
								</Chunk>
							</Section>

								<Flex direction="column" switchDirection="large">
									<FlexItem>
										{ !this.state.user.id &&
											<Fragment>
												<Section>
													<Chunk>
														<Button
														  	width="full"
															label="log in with Facebook"
															onPress={()=>{
																location.href='http://localhost:3030/oauth/facebook/'
															}}
															/>
														<Button
														  	width="full"
															label="log in with Google"
															onPress={()=>{
																location.href='http://localhost:3030/oauth/google/'
															}}
															/>
														<Button
														  	width="full"
															label="log in with Reddit"
															onPress={()=>{
																location.href='http://localhost:3030/oauth/reddit/'
															}}
															/>
													</Chunk>
												</Section>
												<Section>
													<LoginForm
														onSubmit={(fields)=>{
															this.loginLocal(fields);
														}}
														/>
												</Section>
											</Fragment>
										}
										{ this.state.user.id &&
											<Section>
												<Chunk>
													<Button
													  	width="full"
														label="log out"
														onPress={this.logout}
														/>
												</Chunk>
											</Section>
										}
									</FlexItem>
									<FlexItem>
										<Section>
											<Chunk>
												<Avatar
													source={{uri: this.state.user.photoUrl}}
													size="large"
													/>
												<Text type="big">{this.state.user.name}</Text>
												<Text color="hint">{this.state.user.email}</Text>
											</Chunk>
											<Chunk>
												<Text>USER: {JSON.stringify(this.state.user)}</Text>
											</Chunk>
										</Section>
									</FlexItem>
								</Flex>


							<Section>
								  {things.map(thing => (
								  		<Chunk>
									  		<Text>{thing.message} {thing.id}</Text>
									  		<Link  onPress={()=>{
												this.props.addPrompt( <DeletePrompt thing={thing} /> );
									  		}}>
									  			<Text color="tint">Delete</Text>
									  		</Link>
									  	</Chunk>


								  ))}


								{/*
								<Chunk>
									<Button
										label="add thing"
										onPress={()=>{
											const things = [...this.state.things];
											things.push({message: 'ok new thing', id: uuid()});
											this.setState({things: things});
										}}
										/>
								</Chunk>
								*/}

							</Section>
						</Sections>
					</Bounds>
				</Stripe>

			</Page>

			</Fragment>
		);
	}
}


const mapStateToProps = (state, ownProps) => {
	return ({
		user: state.user
	});
}

const actionCreators = {
	addPrompt,
	reauthenticate,
	setUser,
	logOut
};

export default connect(
	mapStateToProps,
	actionCreators
)(Scratch);

