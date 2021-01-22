import React, {Fragment, useEffect, useState} from 'react';
import { connect, useSelector } from 'react-redux';
import useSWR, { mutate }  from 'swr'


import {
	fetcher,
	getShowUrl,
	useShow,
	postShowComment
} from '../swr';

import {
	Avatar,
	Bounds,
	Button,
	Card,
	CheckBox,
	Chunk,
	Flex,
	FlexItem,
	Icon,
	Inline,
	Image,
	Label,
	List,
	Link,
	Map,
	Modal,
	Picker,
	Section,
	Sections,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch,
	View,
	withFormState
} from '../components/cinderblock';

import styles from '../components/cinderblock/styles/styles';
import Page from '../components/Page';




function Scratch(props) {

	// hack
	const showId = 1;
	const authentication = useSelector(state => state.authentication);

	const fetcher = (...args) => fetch(...args).then(res => res.json());
	const apiUrl = 'http://localhost:3030/';

	
	const getShowCommentsUrl = id => `${apiUrl}show_comments/?showId=${id}`;
	const {data: showCommentsData, mutate: showCommentsMutate} = useSWR(getShowCommentsUrl(showId), fetcher);



		return (
			<Page>
				<Stripe>
					<Bounds>
							<Section type="pageHead">

								<Chunk>
									<Text type="pageHead">Swr test</Text>
									<Text>{showCommentsData && showCommentsData.data ? showCommentsData.length : 'UNDEFINED'}</Text>
								</Chunk>

							</Section>

							<Section>
							{showCommentsData && showCommentsData.data && showCommentsData.data.map((comment, i)=>{

								comment.user = comment.user || {};
								return (
									<Chunk key={i} style={{...(comment.optimistic ? {opacity:.5} : {}) }}>
										
												<Text>{comment.body}</Text>
												
									</Chunk>

								);
								})}

								<Chunk>
									<Button 
										label="add comment" 
										onPress={async ()=>{
											const data = {body: 'this is a new comment', showId}
											mutate(getShowCommentsUrl(showId), {
												...showCommentsData, 
												data: [
													...showCommentsData.data,
													data
												]
											}, false);
											await postShowComment(data, authentication.token);
											mutate(getShowCommentsUrl(showId));
										}}
										/>
								</Chunk>
							</Section>	

					</Bounds>
				</Stripe>
			</Page>
		);


}



export default Scratch;