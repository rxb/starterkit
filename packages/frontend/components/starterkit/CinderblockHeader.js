import React, { Fragment, useState, useEffect, useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	addToast,
	showToast,
	showDelayedToasts,
	logOut,
	updateUi
} from '../../actions';


import feathersClient from '../FeathersClient'; // already instantiated so we can share


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
	ThemeContext
} from 'cinderblock';



function CinderblockHeader(props) {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

	// data from redux
	const dispatch = useDispatch();
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

	const userMenu = useRef(null);

	return (

		<Header maxWidth="auto">
			<Flex direction="row">
				<FlexItem>
					<Link href="/">
						<Inline>
							<Icon shape="FileText" color={SWATCHES.tint} />
							<Text weight="strong" color="tint">CINDERBLOCK</Text>
						</Inline>
					</Link>
				</FlexItem>
				<FlexItem align="flex-end">

					<Fragment>
						{user.id &&
							<Fragment>
								<Touch onPress={() => userMenu.current.toggle()}>
									<Inline>
										<Avatar
											source={{ uri: user.photoUrl }}
											size="small"
										/>
										<Text>{user.name}</Text>
									</Inline>
								</Touch>

								<Menu ref={userMenu}>
									<Sectionless>
										<Chunk>
											{['Profile', 'Settings', 'Log out'].map((item, i) => (
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
							<Touch onPress={() => {
								dispatch(updateUi({ logInModalVisible: true }))
							}}><Text color="tint">Log in</Text></Touch>
						}
					</Fragment>
				</FlexItem>
			</Flex>
		</Header>

	);

}



export default CinderblockHeader;