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
	DropdownItem,
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
import Page from '@/components/Page';
import TldrHeader from '@/components/tldr/TldrHeader';
import ConnectedDropdownTouch from '@/components/ConnectedDropdownTouch';

import StyleSheet from 'react-native-media-query';
import Router, { useRouter } from 'next/router'
import Markdown from 'markdown-to-jsx';
import { ActivityIndicator } from 'react-native';

const smallCardMinHeight = 220;

export const Emptiness = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	const {
		shape = "File",
		label = "No results"
	} = props;
	return (
		<View style={{ minHeight: '55vh', background: SWATCHES.shade, borderRadius: METRICS.cardBorderRadius }}>
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
		style,
		color = (props.tldr.category) ? props.tldr.category.color : SWATCHES.shade,
	} = props;
	const thisVersion = props.thisVersion || tldr.currentTldrVersion;
	const content = thisVersion.content;

	const { styles: activeStyles, ids: activeIds } = StyleSheet.create({
		'tldrSectionless': {
			[MEDIA_QUERIES_SINGLE.medium]: {
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
					{ backgroundColor: color },
					activeStyles.tldrSectionless,
				]}
				dataSet={{ media: activeIds.tldrSectionless }}
			>
				<Chunk style={{ paddingBottom: 4 }}>
					<Flex>
						<FlexItem>
							<Inline nowrap>
								{/*
								<Avatar style={{ height: 12, width: 12, opacity: .75 }} source={{ uri: 'https://randomuser.me/api/portraits/women/18.jpg' }} />
								*/}
								<Text type="small" inverted color="secondary">
									@{tldr.author.urlKey} / {tldr.urlKey}
								</Text>
							</Inline>
						</FlexItem>
						<FlexItem shrink style={{ alignItems: 'flex-end' }}>
							<Inline nowrap>
								<Text type="small" inverted color="secondary">
									v.{thisVersion.version}
								</Text>
								{/*
								<Icon
									shape="ChevronDown"
									size="small"
									color={SWATCHES.textSecondaryInverted}
								/>
								*/}
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
							{showReferences &&
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
		color = (props.tldr.category) ? props.tldr.category.color : SWATCHES.shade,
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
					borderTopWidth: 16,
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
		<>

				{/* can't nest urls, so all links need to push router */}
				<DropdownItem
					onPress={(e) => {
						e.preventDefault()
						Router.push({ pathname: getVersionEditPageUrl(), query: { tldrId: tldr.id } })
					}}
				>
					<Text color="tint">Edit</Text>
				</DropdownItem>
				<DropdownItem
					onPress={(e) => {
						e.preventDefault()
						Router.push({ pathname: getTldrEditPageUrl(), query: { tldrId: tldr.id } })
					}}
				>
					<Text color="tint">Settings</Text>
				</DropdownItem>
				<DropdownItem onPress={(e) => {
					e.preventDefault();
					onCompleteClose();
					dispatch(addPrompt(<DeletePrompt tldr={tldr} onSuccess={() => {
						mutate();
						dispatch(addToast('Card deleted!'))
					}} />))
				}}>
					<Text color="tint">Delete</Text>
				</DropdownItem>
		</>
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
		label = "Load more",
		style,
		size
	} = props;
	return (
		<>
			{!swr.isReachingEnd &&
				<View style={style}>
					<Chunk>
						<Button
							size={size}
							isLoading={swr.isLoadingMore}
							color="secondary"
							onPress={() => {
								swr.setSize(swr.size + 1)
							}}
							label={label}
						/>
					</Chunk>
				</View>
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
	return s ? [{ '_type': 'search', searchString: s }].concat(newCats) : newCats;
}

export const TldrSearch = (props) => {
	const { variant = 'header', hero, placeholder, style } = props;
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);

	const dispatch = useDispatch();
	const ui = useSelector(state => state.ui);
	const inputRef = useRef();

	// FETCH CATEGORY DATA
	// once on mount, don't use SWR
	// maybe move this into redux?
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

	// KEY PRESSES
	const _handleKeyPress = (e) => {
		if (searchMode) {
			if (e.keyCode === 27) {
				// esc
				exitSearch();
			}
			else if (e.keyCode === 40) {
				// down
				e.preventDefault();
				updateSelectedIndex(+1);
			}
			else if (e.keyCode === 38) {
				// up
				e.preventDefault();
				updateSelectedIndex(-1);
			}
			else if (e.keyCode === 13) {
				// enter (don't preventDefault, form submit needs it)
				chooseSelectedIndex();
			}
		}
	};

	// event handlers only get first render
	const handleKeyPressRef = useRef(_handleKeyPress);
	handleKeyPressRef.current = _handleKeyPress;
	const handleKeyPress = (e) => handleKeyPressRef.current(e);

	// OUTCLICK 
	const searchOuter = useRef(null);
	const _handleDocumentClick = (e) => {
		if (searchMode && variant == 'header') {
			if (ReactDOM.findDOMNode(searchOuter.current).contains(e.target)) {
				return false;
			}
			console.log('outclick'); // because the old one is still active
			exitSearch();
		}
	};

	// event handlers only get first render
	const handleDocumentClickRef = useRef(_handleDocumentClick);
	handleDocumentClickRef.current = _handleDocumentClick;
	const handleDocumentClick = (e) => handleDocumentClickRef.current(e);

	// SEARCH MODE ACTIVATED OR NOT
	// check on mount, also on ui state change
	const [searchMode, _setSearchMode] = useState();
	const setSearchMode = (mode) => {
		if (searchMode != mode) {
			formState.setFieldValue('search', '');
		}
		setSelectedIndex(formState.getFieldValue('search') ? 0 : startingIndex);
		_setSearchMode(mode);
	}

	// WATCH UI for SEARCH MODE
	useEffect(() => {
		if (variant == 'header') {
			setSearchMode(ui.searchHeaderActive);
		}
		else if (variant == 'overlay') {
			setSearchMode(ui.searchOverlayActive);
		}
	}, [ui.searchOverlayActive, ui.searchHeaderActive]);

	// EXIT SEARCH
	const exitSearch = () => {
		inputRef.current?.blur();
		if (variant == 'header') {
			dispatch(updateUi({ searchHeaderActive: false }));
		}
		else if (variant == 'overlay') {
			dispatch(updateUi({ searchOverlayActive: false }));
		}
	}

	// HANDLE SEARCH FOCUS
	const handleSearchFocus = () => {
		if (variant == 'header') {
			dispatch(updateUi({ searchHeaderActive: true }));
		}
	}

	// EXPLICITLY SET SEARCH FOCUS
	const setSearchFocus = (focus) => {
		if (focus) {
			inputRef.current?.focus();
			handleSearchFocus();
		}
		else {
			inputRef.current?.blur();
		}
	}

	// SET UP EVENT LISTENERS
	// once, on mount
	const cleanup = () => {
		console.log('remove listeners');
		document.removeEventListener('click', handleDocumentClick, false);
		document.removeEventListener("keydown", handleKeyPress, false);
	}
	useEffect(() => {
		if (searchMode) {
			console.log('add listeners');
			document.addEventListener('click', handleDocumentClick, false);
			document.addEventListener("keydown", handleKeyPress, false);
		}
		else {
			cleanup();
		}
		return cleanup;
	}, [searchMode]);

	// SELECTED AUTOCOMPLETE ITEM
	const startingIndex = -1;
	const [selectedIndex, setSelectedIndex] = useState(startingIndex);
	const updateSelectedIndex = (offset) => {
		if (selectedIndex + offset <= startingIndex) {
			setSelectedIndex(startingIndex);
			setSearchFocus(true);
		}
		else if (selectedIndex + offset >= searchResults.length) {
			setSelectedIndex(0);
		}
		else {
			setSelectedIndex(selectedIndex + offset);
		}
	}

	// CHOOSE SELECTED INDEX
	const chooseSelectedIndex = () => {
		// going to let form submit handle text search since this might lag
		const url = searchResults[selectedIndex]?._url;
		if (url) {
			Router.push(url);
		}
	}


	// FORMSTATE
	const formState = useFormState({
		initialFields: {
			search: ''
		},
		onChange: (fields) => {
			const s = fields.search;
			setSearchResults(catMatch(s, categories));
			setSelectedIndex(s.length ? 0 : -1);
		}
	})


	// HEADER
	if (variant == 'header') {
		return (
			<View ref={searchOuter} style={style}>
				<TldrSearchInput
					active={searchMode}
					showSearchIcon={true}
					ref={inputRef}
					formState={formState}
					autoFocus={false}
					onFocus={handleSearchFocus}
					onKeyPress={handleKeyPress}
					hero={hero}
					placeholder={placeholder}
				/>
				<RevealBlock
					visible={searchMode}
					animateExit={false}
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
							left: 0, right: 0,
							position: 'absolute'
						}}
					>
						<Sectionless>
							<TldrSearchResults
								searchString={formState.getFieldValue('search')}
								searchResults={searchResults}
								selectedIndex={selectedIndex}
							/>
						</Sectionless>
					</View>
				</RevealBlock>
			</View>
		)
	}

	// OVERLAY 
	else if (variant == 'overlay') {
		if (!searchMode) {
			return <View style={{ display: 'none' }} />
		}
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
						<FlexItem shrink justify="center">
							<Touch
								onPress={() => {
									exitSearch();
								}}>
								<Icon
									shape="ArrowLeft"
									color={SWATCHES.tint}
								/>
							</Touch>
						</FlexItem>
						<FlexItem justify="center">
							<TldrSearchInput
								showSearchIcon={false}
								ref={inputRef}
								formState={formState}
								autoFocus={true}
								onKeyPress={handleKeyPress}
								onFocus={handleSearchFocus}
								placeholder={placeholder}
							/>
						</FlexItem>

					</Flex>
				</Header>
				<Stripe>
					<Bounds>
						<Section style={{ paddingTop: METRICS.space / 2 }}>
							<TldrSearchResults
								searchString={formState.getFieldValue('search')}
								searchResults={searchResults}
								selectedIndex={selectedIndex}
							/>
						</Section>
					</Bounds>
				</Stripe>
			</View>
		);
	}
}


