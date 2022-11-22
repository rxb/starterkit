import React, { Fragment, useState, useEffect, useCallback, useRef, useContext } from 'react';
import ErrorPage from 'next/error'

// SWR
import { request, getTldrUrl, getCategoriesUrl } from '@/swr';
import useSWR, { mutate } from 'swr';

// REDUX
import { connect, useDispatch, useSelector } from 'react-redux';
import { addPrompt, addToast, addDelayedToast } from '@/actions';

// URLS
import { getTldrPageUrl, getVersionEditPageUrl } from '../../components/tldr/urls';

// COMPONENTS
import {
	Avatar,
	Bounds,
	Button,
	Card,
	CheckBox,
	Chunk,
	FakeInput,
	FieldError,
	Flex,
	FlexItem,
	FileInput,
	Icon,
	Inline,
	Image,
	Label,
	List,
	Link,
	Modal,
	Picker,
	Reorderable,
	RevealBlock,
	Section,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch,
	View,
	useFormState,
	ThemeContext
} from 'cinderblock';
import Page from '@/components/Page';
import TldrHeader from '@/components/tldr/TldrHeader';
import {LoadingPage} from '@/components/tldr/components';
import Router from 'next/router'


// SCREEN-SPECIFIC
import { Animated } from 'cinderblock';
import { Utils } from 'cinderblock';
const { runValidations, readFileAsDataUrl } = Utils;
import {removeStopwords} from 'stopword';

const cleanUrlKey = (dirtyUrlKey) => {
	return dirtyUrlKey.replace(/[^A-Za-z0-9-\s]+/gi, "")
		.replace(/\s+/gi, "-")
		.replace(/[-]+/gi, "-")
		.toLowerCase();
}

const buildUrlKey = (pieces = []) => {
	const wordArray = pieces.join(' ').split(' ');
	const stoplessWordArray = removeStopwords(wordArray);
	return cleanUrlKey(stoplessWordArray.join(' ').trim());
}

const editValidations = {
	urlKey: {
		// TODO: add client-side uniqueness validation 
		// (server will catch it for now)
		notEmpty: {
			msg: "Link can't be blank"
		},
	},
	category: {
		notNull: {
			msg: "Pick a category"
		},
	}
};


const UrlKeyField = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	const { formState, user } = props;
	return (
		<>
			<Flex flush>
				<FlexItem flush shrink justify="center" >
					<View
						style={[styles.input, { borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 0 }]}
					>
						<Text color="secondary">{user.urlKey}/</Text>
					</View>
				</FlexItem>
				<FlexItem flush>
					<TextInput
						spellCheck={false}
						style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
						id="urlKey"
						value={formState.getFieldValue('urlKey')}
						onChange={e => formState.setFieldValue('urlKey', cleanUrlKey(e.target.value)
						)}
					/>
				</FlexItem>
			</Flex>
			<FieldError error={formState.error?.fieldErrors?.urlKey} />
		</>
	);
}

const CategoryField = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	const { formState, categoriesData } = props;
	return (
		<View style={styles.pseudoLineHeight}>
			<List
				variant={{
					small: 'grid',
				}}
				itemsInRow={{
					small: 2,
					//medium: 3,
					large: 3
				}}
				items={categoriesData}
				renderItem={(category, i) => {
					const selected = category.id == formState.getFieldValue('categoryId');
					return (
						<Touch onPress={() => {
							formState.setFieldValue('categoryId', category.id)
						}}>
							<View style={[
								styles.input,
								(selected ? styles['input--focus'] : {}),
								{
									justifyContent: 'center', 
									backgroundColor: selected ? SWATCHES.tint : SWATCHES.notWhite,
									borderRadius: 32
								},
							]}>
								<Inline>
								{ selected &&
									<Icon	
										shape="Check"
										color="white"
										size="small"
										/>
								}
								<Text 
									type="small" 
									weight={selected ? "strong" : ""}
									inverted={selected}
									>{category.name}</Text>
								</Inline>
							</View>
						</Touch>
					)
				}}
			/>
			<FieldError error={formState.error?.fieldErrors?.categoryId} />
		</View>
	);
}

