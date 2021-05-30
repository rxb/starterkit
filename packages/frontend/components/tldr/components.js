import React, { useState, useRef, useContext, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addDropdown, addPrompt, addToast, addDelayedToast, updateUi } from '@/actions';

// SWR
import { request, getTldrUrl, getCategoriesUrl } from '@/swr';

// URLS
import { getTldrEditPageUrl, getVersionEditPageUrl, getSearchPageUrl, getCategoryPageUrl } from './urls';

import {
	Avatar,
	Bounds,
	Button,
	Card,
	CheckBox,
	Chunk,
	Chip,
	Flex,
	FlexItem,
	Header,
	Icon,
	Inline,
	Image,
	Label,
	List,
	Link,
	Menu,
	Modal,
	Picker,
	RevealBlock,
	Section,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch,
	useFormState,
	useMediaContext,
	View,
	ThemeContext,
	designConstants
} from 'cinderblock';
const { MEDIA_QUERIES_SINGLE } = designConstants;
import StyleSheet from 'react-native-media-query';
import ConnectedDropdownTouch from '@/components/ConnectedDropdownTouch';
import Router, { useRouter } from 'next/router'
import Markdown from 'markdown-to-jsx';
import { v4 as uuid } from 'uuid';

const smallCardMinHeight = 220;

export const Emptiness = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	const {
		shape = "File",
		label = "No results"
	} = props;
	return (
		<View style={{ minHeight: '55vh' }}>
			<View style={styles.absoluteCenter}>
				<Chunk style={{ alignItems: 'center' }}>
					<View style={styles.pseudoLineHeight}>
						<Icon
							shape={shape}
							size="xlarge"
							color={SWATCHES.textHint}
						/>
					</View>
					<Text color="hint">{label}</Text>
				</Chunk>
				{props.children}
			</View>
		</View>
	);
}

export const TldrCard = (props) => {
	const { styles, ids, METRICS, SWATCHES } = useContext(ThemeContext);

	const [showReferences, setReferences] = useState(false);

	const {
		tldr,
		style
	} = props;
	const thisVersion = props.thisVersion || tldr.currentTldrVersion;
	const content = thisVersion.content;

	const {styles: activeStyles, ids: activeIds} = StyleSheet.create({
		'tldrSectionless': {
			[MEDIA_QUERIES_SINGLE.medium]:{
				paddingHorizontal: 30, 
				paddingTop: 30, 
				paddingBottom: 10,
			}
		}
	});

	return (
		<Card shadow style={[{ borderRadius: 12 }, style]}>
			<Sectionless 
				style={[
					{ backgroundColor: "#4353ff" },
					activeStyles.tldrSectionless,
				]}		
				dataSet={{ media: activeIds.tldrSectionless }}
				>
				<Chunk style={{ paddingBottom: 4 }}>
					<Flex>
						<FlexItem>
							<Inline>
								<Avatar style={{ height: 12, width: 12, opacity: .75 }} source={{ uri: 'https://randomuser.me/api/portraits/women/18.jpg' }} />
								<Text type="small" inverted color="secondary">
									@{tldr.author.urlKey} / {tldr.urlKey}
								</Text>
							</Inline>
						</FlexItem>
						<FlexItem style={{ alignItems: 'flex-end' }}>
							<Inline>
								<Text type="small" inverted color="secondary">
									v.{thisVersion.version}
								</Text>
								<Icon
									shape="ChevronDown"
									size="small"
									color={SWATCHES.textSecondaryInverted}
								/>
							</Inline>
						</FlexItem>
					</Flex>
				</Chunk>
				<Chunk>
					<Text type="pageHead" inverted>{content.title}</Text>
					<Text inverted style={{ fontStyle: 'italic', marginTop: 8 }}>{content.blurb}</Text>
				</Chunk>
			</Sectionless>
			<Sectionless 
				style={activeStyles.tldrSectionless}		
				dataSet={{ media: activeIds.tldrSectionless }}
				>
				<View>
					{content.steps.map((step, i) => (
						<View
							key={i}
							style={{
								marginTop: 0,
								marginBottom: METRICS.space + 5,
								paddingLeft: 16,
							}}>
							<View
								style={{
									position: 'absolute',
									top: 3,
									bottom: 3,
									left: 0,
									width: 4,
									backgroundColor: SWATCHES.border,
								}}
							/>
							<View>
								<Text type="big"><Markdown>{step.head}</Markdown></Text>
								<Text color="secondary"><Markdown>{step.body}</Markdown></Text>
							</View>
							{ showReferences &&
								<View
									style={{
										marginTop: METRICS.space / 2,
										padding: METRICS.space / 2,
										background: SWATCHES.shade,
										borderRadius: METRICS.borderRadius
									}}>
									<Text type="small" color="secondary"><Markdown>{step.note}</Markdown></Text>
								</View>
							}
						</View>
					))}
				</View>


				<Chunk>
					<Touch onPress={() => {
						setReferences(!showReferences)
					}}>
						{/*

							{ !showReferences &&
								<Text color="hint">
									<Icon 
										shape="ChevronDown"
										color={SWATCHES.hint}
										style={{marginBottom: -6, marginLeft: 0, paddingLeft: 0, marginRight: 4}}
										/>
									Show references & rationale
								</Text>
							}	

							{ showReferences &&
								<Text color="hint">
									<Icon 
										shape="ChevronUp"
										color={SWATCHES.hint}
										style={{marginBottom: -6, marginRight: 4}}
										/>
									Hide references & rationale
								</Text>
							}	
							*/}

					</Touch>
				</Chunk>
			</Sectionless>

		</Card>
	);
};