const _TldrSearchInput = (props) => {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);
	const {
		active,
		innerRef,
		formState,
		autoFocus,
		onFocus = () => {},
		onKeyPress = () => { },
		showSearchIcon = true,
		hero,
		placeholder
	} = props;

	const [updateVersion, setUpdateVersion] = useState(0);
	useEffect(()=>{
		setUpdateVersion(updateVersion + 1);
	}, [active]);

	const handleKeyPress = (e) => {
		if (e.keyCode === 40) {
			// arrow down
			// blur so autocomplete event handler can take over
			e.preventDefault();
			innerRef.current.blur();
		}
		onKeyPress(e);
	}

	const inputStyles = hero ? {
		backgroundColor: SWATCHES.backgroundWhite,
		paddingVertical: 8,
		borderRadius: 20,
		marginVertical: 0,
		lineHeight: METRICS.bigLineHeight
	} : {
		paddingVertical: 6,
		borderRadius: 20,
		marginVertical: 0
	}

	const inputFocusStyles = {
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	};

	return (
		<form>
			<TextInput
				updateVersion={updateVersion}
				ref={innerRef}
				style={{
					...inputStyles,
					...(active ? inputFocusStyles : {} ),
					...(showSearchIcon ? { paddingLeft: 36 } : {})
				}}
				wrapperStyle={{
					// for autocomplete, maybe should be ported back
					zIndex: 2,
					marginVertical: METRICS.pseudoLineHeight
				}}
				spellCheck={false}
				clearButtonMode="while-editing"
				keyboardType="web-search"
				onKeyPress={handleKeyPress}
				onChange={e => {
					formState.setFieldValue('search', e.target.value)
				}}
				onFocus={onFocus}
				value={formState.getFieldValue('search')}
				autoFocus={autoFocus}
				placeholder={placeholder}
				onSubmitEditing={() => {
					Router.push({ pathname: getSearchPageUrl(), query: { q: formState.getFieldValue('search') } })
				}}
			>
				{showSearchIcon &&
					<View style={{
						position: 'absolute',
						left: 5, top: 0, bottom: 0,
						width: 31,
						justifyContent: 'center',
						alignItems: 'center'
					}}>
						<Icon
							shape="Search"
							color={hero ? SWATCHES.textSecondary : SWATCHES.border }
							style={{ width: 20, height: 20 }}
						/>
					</View>
				}
			</TextInput>
		</form>
	)
};