const Edit = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);
	const { tldrId, tldr, categoryId } = props;

	const urlKeyRef = useRef();

	const dispatch = useDispatch();
	const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

	const categories = useSWR(getCategoriesUrl({ '$limit': 1000, "$sort[defaultOrder]": 1 }));
	const categoriesData = categories.data ? categories.data.items : [];

	const [formStep, setFormStep] = useState(0);

	const formState = useFormState({
		initialFields: {
			verb: '',
			noun: '',
			about: '',
			urlKey: '',
			categoryId: categoryId || null,
			...tldr
		},
		toastableErrors: {
			BadRequest: 'Something went wrong',
			NotAuthenticated: 'Not signed in'
		},
		addToast: msg => dispatch(addToast(msg))
	});

	const submitForm = async () => {
		const submitFields = { ...formState.fields };
		const error = runValidations(submitFields, editValidations);
		formState.setError(error);
		if (!error) {
			formState.setLoading(true);
			try {
				// PATCH or POST
				if (tldrId != undefined) {
					const tldr = await request(getTldrUrl(tldrId), {
						method: 'PATCH',
						data: submitFields,
						token: authentication.accessToken
					});
					const toastMessage = "Settings updated!";
					dispatch(addDelayedToast(toastMessage));
					Router.push({ pathname: getTldrPageUrl(), query: { tldrId: tldr.id } })
				}
				else {
					const tldr = await request(getTldrUrl(), {
						method: 'POST',
						data: submitFields,
						token: authentication.accessToken
					});
					const toastMessage = "Great, now you can write the first version of your card";
					dispatch(addDelayedToast(toastMessage));
					Router.push({ pathname: getVersionEditPageUrl(), query: { tldrId: tldr.id } })
				}
			}
			catch (error) {
				console.log(error);
				formState.setError(error);
				formState.setLoading(false);
			}
		}
	}


	// DIVERT PAGE?
	// not logged in or trying to edit something I don't own
	if (!authentication.user || (tldr && tldr.authorId && user.id && (tldr.authorId != user.id)) ) {
		if (authentication.loading) {
			return <LoadingPage />;
		}
		else{
			return <ErrorPage statusCode={401} />;
		}
	}


	// RENDER
	if (tldrId != undefined) {
		return (
			<Page>
				<TldrHeader />
				<Stripe>
					<Bounds style={{ maxWidth: 640 }}>
						<Section>
							<Chunk>
								<Text type="pageHead">Card settings</Text>
							</Chunk>
						</Section>
						<Section>
							<form>
								<Chunk>
									<Label for="urlKey">URL</Label>
									<UrlKeyField formState={formState} user={user} />
								</Chunk>
								<Chunk>
									<Label for="category">Category</Label>
									<CategoryField formState={formState} categoriesData={categoriesData} />
								</Chunk>
								<Chunk>
									<Button
										label="Save"
										onPress={submitForm}
										isLoading={formState.loading}
										/>
								</Chunk>
							</form>
						</Section>
					</Bounds>
				</Stripe>
			</Page>
		);
	}
	else {
		return (
			<Page>
				<TldrHeader />
				<Stripe>
					<Bounds style={{ maxWidth: 640 }}>
						<Section>
							<Chunk>
								<Text type="pageHead">Create new card</Text>
							</Chunk>
						</Section>
						<Section>
							<form autocomplete="off">

									<Chunk>
										<Label for="title">What is your card about?</Label>

										<TextInput
											id="about"
											placeholder=""
											value={formState.getFieldValue('about')}
											onChange={e => {
												const value = e.target.value;
												const urlKey = buildUrlKey([ value ]);
												formState.setFieldValues({
													'about': value,
													'urlKey': urlKey
												});
											}}
										/>
										<FieldError error={formState.error?.fieldErrors?.about} />
									</Chunk>

									<Chunk>
										<Label for="title">What category fits the best?</Label>
										<CategoryField formState={formState} categoriesData={categoriesData} />
									</Chunk>

									<Chunk>
										<Label for="title">How's this as a URL for your card?</Label>
										<UrlKeyField formState={formState} user={user} />
									</Chunk>

									<Chunk>
										<Button
											label="Next"
											onPress={submitForm}
											isLoading={formState.loading}
										/>
									</Chunk>
							</form>

						</Section>
					</Bounds>
				</Stripe>
			</Page>
		)
	}
}

Edit.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const { store, req, pathname, query } = context;
	const isServer = !!req;
	const categoryId = query.categoryId;
	const tldrId = query.tldrId;
	const tldr = (tldrId != undefined) ? await request(getTldrUrl(tldrId)) : undefined;

	return {
		categoryId,
		isServer,
		tldrId,
		tldr
	}
}


export default Edit;



