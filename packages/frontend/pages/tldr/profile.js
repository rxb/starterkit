import React, {Fragment, useState} from 'react';

// SWR
import {
	request,
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
		
		// PAGINATION TEST
		const swrSugar = (swr) => {
			// feathers returns a data key in a paginated response and 
			// tldrs.data.data is too weird
			swr.res = swr.data;
			swr.isLoadingInitialData = !swr.data && !swr.error;
			swr.isLoadingMore =
			  swr.isLoadingInitialData ||
			  (swr.size > 0 && swr.res && typeof swr.res[swr.size - 1] === "undefined");
			swr.isEmpty = swr.res?.[0]?.data.length === 0;
			swr.pageSize = swr.res?.[0]?.limit || 0;
			swr.isReachingEnd =
			  swr.isEmpty || (swr.res && swr.res[swr.res.length - 1]?.data.length < swr.pageSize);
			swr.isRefreshing = swr.isValidating && swr.res && swr.res.length === swr.size;
			return swr;
		}
		const PAGE_SIZE = 4;
		//{ data: res, error, mutate, size, setSize, isValidating }
		const authorTldrs = swrSugar(useSWRInfinite(
			index => [getTldrsUrl({self: true, $limit: PAGE_SIZE, $skip: PAGE_SIZE*index}), authentication.accessToken ]		
		));
		
	

		/*
		const authorTldrs = useSWR( [getTldrsUrl({self: true}), authentication.accessToken ] );
		const {data: authorTldrsData} = parsePageObj( authorTldrs );
		*/

		const tldrs = useSWR( getTldrsUrl() );
		const {data: tldrsData} = parsePageObj( tldrs );
		
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

				{ userData && authorTldrs.res && tldrsData && 
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

									{ authorTldrs.isReachingEnd &&
										<Text>That's all folks</Text>
									}

									<Text>{authorTldrs.pageSize}</Text>
							</Section>
							
							<Section border>
								<Flex>
									<FlexItem justify="center">
										<Chunk>
											<Text type="sectionHead">Saved ({tldrsData.length})</Text>
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
									items={tldrsData}
									renderItem={(item, i)=>(
										<Chunk key={i}>
											<Link href={ getTldrPageUrl({tldrId: item.id}) }>
												<TldrCardSmall tldr={item} />
											</Link>
										</Chunk>
									)}
									/>
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