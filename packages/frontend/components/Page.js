import React, {Fragment, useState, useEffect, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import NProgress from 'nprogress'
NProgress.configure({ trickle: true, trickleSpeed: 400, showSpinner: false });

import Router from 'next/router'
Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();


import {
	addToast,
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
import { addToastableErrors } from './cinderblock/formUtils';



// usePrevious hook
// todo: pull this into another file to be reused
function usePrevious (value) {
	const ref = useRef();
	useEffect(() => { 
		ref.current = value 
	}, [value]);
	return ref.current;
}

function Page (props) {
	
	// data from redux
	const dispatch = useDispatch(); 
	const user = useSelector(state => state.user);
	const authentication = useSelector(state => state.authentication);

	// login modal
	const [modalVisible, setModalVisible] = useState(false);
	const toggleModal = () => {
		setModalVisible(!modalVisible);
	}

	// dismiss modal on login
	const prevUser = usePrevious(user);
	useEffect(()=>{
		// got user, so dismiss modal
		if(prevUser !== user && modalVisible){
			toggleModal();
		} 
	}, [user]);


	// errors - do separate useEffect for each error checking
	useEffect(()=>{
		addToastableErrors(dispatch, authentication, {
			BadRequest: 'That was one bad request',
			NotAuthenticated: 'You shall not pass'
		});
	},[authentication]);



	return (
		<View style={{minHeight: '100vh'}}>

				{ !props.hideHeader &&
				<Header maxWidth="auto">
					<Flex direction="row">
						<FlexItem>
							<Link href="/">
								<Inline>
									<Icon shape="FileText" color={swatches.tint} />
									<Text weight="strong" color="tint">CINDERBLOCK</Text>
								</Inline>
							</Link>
						</FlexItem>
							<FlexItem style={{alignItems: 'flex-end'}}>
									
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
											<Touch onPress={toggleModal}><Text color="tint">Log in</Text></Touch>
										}
									</Fragment>
							</FlexItem>
					</Flex>
				</Header>
				}

				<View style={{flex: 1}}>
					{props.children}
				</View>

				{/*
				<Stripe style={{
					flex: 0,
					minHeight: 0,
					flexBasis: 'auto',
				}}>
					<Bounds>

						<Sections>
							<Section>
								<Chunk>
									<Text color="secondary">Help</Text>
									<Text color="secondary">Privacy</Text>
									<Text color="secondary">This is the footer</Text>
								</Chunk>
							</Section>
						</Sections>
					</Bounds>
				</Stripe>
				*/}

				<Modal
					visible={modalVisible}
					onRequestClose={toggleModal}
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
										dispatch(logIn());
										feathersClient
											.authenticate({strategy: 'local', email: fields.email, password: fields.password})
											.then()
											.catch((e)=>{
												dispatch(logInFailure(e));
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



export default Page;