export const TldrCardSmall = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	const {
		user,
		tldr,
		dispatch,
		mutate,
		color = SWATCHES.tint,
		style
	} = props;
	const thisVersion = props.thisVersion || tldr.currentTldrVersion;
	const content = thisVersion?.content || {};
	const draft = tldr.id && tldr.currentTldrVersionId == undefined;

	// TODO: admin permission
	const canEdit = (user?.id == tldr.authorId);

	return (
		<Card style={[{
			minHeight: smallCardMinHeight,
		}, style]}>

			<Sectionless
				style={{
					paddingTop: METRICS.space,
					flex: 1,
					borderTopWidth: 10,
					borderTopColor: color
				}}
			>
				<Chunk style={{ flex: 1 }}>
					<View style={{ flex: 1 }}>
						<Text type="micro" color="hint">{tldr.author?.urlKey}/{tldr.urlKey}</Text>
						<Text type="big">{content.title ? content.title : 'Untitled'}</Text>
						<Text color="secondary" style={{ marginTop: 3 }} type="small" color="secondary" numberOfLines={3}>{content.blurb}</Text>
					</View>

					<Flex>
						<FlexItem>
							{draft &&
								<View style={[{ backgroundColor: SWATCHES.error, paddingHorizontal: 6, borderRadius: 4, alignSelf: 'flex-start' }]}>
									<Text type="small" inverted>Unpublished</Text>
								</View>
							}
						</FlexItem>

						{/* TODO make this conditional on permission */}

						{canEdit &&
							<FlexItem shrink>
								<ConnectedDropdownTouch
									dropdown={<TldrCardContextDropdown
										tldr={tldr}
										dispatch={dispatch}
										mutate={mutate}
									/>}
								>
									<Icon
										shape="MoreHorizontal"
										color={SWATCHES.textHint}
									/>
								</ConnectedDropdownTouch>
							</FlexItem>
						}
					</Flex>

				</Chunk>

			</Sectionless>
		</Card>
	);

}

export const CreateTldrCardSmall = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	return (
		<Card style={{ minHeight: smallCardMinHeight, borderStyle: 'dashed', backgroundColor: 'transparent' }}>
			<Sectionless style={{ flex: 1 }}>
				<View style={styles.absoluteCenter}>
					<Icon
						shape="Plus"
						size="large"
						color={SWATCHES.tint}
						style={{ alignSelf: 'center' }}
					/>
					<Text type="micro" color="tint">Create card</Text>
				</View>
			</Sectionless>
		</Card>
	)
}


const TldrCardContextDropdown = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	const {
		tldr,
		dispatch,
		mutate,
		onRequestClose,
		onCompleteClose
	} = props;
	return (
		<Sectionless>
			<Chunk>
				{/* can't nest urls, so all links need to push router */}
				<Touch
					onPress={(e) => {
						e.preventDefault()
						Router.push({ pathname: getVersionEditPageUrl(), query: { tldrId: tldr.id } })
					}}
				>
					<Text color="tint">Edit</Text>
				</Touch>
				<Touch
					onPress={(e) => {
						e.preventDefault()
						Router.push({ pathname: getTldrEditPageUrl(), query: { tldrId: tldr.id } })
					}}
				>
					<Text color="tint">Settings</Text>
				</Touch>
				<Touch onPress={(e) => {
					e.preventDefault();
					onCompleteClose();
					dispatch(addPrompt(<DeletePrompt tldr={tldr} onSuccess={() => {
						mutate();
						dispatch(addToast('Card deleted!'))
					}} />))
				}}>
					<Text color="tint">Delete</Text>
				</Touch>
			</Chunk>
		</Sectionless>
	)
}