const TldrSearchInput = React.forwardRef((props, ref) => {
	return <_TldrSearchInput innerRef={ref} {...props} />
});


const TldrSearchResults = (props) => {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);
	const ui = useSelector(state => state.ui);

	const {
		searchResults,
		selectedIndex
	} = props;
	return (
		<>

			{searchResults.map((item, i) => (
				<Chunk key={i}>
					<View style={{
						backgroundColor: selectedIndex == i ? SWATCHES.shade : 'transparent',
						padding: METRICS.space / 2,
						margin: -1 * METRICS.space / 2,
						borderRadius: METRICS.borderRadius
					}}>

						<Link
							href={item._url}
						>
							<Flex nbsp>
								<FlexItem shrink nbsp justify="center">
									<Icon
										shape={item._type == "search" ? "Search" : "List"}
										size="small"
										color={item.color ? item.color : SWATCHES.textHint}
									/>
								</FlexItem>
								<FlexItem nbsp>
									<Text>{item._type == "search" ? `Search "${item.searchString}"` : item.name}</Text>
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

export const LoadingPage = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	return (
		<Page>
			<TldrHeader />
			<Stripe style={{ flex: 1 }}>
				<View style={styles.absoluteCenter}>
					<ActivityIndicator
						style={{ marginTop: -16 }}
						size='large'
						color={SWATCHES.tint}
					/>
				</View>
			</Stripe>
		</Page>
	)
}

export const Tag = (props) => {
	const { styles, SWATCHES, METRICS } = useContext(ThemeContext);
	const {
		color = 'shade',
		size = 'medium',
		style
	} = props;

	// SIZE ATTRIBUTES
	const sizeMap = {
		small: {
			textStyle: { fontSize: 11, lineHeight: 16 }
		},
		medium: {
			textStyle: { fontSize: 12, lineHeight: 20 }
		}
	}
	const { textStyle } = sizeMap[size];

	// COLOR ATTRIBUTES
	const colorMap = {
		shade: {
			backgroundColor: SWATCHES.shade,
			textColor: SWATCHES.tint
		},
		red: {
			backgroundColor: 'red',
			textColor: 'white'
		},
		green: {
			backgroundColor: 'green',
			textColor: 'white'
		}
	}
	const { backgroundColor, textColor } = colorMap[color];


	return (
		<View style={[{ alignSelf: 'flex-start', backgroundColor: backgroundColor, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2, textAlign: 'center' }, styles.pseudoLineHeight, style]}>
			<Text style={[{ color: textColor }, textStyle]}>{props.label.toUpperCase()}</Text>
		</View>
	);
}

export const IssueStatusIcon = (props) => {

	const {
		size = medium,
		status
	} = props;

	const { color, shape, label } = ISSUE_STATUS[status];

	let iconSize;
	switch (size) {
		case 'medium':
			iconSize = 32
			break;
		case 'small':
			iconSize = 20
			break;
	}

	return (
		<View style={{
			backgroundColor: color,
			width: iconSize,
			height: iconSize,
			borderRadius: iconSize,
			alignItems: 'center',
			justifyContent: 'center'
		}}>
			<Icon
				shape={shape}
				color="white"
				size="xsmall"
			/>
		</View>
	);
}

const {styles: indexStyles, ids: indexIds} = StyleSheet.create({
	categoryCard1: {
		marginVertical: 0,
		zIndex: 10,
		minHeight: 180,
	},
	categoryCard2: { 
		marginVertical: 0, position: 'absolute', top: 5, right: -5, bottom: -5, left: 5, zIndex: 9 
	},
	categoryCard3: { 
		marginVertical: 0, position: 'absolute', top: 10, right: -10, bottom: -10, left: 10, zIndex: 8 
	},
})


export const CategoryItemBak = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	const {
		category,
		color = SWATCHES.tint
	} = props;
	return (

		<Chunk>
			<View style={{ position: 'relative', marginRight: 10, marginBottom: 18 }}>
				<Card style={[
					indexStyles.categoryCard1, 
					{backgroundColor: color}
					//{backgroundColor: category.style.primaryColor}
				]}>
					<View style={{
						height: 60,
						backgroundColor: 'rgba(255, 255, 255, .35)',
					}} />
					<Sectionless style={{
						paddingTop: METRICS.space,
						flex: 1,
					}}>
						<Chunk style={{ flex: 0 }}>
							<Text type="big" inverted>{category.name}</Text>
							<Text type="small" style={{ textAlign: 'left' }} color="secondary" inverted>1,263 cards</Text>
						</Chunk>
					</Sectionless>
				</Card>
				<Card style={indexStyles.categoryCard2} />
				<Card style={indexStyles.categoryCard3} />
			</View>
		</Chunk>

	)
}

export const CategoryItem = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	const {
		category,
		color = SWATCHES.tint
	} = props;
	return (

		<Chunk>
			<View style={{ position: 'relative', marginRight: 10, marginBottom: 18 }}>
				<Card style={[
					indexStyles.categoryCard1, 
					{backgroundColor: color}
					//{backgroundColor: category.style.primaryColor}
				]}>
					<View style={{
						height: 60,
						backgroundColor: 'rgba(255, 255, 255, .35)',
					}} />
					<Sectionless style={{
						paddingTop: METRICS.space,
						flex: 1,
					}}>
						<Chunk style={{ flex: 0 }}>
							<Text type="big" inverted>{category.name}</Text>
							<Text type="small" style={{ textAlign: 'left' }} color="secondary" inverted>1,263 cards</Text>
						</Chunk>
					</Sectionless>
				</Card>
				<Card style={indexStyles.categoryCard2} />
				<Card style={indexStyles.categoryCard3} />
			</View>
		</Chunk>

	)
}

export const CategoryItem2 = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	const {
		category,
		color = SWATCHES.tint,
	} = props;


	return (

		<Chunk>
			<View style={{ position: 'relative', marginRight: 10, marginBottom: 18 }}>
				<Card style={[
					indexStyles.categoryCard1, 
					{backgroundColor: color},
					{minHeight: 170}
					//{backgroundColor: category.style.primaryColor}
				]}>
					<View style={{
						height: 45,
						backgroundColor: 'rgba(255, 255, 255, .2)',
					}} />
					<Sectionless style={{
						paddingTop: METRICS.space,
						flex: 1,
						justifyContent: 'flex-end'
					}}>
						<Chunk >
							<Text type="big" inverted>{category.name}</Text>
							<Text type="small" style={{ textAlign: 'left' }} color="secondary" inverted>{/*1,263 cards*/}{category.tldrCount} cards</Text>
						</Chunk>
					</Sectionless>
				</Card>
				<Card style={indexStyles.categoryCard2} />
				<Card style={indexStyles.categoryCard3} />
			</View>
		</Chunk>

	)
}

