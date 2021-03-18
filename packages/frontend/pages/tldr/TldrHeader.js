import React, {Fragment, useState, useEffect, useRef, useCallback} from 'react';
import ReactDOM from 'react-dom';

// REDUX
import { useDispatch, useSelector } from 'react-redux';
import {
	addToast,
	showToast,
	showDelayedToasts,
	logOut,
	updateUi
} from '@/actions';

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
	View,
} from '@/components/cinderblock';
import feathersClient from '@/components/FeathersClient'; // already instantiated so we can share

// STYLES
import styles from '@/components/cinderblock/styles/styles';
import swatches from '@/components/cinderblock/styles/swatches';
import {METRICS} from '@/components/cinderblock/designConstants';


import {CATEGORIES} from './components';

const catMatch = (s) => {
	const p = Array.from(s).reduce((a, v, i) => `${a}[^${s.substr(i)}]*?${v}`, '');
	const re = RegExp(p, 'i');
	return CATEGORIES.filter(v => v.name.match(re));
}



function TldrHeader (props) {
	
	// data from redux
	const dispatch = useDispatch(); 
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

	const categories = CATEGORIES;	

	const userMenu = useRef(null);

	const [searchResults, setSearchResults] = useState(categories);

	// AUTOCOMPLETE
	// hide/show of autocomplete
	// cant just use blur because attempting to tap an autocomplete item would blur before tap
	const searchOuter = useRef(null);
	const [searchFocus, setSearchFocus] = useState(false);
	const handleDocumentClick = useCallback((e) => {
		if(ReactDOM.findDOMNode(searchOuter.current).contains(e.target)){
			return false;
		}
		setSearchFocus(false);
	});
	const handleKeyPress = useCallback((e) => {
		if(e.keyCode === 27) {
			setSearchFocus(false);
		}
	});
	const cleanup = useCallback(() => {
		document.removeEventListener('click', handleDocumentClick, false);
		document.removeEventListener("keydown", handleKeyPress, false);
	});
	useEffect(()=>{
		if(searchFocus){
			document.addEventListener('click', handleDocumentClick, false);
			document.addEventListener("keydown", handleKeyPress, false);
		}
		else{
			cleanup();
		}
		return cleanup;
	}, [searchFocus]);

	

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
						<View 
							ref={searchOuter}
							>
						<TextInput 
							style={{
								paddingVertical: 6,
								borderRadius: 20,
								marginVertical: 0
							}}
							wrapperStyle={{
								// for autocomplete, maybe should be ported back
								zIndex: 2,
								backgroundColor: 'white',
								marginVertical: METRICS.pseudoLineHeight
							}}
							spellCheck={false}
							clearButtonMode="while-editing"
							keyboard="web-search"
							onChange={e => {
								formState.setFieldValue('search', e.target.value)
								setSearchResults(catMatch(e.target.value));
							}}
							value={formState.getFieldValue('search')}
							onFocus={()=>{
								setSearchFocus(true);
							}}
							/>
							<RevealBlock 
								visible={searchFocus}
								duration={60}
								delay={10}
								offset={20}
								fromTop
								>
								<View
									style={{
										backgroundColor: 'white',
										borderColor: swatches.border,
										borderWidth: 1,
										top: '100%',
										marginTop: -7,
										left: 16, right: 16,
										position: 'absolute',
									}}
									>
										<Sectionless>
											{ searchResults.map((item, i) => (
												<Chunk key={i}>
													<Link 
														href={`/tldr?urlKey=${item.urlKey}`}
														onPress={()=>{
															setSearchFocus(false);
														}}
														>
														<Text>{item.name}</Text>
													</Link>
												</Chunk>									
											))}
										</Sectionless>
								</View>
							</RevealBlock>
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