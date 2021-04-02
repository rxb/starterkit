import React, {Fragment, useState, useEffect, useCallback, useRef } from 'react';

// SWR
import { request, parsePageObj, getTldrUrl, getCategoriesUrl } from '@/swr';
import useSWR, { mutate }  from 'swr';

// REDUX
import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast, addDelayedToast } from '@/actions';

// URLS
import {getTldrPageUrl, getVersionEditPageUrl} from './urls';

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
	useFormState
} from '@/components/cinderblock';
import Page from '@/components/Page';
import TldrHeader from './TldrHeader';
import Router from 'next/router'
import Head from 'next/head'

// STYLE
import styles from '@/components/cinderblock/styles/styles';
import swatches from '@/components/cinderblock/styles/swatches';
import {METRICS, EASE} from '@/components/cinderblock/designConstants';

// SCREEN-SPECIFIC
import { Animated } from '@/components/cinderblock/primitives';
import { runValidations, readFileAsDataUrl } from '@/components/cinderblock/utils';
import stopword from 'stopword';

const cleanUrlKey = (dirtyUrlKey) => {
   return dirtyUrlKey.replace(/[^A-Za-z0-9-\s]+/gi, "")
            .replace(/\s+/gi,"-")
            .replace(/[-]+/gi, "-")
            .toLowerCase();
}

const buildUrlKey = (pieces = []) => {
   const wordArray = pieces.join(' ').split(' ');
   const stoplessWordArray = stopword.removeStopwords(wordArray);
   return cleanUrlKey( stoplessWordArray.join(' ').trim() );
            
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
   const {formState, user} = props;
   return(
      <>
      <Flex flush>
         <FlexItem flush shrink justify="center" >
            <View 
               style={[styles.input, {borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 0}]}  
               >
               <Text color="hint">{user.urlKey}/</Text>
            </View>
         </FlexItem>
         <FlexItem flush>
            <TextInput
               spellCheck={false}
               style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
               id="urlKey"
               value={formState.getFieldValue('urlKey')}
               onChange={e => formState.setFieldValue('urlKey', cleanUrlKey(e.target.value)
               ) }
               />
         </FlexItem>
      </Flex>
      <FieldError error={formState.error?.fieldErrors?.urlKey} />	
      </>
   );
}

const CategoryField = (props) => {
   const {formState, categoriesData} = props;
   return(
      <>
      <List
         variant={{
            small: 'grid',
         }}
         itemsInRow={{
            medium: 2,
            large: 3
         }}
         items={categoriesData}
         renderItem={(category, i)=>{
            const selected = category.id == formState.getFieldValue('categoryId');
            return (
               <Touch onPress={()=>{
                  formState.setFieldValue('categoryId', category.id)
               }}>
                  <View style={[
                     styles.input,
                     (selected) 
                        ? { backgroundColor:  swatches.tint} 
                        : { }
                  ]}>
                     <Text inverted={selected}>{category.name}</Text>
                  </View>
               </Touch>
            )
         }}
         />
      <FieldError error={formState.error?.fieldErrors?.categoryId} />	
      </>
   );
}


