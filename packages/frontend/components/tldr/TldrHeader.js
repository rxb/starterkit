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
import {TldrSearch, TldrSearchInHeader} from './components';
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

	// data from redux
	const dispatch = useDispatch();
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};
	const ui = useSelector(state => state.ui);

	// auth action with redirect through auth if needed	
	const createButtonOnPress = () => {
		detourIfAuthNeeded( getTldrEditPageUrl(), authentication, dispatch, Router);
	}

	return (
		<Header position="static">
			<Flex direction="row">
				<FlexItem shrink justify="center">
					<Link href={getIndexPageUrl()}>
						<Inline nowrap>
							<Icon shape="FileText" color={SWATCHES.tint} />
							<Text weight="strong" color="tint" type="big">tldr</Text>
						</Inline>
					</Link>
				</FlexItem>
				
				<FlexItem justify="center">
					<View style={styles['hide']} dataSet={{ media: ids["showAt__large"]}}>
						<TldrSearch variant="header" />
					</View>
				</FlexItem>
				<FlexItem
					shrink
					align="flex-end"
					justify="center"
					dataSet={{ media: ids["hideAt__large"]}}
				>
					<Button
						onPress={()=>{
							dispatch(updateUi({ searchOverlayActive: true }))
						}}
						shape="Search"
						color="secondary"
					/>
				</FlexItem>
				<FlexItem
					shrink
					align="flex-end"
					justify="center"
				>
					<Button
						onPress={createButtonOnPress}
						shape="File"
						color="secondary"
					/>
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
										size="small" color={SWATCHES.hint}
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