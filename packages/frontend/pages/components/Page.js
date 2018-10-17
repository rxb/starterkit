import React, {Fragment} from 'react';
import { withFormik } from 'formik';
import Head from 'next/head'
import NProgress from 'nprogress'
import Router from 'next/router'

NProgress.configure({ trickle: true, trickleSpeed: 400, showSpinner: false });

Router.onRouteChangeStart = (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start()
}

Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()


import { connect } from 'react-redux';
import {
	logIn,
	logOut,
	fetchUser
} from '../../actions';


import {
  Platform,
  View,
  Text as ReactText,
  StyleSheet
} from '../cinderblock/primitives';

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
	Link,
	List,
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
} from '../cinderblock';

import styles from '../cinderblock/styles/styles';
import swatches from '../cinderblock/styles/swatches';


class Menu extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			visible: false,
		}
		this.toggle = this.toggle.bind(this);
	}

	toggle(){
		this.setState({visible: !this.state.visible});
	}

	render(){
		const {
			children,
			visible,
		} = this.props;
		return (
			<View style={styles['menu-container']}>
			{ this.state.visible &&
				<View style={styles.menu}>
						{children}
				</View>
			}
			</View>
		);
	}
};




const LoginFormInner = props => {
	return(
		<Chunk>
			<form name="loginForm">
				<TextInput
					keyboardType="email-address"
					placeholder="email"
					name="email"
					defaultValue={props.values.email}
					onChangeText={text => props.setFieldValue('email', text)}
					/>
				<TextInput
					secureTextEntry={true}
					placeholder="password"
					name="password"
					defaultValue={props.values.password}
					onChangeText={text => props.setFieldValue('password', text)}
					/>
				<Touch onPress={props.handleSubmit}>
					<Button label="Log in" width="full" type="submit" />
				</Touch>
			</form>
		</Chunk>
	);
}


class Page extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			modalVisible: false,
		}
		this.toggleModal = this.toggleModal.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		// this stuff and the form could be
		// separated into its own component i think

		// got auth, so get new user info
		if (nextProps.authentication !== this.props.authentication) {
			console.log('pagejs');
			this.props.fetchUser('self');
		}

		// got user, so dismiss modal
		// could do this on auth change, but the user fetch makes the UI jump
		if(nextProps.user !== this.props.user && this.state.modalVisible){
			this.toggleModal();
		}
	}


	toggleModal() {
		this.setState({modalVisible: !this.state.modalVisible})
	}

	_renderForm(){
		let formState = {};

		const handleSubmit = (values, { props, setSubmitting, setErrors }) => {
			this.props.logIn(values);
		};

		const LoginForm = withFormik({
			handleSubmit: handleSubmit,
		})(LoginFormInner);
		return <LoginForm />;
	}

	render(){

		const {
			authentication = {},
			children,
			logOut,
			user = {}
		} = this.props;

		return (

			<View style={{minHeight: '100%'}}>


				<Header>
					<Flex direction="row">
						<FlexItem>
							<Link href="/">
								<Inline>
									<Icon shape="FileText" />
									<Text>CINDERBLOCK</Text>
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
															source={{uri: user.photo}}
															size="small"
															/>
														<Text>{user.name}</Text>
													</Inline>
												</Touch>

												<Menu ref={ref => this.userMenu = ref}>
													<Sectionless>
														<Chunk>
															{ ['Profile', 'Settings', 'Log out'].map(item=>(
																<Touch onPress={logOut}>
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
						<Section isFirstChild>
							<Chunk>
								<Text type="pageHead">Log in</Text>
							</Chunk>

							{!authentication.token && this._renderForm()}

							{authentication.token &&
								<Text>Welcome back!</Text>
							}

						</Section>
					</Stripe>
				</Modal>
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
	fetchUser
}

export default connect(
	mapStateToProps,
	actionCreators
)(Page);