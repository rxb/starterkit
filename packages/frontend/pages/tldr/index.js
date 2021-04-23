import React, {Fragment, useState} from 'react';

// SWR
import { request, pageHelper, getTldrsUrl, getCategoriesUrl, getCategoryUrl } from '@/swr';
import useSWR, { useSWRInfinite, mutate }  from 'swr';

// REDUX
import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast } from '@/actions';

// URLS
import {getIndexPageUrl, getCategoryPageUrl, getTldrPageUrl, getTldrEditPageUrl} from '../../components/tldr/urls';

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
import {TldrCardSmall, CreateTldrCardSmall, CategoryCardSmall, LoadMoreButton} from '../../components/tldr/components';

// STYLE
import styles from 'modules/cinderblock/styles/styles';
import swatches from 'modules/cinderblock/styles/swatches';
import { METRICS } from 'modules/cinderblock/designConstants';

// SCREEN-SPECIFIC 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import {TESTCOLORS1 as TESTCOLORS} from '../../components/tldr/testcolors';

const CategoryItem = (props) => {
   const {
      category,
      color = swatches.tint
   } = props;
   return (
    

            <Chunk>
               <View style={{position: 'relative', marginRight: 10, marginBottom: 18}}>
               <Card 
                  style={{
                     marginVertical: 0, 
                     zIndex: 10,
                     minHeight: 180,
                     backgroundColor: color,
                  }}
                  >
                  <View style={{
                     height: 60,
                     backgroundColor: 'rgba(255, 255, 255, .35)',
                  }}/>
                  <Sectionless style={{
                        paddingTop: METRICS.space,
                        flex: 1,
                     }}>
                     
                     <Chunk style={{flex: 0}}>
                        <Text type="big" inverted>{category.name}</Text>
                        <Text type="small" style={{textAlign: 'left'}} inverted>1,263 cards</Text>
                     </Chunk>
                  </Sectionless>
                  </Card>
                  <Card 
                     style={{marginVertical: 0, position: 'absolute', top: 5, right: -5, bottom: -5, left: 5, zIndex: 9}}
                     />
                  <Card 
                     style={{marginVertical: 0, position: 'absolute', top: 10, right: -10, bottom: -10, left: 10, zIndex: 8}}
                     />   
               </View>
            </Chunk>
           
   )
}

function TldrHome(props) {

      const { categoryId } = props;
      const isCategory = categoryId != undefined;

		const dispatch = useDispatch(); 
		const authentication = useSelector(state => state.authentication);
		const user = authentication.user || {};

      const category = useSWR( isCategory ? getCategoryUrl(categoryId) : null ); 

      const PAGE_SIZE = 12;
      const tldrs = pageHelper(useSWRInfinite( isCategory ?
			(index) => [getTldrsUrl({categoryId, $limit: PAGE_SIZE, $skip: PAGE_SIZE*index}), authentication.accessToken] : null	
		));

      const categories = pageHelper(useSWR( !isCategory ? 
         getCategoriesUrl({'$limit': 1000}) : null 
      ));
		

		return (
			<Page>
            
            <TldrHeader />

				{ !categoryId && categories.data &&
                  <Stripe style={{flex: 1, backgroundColor: swatches.notwhite}}>
                     <Bounds>
                        {/*
                        <Section>
                           <Chunk>
                              <Text type="pageHead">Categories</Text>
                           </Chunk>
                        </Section>
                        */} 
                        <Section >
                           <List
                              variant={{
                                 small: 'grid',
                              }}
                              itemsInRow={{
                                 small: 2,
                                 medium: 3,
                                 large: 4,
                                 xlarge: 5
                              }}
                              scrollItemWidth={300}
                              items={categories.data.items}
                              renderItem={(category, i)=>(
                                 <Chunk key={i}>
                                    <Link href={ getCategoryPageUrl({categoryId: category.id}) }>
                                       <CategoryItem category={category} color={TESTCOLORS[category.id - 2%TESTCOLORS.length]} />   
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

            { (categoryId && category.data && tldrs.data ) && 

               <Stripe style={{flex: 1, backgroundColor: swatches.notwhite}}>
                  <Bounds>
                     <Section>
                        <Chunk>
                           <Text type="pageHead">{category.data.name}</Text>
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
                              items={tldrs.data}
                              paginated={true}
                              renderItem={(item, i)=>(
                                 <Chunk key={i}>
                                    { !item.last &&
                                       <Link href={ getTldrPageUrl({tldrId: item.id}) }>
                                          <TldrCardSmall 
                                             tldr={item} 
                                             dispatch={dispatch} 
                                             mutate={tldrs.mutate}
                                             />
                                       </Link>
                                    }
                                    { item.last &&
                                       <Link href={ getTldrEditPageUrl({categoryId: category.data.id}) }>
                                          <CreateTldrCardSmall />
                                         
                                       </Link>
                                    }
                                 </Chunk>
                              )}
                              />

                              <LoadMoreButton swr={tldrs} />

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