import React, {Fragment, useState, useEffect, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	addToast,
	showToast,
	showDelayedToasts,
	logOut,
	updateUi
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
	Sectionless,
	Stripe,
	Text,
	TextInput,
	View,
} from './cinderblock';



function TldrHeader (props) {
	
	// data from redux
	const dispatch = useDispatch(); 
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

	const userMenu = useRef(null);

	return (

				<Header>
					<Flex direction="row">
						<FlexItem>
							<Link href="/tldr">
								<Inline>
									<Icon shape="FileText" color={swatches.tint} />
									<Text weight="strong" color="tint" type="big">tldr</Text>
								</Inline>
							</Link>
						</FlexItem>
							<FlexItem align="flex-end">
									
									<Fragment>
										{user.id &&
											<Fragment>
												<Touch onPress={()=> userMenu.current.toggle()}>
													<Inline>
														<Avatar
															source={{uri: user.photoUrl}}
															size="small"
															/>
														<Text>{user.name}</Text>
													</Inline>
												</Touch>

												<Menu ref={userMenu}>
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
											<Touch onPress={()=>{
												dispatch(updateUi({logInModalVisible: true}))
											}}><Text color="tint">Log in</Text></Touch>
										}
									</Fragment>
							</FlexItem>
					</Flex>
				</Header>

	);

}



export default TldrHeader;