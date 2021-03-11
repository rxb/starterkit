import React, {Fragment, useState, useEffect, useCallback, useRef } from 'react';
import { Animated } from '@/components/cinderblock/primitives';

import {
	fetcher,
	patchTldr,
	useTldr
} from '@/swr';

import {connect, useDispatch, useSelector} from 'react-redux';
import { addPrompt, addToast, addDelayedToast } from '@/actions';

import Router from 'next/router'
import Head from 'next/head'

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
import styles from '@/components/cinderblock/styles/styles';
import swatches from '@/components/cinderblock/styles/swatches';
import {METRICS, EASE} from '@/components/cinderblock/designConstants';


import Page from '@/components/Page';
import TldrHeader from '@/components/TldrHeader';
import {CATEGORIES} from './components';


import { authentication } from '@feathersjs/client';

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

const Edit = (props) => {
   const urlKeyRef = useRef();

   const dispatch = useDispatch(); 
   const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

   const [formStep, setFormStep] = useState(0);

   const formState = useFormState({
		initialFields: {
		},
		toastableErrors: {
			BadRequest: 'Something went wrong',
			NotAuthenticated: 'Not signed in'
		},
		addToast: msg => dispatch(addToast(msg))
	})

   const submitForm = () => {

   }

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
                     <FieldError error={formState.errors?.fieldErrors?.title} />	
                  </Chunk>

                  { (formStep == 0) && 
                     <Chunk>
                        <Button 
                           onPress={ () => {
                              const urlKey = buildUrlKey([formState.getFieldValue('verb'), formState.getFieldValue('noun')]);
                              formState.setFieldValue('urlKey', urlKey);
                              setFormStep(1);
                           }}
                           label="Next"
                           />
                     </Chunk>
                  }
                  </RevealBlock>

                   <RevealBlock visible={formStep >= 1} delay={150}>
                     <Chunk>
                        <Label for="title">How's this as a link for your card?</Label>
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
                        <FieldError error={formState.errors?.fieldErrors?.urlKey} />	
                     </Chunk>
                     { (formStep == 1) && 
                        <Chunk>
                           <Button 
                              onPress={ () => {
                                 setFormStep(2);
                              }}
                              label="Looks good"
                              />
                        </Chunk>
                     }
                  </RevealBlock> 
                  
                  <RevealBlock visible={formStep >= 2} delay={150}>
                     <Chunk>
                        <Label for="title">Category</Label>
                        {CATEGORIES.map((category, i)=>{
                           const selected = category.urlKey == formState.getFieldValue('category');
                           return (
                              <Touch onPress={()=>{
                                 formState.setFieldValue('category', category.urlKey)
                              }}>
                                 <View style={[
                                    styles.input,
                                    (selected) 
                                       ? { backgroundColor:  'blue'} 
                                       : { }
                                 ]}>
                                    <Text inverted={selected}>{category.name}</Text>
                                 </View>
                              </Touch>
                           )
                        })}
                        {/*
                        <Picker
                           id="tags"
                           value={formState.getFieldValue('tags')}
                           onChange={e => formState.setFieldValue('tags', e.target.value) }
                           >
                           { CATEGORIES.map((category, i)=>(
                              <Picker.Item value={category.urlKey} label={category.name} />
                           ))}
                        </Picker>
                        */}
                        <FieldError error={formState.errors?.fieldErrors?.tags} />	
                     </Chunk>
                     { (formStep == 2) && 
                        <Chunk>
                           <Button 
                              label="Create"
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

export default Edit;



