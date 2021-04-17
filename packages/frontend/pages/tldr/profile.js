import React, {Fragment, useState} from 'react';

// SWR
import {
	request,
	swrSugar,
	parsePageObj,
	getUserUrl,
	getTldrsUrl,
} from '@/swr';
import useSWR, { mutate, useSWRInfinite }  from 'swr';

// REDUX
import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast } from '@/actions';

// URLS
import { getVersionEditPageUrl, getTldrEditPageUrl, getTldrPageUrl, getProfileEditPageUrl} from 'components/tldr/urls';

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
import {TldrCardSmall, CreateTldrCardSmall} from '../../components/tldr/components';

// STYLE
import styles from 'modules/cinderblock/styles/styles';
import swatches from 'modules/cinderblock/styles/swatches';
import { METRICS } from 'modules/cinderblock/designConstants';

// SCREEN-SPECIFIC
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

function TldrProfile(props) {

		const dispatch = useDispatch(); 

		const authentication = useSelector(state => state.authentication);
		const user = authentication.user || {};
		const userId  = props.userId || user.id;
		
		const {data: userData} = useSWR( getUserUrl(userId) );
		
		const PAGE_SIZE = 12;

		const authorTldrs = swrSugar(useSWRInfinite(
			(index) => [getTldrsUrl({self: true, $limit: PAGE_SIZE, $skip: PAGE_SIZE*index}), authentication.accessToken ]		
		));
		
		const tldrs = swrSugar(useSWRInfinite(
			(index) => [getTldrsUrl({$limit: PAGE_SIZE, $skip: PAGE_SIZE*index}), authentication.accessToken ]		
		));

	
		
		return (
			<Page>
				<TldrHeader />
				
				{/*
				<Flex>
					<FlexItem>
						<View style={{whiteSpace: 'pre-wrap'}}>
						{JSON.stringify(tldrs, null, 2)}
						</View>
					</FlexItem>
					<FlexItem>
						<View style={{whiteSpace: 'pre-wrap'}}>
						{JSON.stringify(authorTldrs, null, 2)}	
						</View>
					
					</FlexItem>
				</Flex>
				*/}

				{ userData && authorTldrs.res && tldrs.res && 
					<Stripe style={{flex: 1, backgroundColor: swatches.notwhite}}>
						<Bounds>
							<Section>
								<Flex>
									<FlexItem shrink justify="center">
										<Chunk>
											<Avatar
												source={{uri: userData.photoUrl}}
												size="large"
												/>
										</Chunk>
									</FlexItem>
									<FlexItem>
										<Chunk>
											<Text type="pageHead">@{userData.urlKey}</Text>
											<Text>{userData.name}</Text>
										</Chunk>
									</FlexItem>
									<FlexItem />
									<FlexItem shrink justify="flex-end">
										<Chunk>
											<Link href={getProfileEditPageUrl()}> 
												<Button color="secondary" label="Settings" />
											</Link>
										</Chunk>
									</FlexItem>
								</Flex>
								
							</Section>
							<Section border>
								<Flex>
									<FlexItem justify="center">
										<Chunk>
											<Text type="sectionHead">Author ({authorTldrs.res[0].total})</Text>
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
									items={authorTldrs.res}
                              renderItem={(item, i)=>{
											const href = (item.currentTldrVersion != undefined) ? 
												getTldrPageUrl({tldrId: item.id}) :
												getVersionEditPageUrl({tldrId: item.id});
											return (
												<Chunk key={i}>
													{ !item.last &&
														<Link href={href}>
															<TldrCardSmall tldr={item}  />
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
									{ !authorTldrs.isReachingEnd && 
									<Button
										isLoading={authorTldrs.isLoadingMore}
										color="secondary"
										onPress={()=>{
											authorTldrs.setSize(authorTldrs.size+1)
										}}
										label="Load more"
										/>
									}

						

									<Text>{authorTldrs.pageSize}</Text>
							</Section>
							
							<Section border>
								<Flex>
									<FlexItem justify="center">
										<Chunk>
											<Text type="sectionHead">Saved ({tldrs.res[0].total})</Text>
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
									items={tldrs.res}
									paginated={true}
									renderItem={(item, i)=>(
										<Chunk key={i}>
											<Link href={ getTldrPageUrl({tldrId: item.id}) }>
												<TldrCardSmall tldr={item} />
											</Link>
										</Chunk>
									)}
									/>

									{ !tldrs.isReachingEnd && 
									<Button
										isLoading={tldrs.isLoadingMore}
										color="secondary"
										onPress={()=>{
											tldrs.setSize(tldrs.size+1)
										}}
										label="Load more"
										/>
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