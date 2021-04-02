import React, {Fragment, useState} from 'react';

// SWR
import { request, parsePageObj, getTldrsUrl, getCategoriesUrl, getCategoryUrl } from '@/swr';
import useSWR, { mutate }  from 'swr';

// REDUX
import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast } from '@/actions';

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
} from '@/components/cinderblock';
import Page from '@/components/Page';
import TldrHeader from './TldrHeader';
import {TldrCardSmall, CreateTldrCardSmall, CATEGORIES} from './components';

// STYLE
import styles from '@/components/cinderblock/styles/styles';
import swatches from '@/components/cinderblock/styles/swatches';
import { METRICS } from '@/components/cinderblock/designConstants';

// SCREEN-SPECIFIC 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

function TldrHome(props) {

      const { categoryId } = props;
      const isCategory = categoryId != undefined;

		const dispatch = useDispatch(); 
		const authentication = useSelector(state => state.authentication);
		const user = authentication.user || {};

      const category = useSWR( isCategory ? getCategoryUrl(categoryId) : null ); 
      const {data: categoryData} = category; 
      
      const tldrs = useSWR( isCategory ? getTldrsUrl({categoryId: categoryId, '$limit': 1000}) : null );
      const {data: tldrsData} = tldrs.data ? parsePageObj( tldrs ) : {data: []};

      const categories = useSWR( !isCategory ? getCategoriesUrl({'$limit': 1000}) : null );
      const {data: categoriesData} = categories.data ? parsePageObj( categories ) : {data: []};
		

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
                              items={categoriesData}
                              renderItem={(item, i)=>(
                                 <Chunk key={i}>
                                    <Link href={`/tldr/?categoryId=${item.id}`}>
                                       <View style={{backgroundColor: swatches.backgroundShade}}>
                                          <Sectionless>
                                             <Chunk>
                                                <Text type="big">{item.name}</Text>
                                             </Chunk>
                                             <Chunk>
                                                   <View style={{position: 'relative', marginRight: 10, marginBottom: 18}}>
                                                      <TldrCardSmall 
                                                         tldr={item.tldrs ? item.tldrs[0] : {}} 
                                                         style={{marginVertical: 0, zIndex: 10, minHeight: 160}}
                                                         />
                                                      <Card 
                                                         style={{marginVertical: 0, position: 'absolute', top: 5, right: -5, bottom: -5, left: 5, zIndex: 9}}
                                                         />
                                                      <Card 
                                                         style={{marginVertical: 0, position: 'absolute', top: 10, right: -10, bottom: -10, left: 10, zIndex: 8}}
                                                         />   
                                                   </View>
                                                   <Text type="small" style={{textAlign: 'right'}}>+ 1,263 more cards</Text>
                                                </Chunk>
                                             </Sectionless>
                                          </View>
                                       </Link>
                                    </Chunk>
                                 )}
                                 />
                        </Section>
                        <Section>
                     </Section>
                  </Bounds>
               </Stripe>
				}

            { (categoryId && categoryData) && 

               <Stripe style={{flex: 1, backgroundColor: swatches.notwhite}}>
                  <Bounds>
                     <Section>
                        <Chunk>
                           <Text type="pageHead">{categoryData.name}</Text>
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