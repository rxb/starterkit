import React, {Fragment, useState, useCallback} from 'react';

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
import {METRICS} from '@/components/cinderblock/designConstants';


import Page from '@/components/Page';
import TldrHeader from '@/components/TldrHeader';

import { authentication } from '@feathersjs/client';


const Edit = (props) => {
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
            <Bounds>
               <Section>
                  <Chunk>
                     <Text type="pageHead">Create new card</Text>
                  </Chunk>
               </Section>
               <Section>
                  <form>

                     {/*
                     <Chunk>
                        <Label for="title">Card name</Label>
                        <TextInput
                           id="title"
                           placeholder="ex. short-and-sweet"
                           value={formState.getFieldValue('title')}
                           onChange={e => {
                              const value = e.target.value;
                              formState.setFieldValues({
                                 'title': value,
                                 'urlKey': value.replace(/[^A-Za-z0-9-\s]+/gi, "").replace(/\s+/gi,"-").toLowerCase()
                              });
                           }}
                           />
                           { !formState.getFieldValue('urlKey') && 
                              <Text type="small" color="hint">This is like a username for your new card</Text>
                           }
                           { formState.getFieldValue('urlKey') && 
                              <Text type="small" color="hint">@{user.urlKey} / {formState.getFieldValue('urlKey')}</Text>
                           }  
                        <FieldError error={formState.errors?.fieldErrors?.title} />	
                     </Chunk>
                     */}
                     

                     <Chunk>
                        <Label for="title">What is your card about?</Label>
                        <TextInput
                           id="verb"
                           placeholder="verb-ing"
                           value={formState.getFieldValue('title')}
                           onChange={e => {
                              const value = e.target.value;
                              formState.setFieldValues({
                                 'title': value,
                              });
                           }}
                           />
                        <TextInput
                           id="noun"
                           placeholder="noun"
                           value={formState.getFieldValue('title')}
                           onChange={e => {
                              const value = e.target.value;
                              formState.setFieldValues({
                                 'title': value,
                              });
                           }}
                           />
                        <FieldError error={formState.errors?.fieldErrors?.title} />	
                     </Chunk>

                   
                     <Chunk>
                        <Label for="title">Url</Label>
                        <Flex flush>
                           <FlexItem flush shrink justify="center" >
                              <FakeInput label={`${user.urlKey}/`} style={{borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 0}} />
                           </FlexItem>
                           <FlexItem flush>
                              <TextInput
                              style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
                              id="urlKey"
                              value={formState.getFieldValue('urlKey')}
                              onChange={e => formState.setFieldValue('urlKey', e.target.value) }
                              />
                           </FlexItem>
                        </Flex>
                        <FieldError error={formState.errors?.fieldErrors?.urlKey} />	
                     </Chunk>

                     <Chunk>
                        <Label for="title">Category</Label>
                        <Picker
                           id="tags"
                           value={formState.getFieldValue('tags')}
                           onChange={e => formState.setFieldValue('tags', e.target.value) }
                           >
                           <Picker.Item value="1" label="Whatever" />
                        </Picker>
                        <FieldError error={formState.errors?.fieldErrors?.tags} />	
                     </Chunk>
                     <Chunk>
                        <Button 
                           label="Create"
                           />
                     </Chunk>
                  </form>
               </Section>
            </Bounds>
         </Stripe>
      </Page>
   )
}

export default Edit;