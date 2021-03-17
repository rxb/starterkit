import React, {Fragment, useState, useEffect, useRef} from 'react';

// REDUX
import { useDispatch, useSelector } from 'react-redux';
import {
	addToast,
	showToast,
	showDelayedToasts,
	logOut,
	updateUi
} from '../actions';

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
	Section,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	useFormState,
	View,
} from './cinderblock';
import feathersClient from '../components/FeathersClient'; // already instantiated so we can share

// STYLES
import styles from './cinderblock/styles/styles';
import swatches from './cinderblock/styles/swatches';
import {METRICS} from '@/components/cinderblock/designConstants';


function TldrHeader (props) {
	
	// data from redux
	const dispatch = useDispatch(); 
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};
	const userMenu = useRef(null);

	const [searchFocus, setSearchFocus] = useState(false);
 
	const formState = useFormState({
		initialFields: {
			search: ''
		}
	})

	return (
			<Header position="static">
				<Flex direction="row">
					<FlexItem shrink justify="center">
						<Link href="/tldr">
							<Inline nowrap>
								<Icon shape="FileText" color={swatches.tint} />
								<Text weight="strong" color="tint" type="big">tldr</Text>
							</Inline>
						</Link>
					</FlexItem>
					<FlexItem justify="center">
						<View style={{flex: 1}}>
						<TextInput 
							style={{
								paddingVertical: 6,
								borderRadius: 20,
							}}
							spellCheck={false}
							clearButtonMode="while-editing"
							keyboard="web-search"
							onChange={e => formState.setFieldValue('search', e.target.value) }
							value={formState.getFieldValue('search')}
							onFocus={()=>{
								setSearchFocus(true);
							}}
							onBlur={()=>{
								setSearchFocus(false);
							}}
							/>
							<View
								style={{
									backgroundColor: 'white',
									borderColor: swatches.border,
									borderWidth: 1,
									top: '100%',
									left: 16, right: 16,
									position: 'absolute',
									display: (searchFocus) ? 'block' : 'none',
								}}
								>
									<Sectionless>
										<Chunk>
											<Text>one</Text>
										</Chunk>
										<Chunk>
											<Text>two</Text>
										</Chunk>
										<Chunk>
											<Text>three</Text>
										</Chunk>
										<Chunk>
											<Text>four</Text>
										</Chunk>
									</Sectionless>
							</View>
							</View>
					</FlexItem>
					<FlexItem 
						shrink 
						align="flex-end"
						justify="center" 
						>
						<Link href="/tldr/edit">
							<Inline nowrap>
								<Button
									label="Create"
									size="xsmall"
									color="secondary"
									/>
							</Inline>
						</Link>
					</FlexItem>
					<FlexItem 
						shrink 
						align="flex-end"
						justify="center"
						>
							
							<Fragment>
								{user.id &&
									<Fragment>
										<Touch onPress={()=> userMenu.current.toggle()}>
											<Inline nowrap>
												<Avatar
													source={{uri: user.photoUrl}}
													size="small"
													/>
												<Icon 
													shape="ChevronDown" 
													size="small" color={swatches.hint} 
													/>
											</Inline>
										</Touch>

										<Menu ref={userMenu}>
											<Sectionless>
												<Chunk>
														<Link href={`/tldr/tldrprofile`} >
															<Text color="tint" >Profile</Text>
														</Link>
														<Touch >
															<Text color="tint" >Settings</Text>
														</Touch>
														<Touch onPress={feathersClient.logout} >
															<Text color="tint" >Log out</Text>
														</Touch>
												</Chunk>
											</Sectionless>
										</Menu>

									</Fragment>
								}

								{!user.id &&
									<Touch onPress={()=>{
										dispatch(updateUi({logInModalVisible: true}))
									}}><Text color="tint" nowrap>Log in</Text></Touch>
								}
							</Fragment>
						</FlexItem>
					</Flex>
				</Header>

	);

}



export default TldrHeader;