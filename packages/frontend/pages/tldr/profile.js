import React, {Fragment, useState, useEffect} from 'react';
import ErrorPage from 'next/error'

// SWR
import {
	request,
	pageHelper,
	getUserUrl,
	getTldrsUrl,
} from '@/swr';
import useSWR, { mutate, useSWRInfinite }  from 'swr';

// REDUX
import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast, addDelayedToast, updateUi } from '@/actions';

// URLS
import { getIndexPageUrl, getVersionEditPageUrl, getTldrEditPageUrl, getTldrPageUrl, getProfileEditPageUrl} from 'components/tldr/urls';

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
	Label,
	List,
	Link,
	Modal,
	Picker,
	Section,
	Sectionless,
	Stripe,
	Tabs,
	Text,
	TextInput,
	Touch,
	useMediaContext,
	View,	
} from 'cinderblock';
import Page from '@/components/Page';
import TldrHeader from '../../components/tldr/TldrHeader';
import {TldrCardSmall, CreateTldrCardSmall, LoadMoreButton, Emptiness} from '../../components/tldr/components';

// STYLE
import {styles} from 'cinderblock';
import {swatches} from 'cinderblock';
import {DesignConstants} from 'cinderblock';
const { METRICS } = DesignConstants;

// SCREEN-SPECIFIC
import Router from 'next/router'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

function TldrProfile(props) {

		const dispatch = useDispatch(); 

		const authentication = useSelector(state => state.authentication);
		const userId  = props.userId || authentication?.user?.id;
		
		// trying to get self when not logged in? redirect to home
		useEffect(()=>{
			if(!userId && !authentication.token){
				dispatch( addDelayedToast("Need to be logged in for that") );
				Router.push({pathname: getIndexPageUrl()})
			}	
		}, [userId]);

		const user = useSWR( getUserUrl(userId) );
		const isSelf = (authentication && user.data?.id == authentication?.user?.id); 
		// TODO: admin permission
		
		const PAGE_SIZE = 12;
		const authorTldrs = pageHelper(useSWRInfinite(
			(index) => [getTldrsUrl({authorId: userId, $limit: PAGE_SIZE, $skip: PAGE_SIZE*index}), authentication.accessToken ]	
		));
		
	
		// DIVERT TO ERROR PAGE
		if (user.error || authorTldrs.error) {
			const error = user.error || authorTldrs.error;
			return <ErrorPage statusCode={error.code} />
		}
	
		// RENDER
		return (
			<Page>
				<TldrHeader />

				{ userId && user.data && authorTldrs.data && 
					<Stripe style={{flex: 1, backgroundColor: swatches.notwhite}}>
						<Bounds>
							<Section>

								<Flex>
									<FlexItem shrink justify="center">
										<Chunk>
											<Avatar
												source={{uri: user.data.photoUrl}}
												size="large"
												/>
										</Chunk>
									</FlexItem>
									<FlexItem>
										<Chunk>
											<Text type="pageHead">{user.data.name}</Text>
											<Text>@{user.data.urlKey}</Text>
										</Chunk>
									</FlexItem>
									
									{/*isSelf && 
										<FlexItem shrink justify="flex-end">
											<Chunk>
												<Link href={getProfileEditPageUrl()}> 
													<Button color="secondary" label="Settings" />
												</Link>
											</Chunk>
										</FlexItem>
									*/}
								</Flex>

							</Section>
							<Section border>

								{ authorTldrs.total == 0 && 
									<Emptiness 
										label="No cards yet"
										>
										{ isSelf && 
										<Chunk>
											<Link href={ getTldrEditPageUrl() }>
												<Button 
													label="Create a new card" 
													size="small" 
													/>
											</Link>
										</Chunk>
										}
									</Emptiness>
								}

								{ authorTldrs.total > 0 && 
									<>
										<Chunk>
											<Text type="sectionHead">
												{authorTldrs.total} cards
											</Text>
										</Chunk>

										<List
											variant={{
												small: 'grid',
											}}
											itemsInRow={{
												small: 1,
												medium: 2,
												large: 4
											}}
											scrollItemWidth={300}
											paginated={true}
											items={authorTldrs.data}
												renderItem={(item, i)=>{
													const href = (item.currentTldrVersion != undefined) ? 
														getTldrPageUrl({tldrId: item.id}) :
														getVersionEditPageUrl({tldrId: item.id});
													return (
														<Chunk key={i}>
															{ !item.last &&
																<Link href={href}>
																	<TldrCardSmall tldr={item} user={authentication.user} />
																</Link>
															}
															{ item.last &&
																<Link href={ getTldrEditPageUrl() }>
																	<CreateTldrCardSmall />
																</Link>
															}
														</Chunk>
													);
												}}
											/>

											<LoadMoreButton swr={authorTldrs} />
										</>	
									}

								
							

						
						</Section>
					</Bounds>
				</Stripe>
				}
			</Page>
		);


}

TldrProfile.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const {store, req, pathname, query} = context;
	const userId = query.userId;
	const isServer = !!req;	

	return {
		userId: userId,
		isServer,
	}
}

const listItemStyle = {
	borderTopColor: swatches.border,
	borderTopWidth: 1,
	paddingTop: METRICS.space
}


export default TldrProfile;