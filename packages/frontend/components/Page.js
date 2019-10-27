import React, {Fragment} from 'react';
import Head from 'next/head'

import NProgress from 'nprogress'
NProgress.configure({ trickle: true, trickleSpeed: 400, showSpinner: false });

import Router from 'next/router'
Router.onRouteChangeStart = (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start()
}
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()


import { connect } from 'react-redux';
import {
	addToast,
	//logInAndFetchUser,
	logIn,
	logInFailure,
	logOut,
} from '../actions';

import feathersClient from '../components/FeathersClient'; // already instantiated so we can share


import styles from './cinderblock/styles/styles';
import swatches from './cinderblock/styles/swatches';
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
	LoadingBlock,
	Link,
	List,
	Touch,
	Menu,
	Modal,
	Picker,
	Section,
	Sections,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	View,
} from './cinderblock';

import LoginForm from './LoginForm';
import ConnectedToaster from './ConnectedToaster';
import ConnectedPrompter from './ConnectedPrompter';
import { checkToastableErrors } from './cinderblock/formUtils';


class Page extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			modalVisible: false,
		}
		this.toggleModal = this.toggleModal.bind(this);
	}

	componentWillReceiveProps(nextProps) {

		// going to try to do this in a chained/combo action

		/*
		// got auth, so get new user info
		if (nextProps.authentication !== this.props.authentication) {
			this.props.fetchUser('self');
		}
		*/


	}

	componentDidUpdate(prevProps){

		// got user, so dismiss modal
		// could do this on auth change, but the user fetch makes the UI jump
		if(prevProps.user !== this.props.user && this.state.modalVisible){
			this.toggleModal();
		}

		// ERROR TOASTS
		const messages = {
			authentication: {
				BadRequest: 'That was one bad request',
				NotAuthenticated: 'You shall not pass'
			}
		};
		checkToastableErrors(this.props, prevProps, messages);
	}


	toggleModal() {
		this.setState({modalVisible: !this.state.modalVisible})
	}

	render(){

		const {
			authentication = {},
			children,
			logIn,
			logInFailure,
			logOut,
			user = {}
		} = this.props;

		return (

			<View style={{minHeight: '100vh'}}>


				<Header>
					<Flex direction="row">
						<FlexItem>
							<Link href="/">
								<Inline>
									<Icon shape="FileText" color={swatches.textSecondary} />
									<Text weight="strong" color="secondary">CINDERBLOCK</Text>
								</Inline>
							</Link>
						</FlexItem>
							<FlexItem style={{alignItems: 'flex-end'}}>
									{/*
									<Fragment>
										{user.id &&
											<Fragment>
												<Inline>
													<Avatar
														source={{uri: user.photo}}
														size="small"
														/>
													<Text>{user.name}</Text>
													<Touch onPress={logOut}><Text color="tint">Log out</Text></Touch>
												</Inline>

											</Fragment>
										}

										{!user.id &&
											<Touch onPress={this.toggleModal}><Text color="tint">Log in</Text></Touch>
										}
									</Fragment>
									*/}

									<Fragment>
										{user.id &&
											<Fragment>
												<Touch onPress={()=> this.userMenu.toggle()}>
													<Inline>
														<Avatar
															source={{uri: user.photoUrl}}
															size="small"
															/>
														<Text>{user.name}</Text>
													</Inline>
												</Touch>

												<Menu ref={ref => this.userMenu = ref}>
													<Sectionless>
														<Chunk>
															{ ['Profile', 'Settings', 'Log out'].map((item, i)=>(
																<Touch onPress={feathersClient.logout} key={i}>
																	<Text color="tint" >{item}</Text>
																</Touch>
															))}

														</Chunk>
													</Sectionless>
												</Menu>

											</Fragment>
										}

										{!user.id &&
											<Touch onPress={this.toggleModal}><Text color="tint">Log in</Text></Touch>
										}
									</Fragment>
							</FlexItem>
					</Flex>
				</Header>

				<View style={{flex: 1}}>
					{children}
				</View>
				<Stripe style={{
					backgroundColor: swatches.backgroundDark,
					flex: 0,
					minHeight: 0,
					flexBasis: 'auto',
				}}>
					<Sections>
						<Section>
							<Chunk>
								<Text inverted color="secondary">This is the footer</Text>
							</Chunk>
						</Section>
					</Sections>
				</Stripe>

				<Modal
					visible={this.state.modalVisible}
					onRequestClose={this.toggleModal}
					>
					<Stripe>
						<Section type="pageHead">
							<Chunk>
								<Text type="pageHead">Log in</Text>
							</Chunk>
						</Section>
						<Section>
							<LoadingBlock isLoading={(authentication.loading || authentication.token)}>
								<LoginForm
									onSubmit={(fields)=>{
										//this.props.logInAndFetchUser(fields);
										logIn();
										feathersClient
											.authenticate({strategy: 'local', email: fields.email, password: fields.password})
											.then()
											.catch((e)=>{
												logInFailure(e)
											});

									}}
									isLoading={(authentication.loading || authentication.token)}
									/>
							</LoadingBlock>

						</Section>
					</Stripe>
				</Modal>

				<ConnectedToaster />
				<ConnectedPrompter />

			</View>

		);
	}

}


const mapStateToProps = (state, ownProps) => {
	return ({
		user: state.user,
		authentication: state.authentication,
	});
}

const actionCreators = {
	logIn,
	logOut,
	logInFailure,
	addToast,
	//logInAndFetchUser
}

export default connect(
	mapStateToProps,
	actionCreators
)(Page);