export const DeletePrompt = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	const {
		tldr,
		onRequestClose = () => { },
		onSuccess = () => { },
		dispatch
	} = props;

	const formState = useFormState({
		toastableErrors: {
			BadRequest: 'Something went wrong',
			NotAuthenticated: 'Not signed in'
		},
		addToast: msg => dispatch(addToast(msg))
	});

	// TODO: from the detail page, it will need to redirect, but from a listing page, probably not. maybe just pass in an onDelete fn?
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};
	const deleteTldr = async () => {
		try {
			formState.setLoading(true);
			await request(getTldrUrl(tldr.id), {
				method: 'DELETE',
				token: authentication.accessToken
			});
			onSuccess();
			onRequestClose();
		}
		catch (error) {
			console.log(error);
			formState.setError(error);
			formState.setLoading(false);
		}
	}

	return (
		<Section>
			<Chunk>
				<Text type="sectionHead">Delete this card?</Text>
			</Chunk>
			<Chunk>
				<Text>Something something about deleting cards</Text>
			</Chunk>
			<Chunk>
				<Button
					onPress={deleteTldr}
					label="Delete card"
					width="full"
					isLoading={formState.loading}
				/>
				<Button
					onPress={onRequestClose}
					color="secondary"
					label="Never mind"
					width="full"
				/>
			</Chunk>
		</Section>
	);
};

export const LoadMoreButton = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	const {
		swr,
		label = "Load more"
	} = props;
	return (
		<>
			{ !swr.isReachingEnd &&
				<Chunk>
					<Button
						isLoading={swr.isLoadingMore}
						color="secondary"
						onPress={() => {
							swr.setSize(swr.size + 1)
						}}
						label={label}
					/>
				</Chunk>
			}
		</>
	);
}

const catMatch = (s, categories) => {
	const p = Array.from(s).reduce((a, v, i) => `${a}[^${s.substr(i)}]*?${v}`, '');
	const re = RegExp(p, 'i');
	const newCats = categories.filter(v => {
		return (v.name && v.name.match(re)) || (v.keywords && v.keywords.match(re));
	});
	return s ? [{'_type': 'search', searchString: s}].concat(newCats) : newCats;
}