const Edit = (props) => {
   const {tldrId, tldr} = props;

   const urlKeyRef = useRef();

   const dispatch = useDispatch(); 
   const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

   const categories = useSWR(  getCategoriesUrl({'$limit': 1000})  );
   const {data: categoriesData} = categories.data ? parsePageObj( categories ) : {data: []};
   
   const [formStep, setFormStep] = useState(0);

   const formState = useFormState({
      initialFields: {
         verb: '',
         noun: '',
         urlKey: '',
         categoryId: null,
         ...tldr
      },
      toastableErrors: {
         BadRequest: 'Something went wrong',
         NotAuthenticated: 'Not signed in'
      },
      addToast: msg => dispatch(addToast(msg))
   }); 

   const submitForm = async () => {
      const error = runValidations(formState.fields, editValidations);
		formState.setError(error);
      if(!error){
         formState.setLoading(true);
         try{
            // PATCH or POST
            if(tldrId != undefined){
               const tldr = await request( getTldrUrl(tldrId), {
                  method: 'PATCH', 
                  data: formState.fields,
                  token: authentication.accessToken
               });
               const toastMessage = "Settings updated!";
               dispatch(addDelayedToast(toastMessage));
               Router.push({pathname: getTldrPageUrl(), query: {tldrId: tldr.id}})  
            }
            else{
               const tldr = await request( getTldrUrl(), {
                  method: 'POST', 
                  data: formState.fields,
                  token: authentication.accessToken
               });
               const toastMessage = "Great, now you can write the first version of your card";
               dispatch(addDelayedToast(toastMessage));
               Router.push({pathname: getVersionEditPageUrl(), query: {tldrId: tldr.id}})   
            }
         }
         catch(error){
            console.log(error);
            formState.setError(error);
            formState.setLoading(false);
         }
      }
   }

   if( tldrId != undefined ){
      return (
         <Page>
            <TldrHeader />
            <Stripe>
               <Bounds style={{maxWidth: 640}}>
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
                              onPress={ submitForm }
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
   else{
      return (
         <Page>
            <TldrHeader />
            <Stripe>
               <Bounds style={{maxWidth: 640}}>
                  <Section>
                     <Chunk>
                        <Text type="pageHead">Create new card</Text>
                     </Chunk>
                  </Section>
                  <Section>
                     <form>
                        
                     <RevealBlock visible={formStep >= 0} delay={300}>
                     <Chunk>
                        <Label for="title">What is your card about?</Label>
                        <TextInput
                           id="verb"
                           placeholder="verb (ex. baking, choosing, visiting)"
                           value={formState.getFieldValue('verb')}
                           onChange={e => {
                              const value = e.target.value;
                              const urlKey = buildUrlKey([value, formState.getFieldValue('noun')]);
                              formState.setFieldValues({
                                 'verb': value,
                                 'urlKey': urlKey
                              });
                           }}
                           />

                        <TextInput
                           id="verb"
                           placeholder="noun (ex. bread, a major, Tokyo)"
                           value={formState.getFieldValue('noun')}
                           onChange={e => {
                              const value = e.target.value;
                              const urlKey = buildUrlKey([formState.getFieldValue('verb'), value]);
                              formState.setFieldValues({
                                 'noun': value,
                                 'urlKey': urlKey
                              });
                           }}
                           />
                        <FieldError error={formState.error?.fieldErrors?.verb} />	
                        <FieldError error={formState.error?.fieldErrors?.noun} />	
                     </Chunk>

                     { (formStep == 0) && 
                        <Chunk>
                           <Button 
                              onPress={ () => {
                                 const error = runValidations(formState.fields, {
                                    verb: {
                                       notEmpty: {
                                          msg: "Verb can't be blank"
                                       },
                                    },
                                    noun: {
                                       notEmpty: {
                                          msg: "Noun can't be blank"
                                       },
                                    }
                                 });
                                 formState.setError(error);
                                 if(!error){
                                    const urlKey = buildUrlKey([formState.getFieldValue('verb'), formState.getFieldValue('noun')]);
                                    formState.setFieldValue('urlKey', urlKey);
                                    setFormStep(1);
                                 }
                              }}
                              label="Next"
                              />
                        </Chunk>
                     }
                     </RevealBlock>

                     <RevealBlock visible={formStep >= 1} delay={150}>
                        <Chunk>
                           <Label for="title">How's this as a URL for your card?</Label>
                           <UrlKeyField formState={formState} user={user} />
                        </Chunk>
                        { (formStep == 1) && 
                           <Chunk>
                              <Button 
                                 onPress={ () => {
                                    const error = runValidations(formState.fields, {
                                       urlKey: editValidations.urlKey
                                    });
                                    formState.setError(error);
                                    if(!error){
                                       setFormStep(2);
                                    }
                                 }}
                                 label="Looks good"
                                 />
                           </Chunk>
                        }
                     </RevealBlock> 
                     
                     <RevealBlock visible={formStep >= 2} delay={150}>
                        <Chunk>
                           <Label for="title">What category fits the best?</Label>
                           <CategoryField formState={formState} categoriesData={categoriesData} />
                        </Chunk>
                        { (formStep == 2) && 
                           <Chunk>
                              <Button 
                                 label="Create new card"
                                 onPress={ submitForm }
                                 isLoading={formState.loading}
                                 />
                           </Chunk>
                        }
                     </RevealBlock> 
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
	const {store, req, pathname, query} = context;
   const isServer = !!req;	
   const categoryId = query.categoryId;
   const tldrId = query.tldrId;
   const tldr = (tldrId != undefined) ? await request( getTldrUrl(tldrId) ) : undefined;

	return {
      categoryId,
		isServer,
      tldrId,
      tldr
	}
}


export default Edit;



