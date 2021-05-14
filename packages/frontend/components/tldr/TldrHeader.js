import React, {Fragment, useState, useEffect, useRef, useCallback, useContext} from 'react';
import ReactDOM from 'react-dom';

// SWR
import { request, getCategoriesUrl } from '@/swr';
import useSWR, { mutate }  from 'swr';

// REDUX
// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addToast, updateUi} from '@/actions';

// URLS
import {getProfilePageUrl, getProfileEditPageUrl, getTldrEditPageUrl, getIndexPageUrl, getCategoryPageUrl, getSavedPageUrl} from './urls';

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
	View,	ThemeContext
} from 'cinderblock';
import ConnectedDropdownTouch from '@/components/ConnectedDropdownTouch';
import feathersClient from '@/components/FeathersClient'; // already instantiated so we can share

// STYLES



const catMatch = (s, categories) => {
	const p = Array.from(s).reduce((a, v, i) => `${a}[^${s.substr(i)}]*?${v}`, '');
	const re = RegExp(p, 'i');
	return categories.filter(v => {
		return (v.name && v.name.match(re)) || (v.keywords && v.keywords.match(re));
	});
}


function TldrSearch  (props) {
   const { styles, SWATCHES, METRICS } = useContext(ThemeContext);
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

	// not going to use SWR for this one
	const [categories, setCategories] = useState([]);
	const [searchResults, setSearchResults] = useState([]);
	let categoriesData = [];
	useEffect(()=>{
		request( getCategoriesUrl({'$limit': 1000, '$sort[name]': 1}))
		.then(response => {
			setSearchResults(response.items)
			setCategories(response.items)
		})
	}, [])

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
			setSearchResults(catMatch(e.target.value, categories));
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
					borderColor: SWATCHES.border,
					borderWidth: 1,
					top: '100%',
					marginTop: -7,
					left: 16, right: 16,
					position: 'absolute'
				}}
				>
				<Sectionless>
					{ formState.getFieldValue('search') != '' &&
						<Chunk>
							{ <Text>Search "{formState.getFieldValue('search')}"</Text> }
						</Chunk>
					}
					{ searchResults.map((item, i) => (
						<Chunk key={i}>
							<Link 
								href={ getCategoryPageUrl({categoryId: item.id}) }
								onPress={()=>{
									setSearchFocus(false);
								}}
								>
								<Text>{item.name}</Text>
								<Text type="micro" color="hint">{item.keywords}</Text>
							</Link>
						</Chunk>									
					)) }
					
				</Sectionless>
			</View>
		</RevealBlock>
	</View>
	);
}


const UserDropdown = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};
	const {onRequestClose} = props;
	const [loading, setLoading] = useState(false);
	return(
	<Sectionless>
		<LoadingBlock isLoading={loading}>
		<Chunk>
			
				<Link href={ getProfilePageUrl({userId: user.id}) } >
					<Text color="tint" >Profile</Text>
				</Link>
				<Link href={ getSavedPageUrl() } >
					<Text color="tint" >Saved</Text>
				</Link>
				<Link href={ getProfileEditPageUrl() } >
					<Text color="tint" >Settings</Text>
				</Link>
				<Touch onPress={async ()=>{
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

function TldrHeader  (props) {
   const { styles, SWATCHES, METRICS } = useContext(ThemeContext);
   const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

	// data from redux
	const dispatch = useDispatch(); 
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};
	const ui = useSelector(state => state.ui);
	return (
			<Header position="static">
				<Flex direction="row">
					<FlexItem shrink justify="center">
						<Link href={ getIndexPageUrl() }>
							<Inline nowrap>
								<Icon shape="FileText" color={SWATCHES.tint} />
								<Text weight="strong" color="tint" type="big">tldr</Text>
							</Inline>
						</Link>
					</FlexItem>
					<FlexItem justify="center">
						<TldrSearch />
					</FlexItem>
					<FlexItem 
						shrink 
						align="flex-end"
						justify="center" 
						>
						<Link href={ getTldrEditPageUrl() }>
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
								{user && user.id &&
										<ConnectedDropdownTouch dropdown={<UserDropdown />} >
											<Inline nowrap>
												<Avatar
													source={{uri: user.photoUrl}}
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
									<Touch onPress={()=>{
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
									<Touch onPress={()=>{
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