export const TldrSearchInHeader = (props) => {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);
	
	// CATEGORY DATA
	// not going to use SWR for this one
	const [categories, setCategories] = useState([]);
	const [searchResults, setSearchResults] = useState([]);
	useEffect(() => {
		request(getCategoriesUrl({ '$limit': 1000, '$sort[name]': 1 }))
			.then(response => {
				const categories = response.items.map(item => ({
					...item, 
					'_url': getCategoryPageUrl({ categoryId: item.id })
				}));
				setSearchResults(categories)
				setCategories(categories)
			})
	}, [])

	// ENTER / EXIT SEARCH MODE
	// hide/show of autocomplete
	// cant just use blur because attempting to tap an autocomplete item would blur before tap
	const inputRef = useRef();
	const searchOuter = useRef(null);
	const [searchFocus, _setSearchFocus] = useState(false);
	const setSearchFocus = (focus) => {
		if(!searchFocus || !focus){
			// don't clear if search is visible and staying visible
			formState.setFieldValue('search', '');
		}
		if(focus){
			setSelectedIndex(startingIndex);
			inputRef.current.focus();
		}
		else{
			inputRef.current.blur();
		}
		_setSearchFocus(focus);
	}
	const exitSearch = () => {
		setSearchFocus(false);
	}
	
	// SELECTED AUTOCOMPLETE ITEM
	// event handlers don't get updated on rerenders, so we need a ref to connect it to current rendered function
	const startingIndex = -1;
	const [selectedIndex, setSelectedIndex] = useState(startingIndex);
	const updateSelectedIndex = (offset) => {
		setSelectedIndex(selectedIndex+offset);
	}
	const updateSelectedIndexRef = React.useRef(updateSelectedIndex);
	updateSelectedIndexRef.current = updateSelectedIndex;

	// CHOOSE SELECTED INDEX
	// again with the event handlers only getting first render
	const chooseSelectedIndex = () => {
		// going to let form submit handle text search since this might lag
		const url = searchResults[selectedIndex]?._url;
		if(url){
			exitSearch();
			Router.push(url);
		}
	}
	const chooseSelectedIndexRef = React.useRef(chooseSelectedIndex);
	chooseSelectedIndexRef.current = chooseSelectedIndex;


	// KEY PRESSES
	const handleKeyPress = (e) => {
		if (e.keyCode === 27) {
			// esc
			exitSearch();
		}
		else if(e.keyCode === 40){
			// down
			e.preventDefault();
			updateSelectedIndexRef.current(+1);
		}
		else if(e.keyCode === 38){
			// up
			e.preventDefault();
			updateSelectedIndexRef.current(-1);
		}
		else if(e.keyCode === 13){
			// enter (don't preventDefault, form submit needs it)
			chooseSelectedIndexRef.current();
		}
	};
	
	// OUTCLICK 
	const handleDocumentClick = useCallback((e) => {
		if (ReactDOM.findDOMNode(searchOuter.current).contains(e.target)) {
			return false;
		}
		exitSearch();
	});

	// DOCUMENT EVENT LISTENERS 
	const cleanup = useCallback(() => {
		document.removeEventListener('click', handleDocumentClick, false);
		document.removeEventListener("keydown", handleKeyPress, false);
	});
	useEffect(() => {
		if (searchFocus) {
			document.addEventListener('click', handleDocumentClick, false);
			document.addEventListener("keydown", handleKeyPress, false);
		}
		else {
			cleanup();
		}
		return cleanup;
	}, [searchFocus]);

	// FORMSTATE
	const formState = useFormState({
		initialFields: {
			search: ''
		},
		onChange: (fields) => {
			const s = fields.search;
			setSearchResults(catMatch(s, categories));
			setSelectedIndex( s.length ? 0 : -1);
		}
	})

	return (
		<View
			ref={searchOuter}
		>	
			<TldrSearchInput 
				ref={inputRef}
				formState={formState} 
				autoFocus={false} 
				exitSearch={exitSearch}
				onFocus={()=>setSearchFocus(true)}
				onKeyPress={handleKeyPress}
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
						<TldrSearchResults
							searchString={formState.getFieldValue('search')}
							searchResults={searchResults}
							exitSearch={exitSearch}
							selectedIndex={selectedIndex}
							/>
					</Sectionless>
				</View>
			</RevealBlock>
	
		</View>
	);
}