export const ISSUE_TYPES_KEYS = {
	OTHER: 0,
	UNCLEAR: 1,
	TYPO: 2,
	FALSE: 3,
	MOREINFO: 4,
	MISCATEGORIZED: 5,
	SPAM: 6,
	NOTCARD: 7,
}

export const ISSUE_TYPES = {
	[ISSUE_TYPES_KEYS.UNCLEAR]: { label: "Unclear", sort: 0 },
	[ISSUE_TYPES_KEYS.TYPO]: { label: "Typo", sort: 1 },
	[ISSUE_TYPES_KEYS.FALSE]: { label: "Correction", sort: 2 },
	[ISSUE_TYPES_KEYS.MOREINFO]: { label: "Additional info", sort: 3 },
	[ISSUE_TYPES_KEYS.MISCATEGORIZED]: { label: "Miscategorized", sort: 4 },
	[ISSUE_TYPES_KEYS.SPAM]: { label: "Spam", sort: 5 },
	[ISSUE_TYPES_KEYS.NOTCARD]: { label: "Not really a card", sort: 6 },
	[ISSUE_TYPES_KEYS.OTHER]: { label: "Other", sort: 1000 },
}




// negative status numbers are closed
// if this ever needs multiple close types
export const ISSUE_STATUS_KEYS = {
	CLOSED: -1,
	OPEN: 1
}

export const ISSUE_STATUS = {
	[ISSUE_STATUS_KEYS.CLOSED]: { label: "Closed", shape: "X", color: "red", pastVerb: "closed" },
	[ISSUE_STATUS_KEYS.OPEN]: { label: "Open", shape: "Check", color: "green", pastVerb: "reopened" },
}