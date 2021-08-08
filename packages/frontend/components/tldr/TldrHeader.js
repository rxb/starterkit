import React, { Fragment, useState, useEffect, useRef, useCallback, useContext } from 'react';


// SWR
import { request, getCategoriesUrl } from '@/swr';
import useSWR, { mutate } from 'swr';

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addToast, updateUi } from '@/actions';

// URLS
import { detourIfAuthNeeded, getProfilePageUrl, getProfileEditPageUrl, getTldrEditPageUrl, getIndexPageUrl, getCategoryPageUrl, getSavedPageUrl } from './urls';

// COMPONENTS
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
	RevealBlock,
	Section,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	useFormState,
	View, ThemeContext
} from 'cinderblock';
import { TldrSearch, TldrSearchInHeader } from './components';
import ConnectedDropdownTouch from '@/components/ConnectedDropdownTouch';
import feathersClient from '@/components/FeathersClient'; // already instantiated so we can share
import Router from 'next/router'





const UserDropdown = (props) => {
	const { styles, ids, METRICS, SWATCHES } = useContext(ThemeContext);
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};
	const { onRequestClose } = props;
	const [loading, setLoading] = useState(false);
	return (
		<Sectionless>
			<LoadingBlock isLoading={loading}>
				<Chunk>

					<Link href={getProfilePageUrl({ userId: user.id })} >
						<Text color="tint" >Profile</Text>
					</Link>
					<Link href={getSavedPageUrl()} >
						<Text color="tint" >Saved</Text>
					</Link>
					<Link href={getProfileEditPageUrl()} >
						<Text color="tint" >Settings</Text>
					</Link>
					<Touch onPress={async () => {
						setLoading(true);
						await feathersClient.logout();
						onRequestClose();
						setLoading(false);
					}}>
						<Text color="tint" >Log out</Text>
					</Touch>
				</Chunk>
			</LoadingBlock>
		</Sectionless>
	);
}

function TldrHeader(props) {
	const { styles, ids, SWATCHES, METRICS } = useContext(ThemeContext);

	const { 
		hideLogo,
		hideWordmark,
		hideSearch,
		position = "static",
		type = "separated"
	} = props

	// data from redux
	const dispatch = useDispatch();
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};
	const ui = useSelector(state => state.ui);

	// auth action with redirect through auth if needed	
	const createButtonOnPress = () => {
		detourIfAuthNeeded(getTldrEditPageUrl(), authentication, dispatch, Router);
	}

	return (
		<Header 
			position={position}
			type={type}
			>
			<Flex direction="row">
				<FlexItem shrink justify="center">
					<Link href={getIndexPageUrl()} style={{height: '100%'}}>
						<Image 
							source={{uri: '/static/tldr_logo.svg'}}
							style={{width: 45*197/150, height: 45, resizeMode: 'contain'}}
							/>
					</Link>
				</FlexItem>
				
				<FlexItem justify="center">
				{ !hideSearch && 
					<View style={[styles['hide'], {marginHorizontal: 'auto', maxWidth: 600, width: '100%'}]} dataSet={{ media: ids["showAt__large"] }}>
						<TldrSearch variant="header" />
					</View>
				}
				</FlexItem>
				<FlexItem
					shrink
					align="flex-end"
					justify="center"
					dataSet={{ media: ids["hideAt__large"] }}
				>
					<Touch
						onPress={() => {
							dispatch(updateUi({ searchOverlayActive: true }))
						}}>
						<Icon
							shape="Search"
							color={SWATCHES.tint}
						/>
					</Touch>
				</FlexItem>
				<FlexItem
					shrink
					align="flex-end"
					justify="center"
				>
					<Touch
						onPress={createButtonOnPress}>
						<Icon
							shape="PlusSquare"
							color={SWATCHES.tint}
						/>
					</Touch>
				</FlexItem>
				<FlexItem
					shrink
					align="flex-end"
					justify="center"
				>
					<Fragment>
						{user && user.id &&
							<ConnectedDropdownTouch dropdown={<UserDropdown />} >
								<Inline nowrap>
									<Avatar
										source={{ uri: user.photoUrl }}
										size="small"
									/>
									<Icon
										shape="ChevronDown"
										size="xsmall" 
										color={SWATCHES.textHint}
										style={{marginLeft: -3}}
									/>
								</Inline>
							</ConnectedDropdownTouch>
						}

						{!user.id && ui.probablyHasAccount &&
							<Touch onPress={() => {
								dispatch(updateUi({
									logInModalVisible: true,
									logInModalOptions: {
										authUi: 'login'
									}
								}));
							}}>
								<Text color="tint" nowrap>Log in</Text>
							</Touch>
						}

						{!user.id && !ui.probablyHasAccount &&
							<Touch onPress={() => {
								dispatch(updateUi({
									logInModalVisible: true,
									logInModalOptions: {
										authUi: 'register'
									}
								}));
							}}><Text color="tint" nowrap>Sign up</Text></Touch>
						}

					</Fragment>
				</FlexItem>
			</Flex>

		</Header>

	);
}

export default TldrHeader;