export const TldrSearchOverlay = (props) => {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);
	const dispatch = useDispatch();
	const ui = useSelector(state => state.ui);
	const inputRef = useRef();

	// SELECTED AUTOCOMPLETE ITEM
	// event handlers don't get updated on rerenders, so we need a ref to connect it to current rendered function
	const startingIndex = -1;
	const [selectedIndex, setSelectedIndex] = useState(startingIndex);
	const updateSelectedIndex = (offset) => {
		setSelectedIndex(selectedIndex+offset);
	}
	const updateSelectedIndexRef = React.useRef(updateSelectedIndex);
	updateSelectedIndexRef.current = updateSelectedIndex;

	// CHOOSE SELECTED INDEX
	// again with the event handlers only getting first render
	const chooseSelectedIndex = () => {
		// going to let form submit handle text search since this might lag
		const url = searchResults[selectedIndex]?._url;
		if(url){
			exitSearch();
			Router.push(url);
		}
	}
	const chooseSelectedIndexRef = React.useRef(chooseSelectedIndex);
	chooseSelectedIndexRef.current = chooseSelectedIndex;

	// CATEGORY DATA
	// not going to use SWR for this one
	const [categories, setCategories] = useState([]);
	const [searchResults, setSearchResults] = useState([]);
	useEffect(() => {
		request(getCategoriesUrl({ '$limit': 1000, '$sort[name]': 1 }))
			.then(response => {
				const categories = response.items.map(item => ({
					...item, 
					'_url': getCategoryPageUrl({ categoryId: item.id })
				}));
				setSearchResults(categories)
				setCategories(categories)
			})
	}, []);

	// DOCUMENT EVENT LISTENERS 
	useEffect(()=> {
		if(ui.searchOverlayVisible){
			document.addEventListener("keydown", handleKeyPress, false);
		}
		else{
			document.removeEventListener("keydown", handleKeyPress, false);
		}
		return () => {
			document.removeEventListener("keydown", handleKeyPress, false);
		}
	}, [ui.searchOverlayVisible]);

	// KEY PRESSES
	const handleKeyPress = useCallback((e) => {
		if (e.keyCode === 27) {
			exitSearch();
		}
		else if(e.keyCode === 40){
			// down
			e.preventDefault();
			updateSelectedIndexRef.current(+1);
		}
		else if(e.keyCode === 38){
			// up
			e.preventDefault();
			updateSelectedIndexRef.current(-1);
		}
		else if(e.keyCode === 13){
			// enter (don't preventDefault, form submit needs it)
			chooseSelectedIndexRef.current();
		}
	});

	// EXIT SEARCH MODE
	const exitSearch = () => {
		formState.setFieldValue('search', '');
		dispatch(updateUi({ searchOverlayVisible: false }));
	} 
	
	// FORM STATE
	const formState = useFormState({
		initialFields: {
			search: ''
		},
		onChange: (fields) => {
			const s = fields.search;
			setSearchResults(catMatch(s, categories));
			setSelectedIndex( s.length ? 0 : -1);
		}
	})

	if(!ui.searchOverlayVisible)
		return false;

	return (
		<View style={{
			position: 'absolute',
			top: 0, left: 0, right: 0,
			minHeight: '100vh',
			zIndex: 2,
			backgroundColor: 'white'
		}}>
			<Header>
				<Flex>
					<FlexItem justify="center">
						<TldrSearchInput 
							ref={inputRef}
							formState={formState} 
							autoFocus={true} 
							exitSearch={exitSearch}
							onKeyPress={handleKeyPress}
							/>
					</FlexItem>
					<FlexItem shrink>
						<Button
							onPress={()=>{
								exitSearch();
							}}
							shape="X"
							color="secondary"
							/>
					</FlexItem>
				</Flex>
			</Header>
			<Stripe>
				<Bounds>
					<Section style={{paddingTop: METRICS.space/2}}>
						<TldrSearchResults
							searchString={formState.getFieldValue('search')}
							searchResults={searchResults}
							exitSearch={exitSearch}
							selectedIndex={selectedIndex}
							/>
					</Section>
				</Bounds>
			</Stripe>
		</View>
	);
}



const _TldrSearchInput = (props) => {	
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

	const {
		innerRef,
		formState,
		autoFocus,
		onFocus = ()=>{},
		exitSearch,
		onKeyPress = ()=>{}
	} = props;

	const handleKeyPress = (e) =>{
		if(e.keyCode === 40){
			// arrow down
			// blur so autocomplete event handler can take over
			e.preventDefault();
			innerRef.current.blur();
		}
		onKeyPress(e); 
	}

	return(
		<form>
		<TextInput
			ref={innerRef}
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
			onKeyPress={handleKeyPress}
			onChange={e => {
				formState.setFieldValue('search', e.target.value)
			}}
			onFocus={onFocus}
			value={formState.getFieldValue('search')}
			autoFocus={autoFocus}
			onSubmitEditing={()=>{
				exitSearch();
				Router.push({ pathname: getSearchPageUrl(), query: { q: formState.getFieldValue('search') } })
			}}
			/>
			</form>
	)
};

const TldrSearchInput = React.forwardRef((props, ref) => {
	return <_TldrSearchInput innerRef={ref} {...props} />
});


const TldrSearchResults = (props) => {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

	const {
		searchResults,
		exitSearch,
		selectedIndex
	} = props;
	return(
		<>
		{searchResults.map((item, i) => (
			<Chunk key={i}>
				<View style={{
						backgroundColor: selectedIndex == i ? SWATCHES.shade :'transparent',
						padding: METRICS.space/2,
						margin: -1*METRICS.space/2,
						borderRadius: METRICS.borderRadius
					}}>
					<Link
						href={item._url}
						onPress={() => {
							exitSearch();
						}}
					>
						<Flex nbsp>
							<FlexItem shrink nbsp justify="center">
								<Icon 
									shape={item._type=="search" ? "Search" : "List"}
									size="small"
									color={SWATCHES.textHint}
									/>								
							</FlexItem>
							<FlexItem nbsp>
								<Text>{ item._type=="search" ? `Search "${item.searchString}"` : item.name}</Text>
								<Text type="micro" color="hint">{item.keywords}</Text>
							</FlexItem>
						</Flex>
					</Link>
				</View>
			</Chunk>
		))}
		</>
	);
}