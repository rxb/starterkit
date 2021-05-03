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
	Text,
	TextInput,
	Touch,
	useMediaContext,
	View,	
} from 'modules/cinderblock';
import Page from '@/components/Page';
import TldrHeader from '../../components/tldr/TldrHeader';
import {TldrCardSmall, CreateTldrCardSmall, LoadMoreButton} from '../../components/tldr/components';

// STYLE
import styles from 'modules/cinderblock/styles/styles';
import swatches from 'modules/cinderblock/styles/swatches';
import { METRICS } from 'modules/cinderblock/designConstants';

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
		const canEdit = (authentication && user.data?.id == authentication?.user?.id); 
		// TODO: admin permission
		
		const PAGE_SIZE = 12;

		const authorTldrs = pageHelper(useSWRInfinite(
			(index) => [getTldrsUrl({authorId: userId, $limit: PAGE_SIZE, $skip: PAGE_SIZE*index}), authentication.accessToken ]	
		));
		
		// TODO: updated to saved cards
		const tldrs = pageHelper(useSWRInfinite(
			(index) => [getTldrsUrl({$limit: PAGE_SIZE, $skip: PAGE_SIZE*index}), authentication.accessToken ]		
		));


		// DIVERT TO ERROR PAGE
		if (user.error) {
			const error = user.error;
			return <ErrorPage statusCode={error.code} />
		}
	
		// RENDER
		return (
			<Page>
				<TldrHeader />
				

				{ userId && user.data && authorTldrs.data && tldrs.data && 
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
											<Text type="pageHead">@{user.data.urlKey}</Text>
											<Text>{user.data.name}</Text>
										</Chunk>
									</FlexItem>
									<FlexItem />
									{canEdit && 
										<FlexItem shrink justify="flex-end">
											<Chunk>
												<Link href={getProfileEditPageUrl()}> 
													<Button color="secondary" label="Settings" />
												</Link>
											</Chunk>
										</FlexItem>
									}
								</Flex>
								
							</Section>
							<Section border>
								<Flex>
									<FlexItem justify="center">
										<Chunk>
											<Text type="sectionHead">Author ({authorTldrs.total})</Text>
										</Chunk>		
									</FlexItem>
									
								</Flex>
								
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

							</Section>
							
							<Section border>
								<Flex>
									<FlexItem justify="center">
										<Chunk>
											<Text type="sectionHead">Saved ({tldrs.total})</Text>
										</Chunk>		
									</FlexItem>
								</Flex>
								
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
									items={tldrs.data}
									paginated={true}
									renderItem={(item, i)=>(
										<Chunk key={i}>
											<Link href={ getTldrPageUrl({tldrId: item.id}) }>
												<TldrCardSmall tldr={item} user={authentication.user} />
											</Link>
										</Chunk>
									)}
									/>

									<LoadMoreButton swr={tldrs} />

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