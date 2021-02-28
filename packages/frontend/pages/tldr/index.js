import React, {Fragment, useState} from 'react';

import {
	useTldrs
} from '@/swr';

import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast } from '@/actions';


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
} from '@/components/cinderblock';

import styles from '@/components/cinderblock/styles/styles';
import swatches from '@/components/cinderblock/styles/swatches';
import { sleep } from '@/components/cinderblock/utils';
import { METRICS } from '@/components/cinderblock/designConstants';
import Page from '@/components/Page';
import TldrHeader from '@/components/TldrHeader';


import {TldrCardSmall, CreateTldrCardSmall} from './components';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

// at some point make real categories
const categories = [
   {name: 'Personal finance'},
   {name: 'Health & fitness'},
   {name: 'Social'},
   {name: 'Travel'},
   {name: 'Career'},
   {name: 'Parenting'},
   {name: 'Emergency prep'},
   {name: 'Self-care'},
   {name: 'Home Ec'},
   {name: 'Cooking'},
   {name: 'Arts'},
];

function TldrHome(props) {

      const { categoryId } = props
      const category = categories[categoryId];

		const dispatch = useDispatch(); 
		const authentication = useSelector(state => state.authentication);
		const user = authentication.user || {};
		const {data: tldrsData, error: tldrsError, mutate: tldrsMutate} = useTldrs();
		

		return (
			<Page>
            <TldrHeader />

				{ !categoryId && 
                  <Stripe>
                     <Bounds>
                        <Section>
                           <List
                              variant={{
                                 small: 'grid',
                              }}
                              itemsInRow={{
                                 small: 1,
                                 medium: 2,
                                 large: 3
                              }}
                              scrollItemWidth={300}
                              items={categories}
                              renderItem={(item, i)=>(
                                 <Chunk key={i}>
                                    <Link href={`/tldr/?categoryId=${i}`}>
                                       <View style={{backgroundColor: swatches.backgroundShade}}>
                                          <Sectionless>
                                             <Chunk>
                                                <Text type="big">{item.name}</Text>
                                                   <View style={{position: 'relative', marginRight: 10, marginBottom: 14, marginTop: 4}}>
                                                      <TldrCardSmall 
                                                         tldr={tldrsData ? tldrsData[0] : {}} 
                                                         style={{marginVertical: 0, zIndex: 10, minHeight: 160}}
                                                         />
                                                      <Card 
                                                         style={{marginVertical: 0, position: 'absolute', top: 5, right: -5, bottom: -5, left: 5, zIndex: 9}}
                                                         />
                                                      <Card 
                                                         style={{marginVertical: 0, position: 'absolute', top: 10, right: -10, bottom: -10, left: 10, zIndex: 8}}
                                                         />   
                                                   </View>
                                                   <Text type="small">+ 1,263 more cards</Text>
                                                </Chunk>
                                             </Sectionless>
                                          </View>
                                       </Link>
                                    </Chunk>
                                 )}
                                 />
                        </Section>
                  </Bounds>
               </Stripe>
				}

            { (categoryId && tldrsData) && 

               <Stripe style={{flex: 1, backgroundColor: swatches.notwhite}}>
                  <Bounds>
                     <Section>
                        <Chunk>
                           <Text type="pageHead">{category.name}</Text>
                        </Chunk>
                     </Section>
                     <Section border>
                        <Chunk>
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
                              items={[...tldrsData, {last: true}]}
                              renderItem={(item, i)=>(
                                 <Chunk key={i}>
                                    { !item.last &&
                                       <Link href={`/tldr/tldr?tldrId=${item.id}`}>
                                          <TldrCardSmall tldr={item} style={{minHeight: 160}} />
                                       </Link>
                                    }
                                    { item.last &&
                                       <Link href={`/tldr/edit`}>
                                          <CreateTldrCardSmall />
                                         
                                       </Link>
                                    }
                                 </Chunk>
                              )}
                              />
                        </Chunk>
                     </Section>
                  </Bounds>
               </Stripe>

            }
			</Page>
		);


}

TldrHome.getInitialProps = async (context) => {
	// next router query bits only initially available to getInitialProps
	const {store, req, pathname, query} = context;
   const {categoryId} = query;
	const isServer = !!req;	

	return {
      categoryId,
      isServer,
	}
}

const listItemStyle = {
	borderTopColor: swatches.border,
	borderTopWidth: 1,
	paddingTop: METRICS.space
}




export default TldrHome;