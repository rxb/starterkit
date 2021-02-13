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
import { authentication } from '@feathersjs/client';


const Edit = (props) => {
   const dispatch = useDispatch(); 
   const authentication = useSelector(state => state.authentication);
	const user = authentication.user || {};

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
         <Stripe>
            <Bounds>
               <Section>
                  <Chunk>
                     <Text type="pageHead">Create new card</Text>
                  </Chunk>
                  <form>
                     <Chunk>
                        <Label for="title">Title</Label>
                        <TextInput
                           id="title"
                           value={formState.getFieldValue('title')}
                           onChange={e => formState.setFieldValue('title', e.target.value) }
                           />
                        <FieldError error={formState.errors?.fieldErrors?.title} />	
                     </Chunk>
                     <Chunk>
                        <Label for="title">Url</Label>
                        <Flex flush>
                           <FlexItem flush shrink justify="center" >
                              <FakeInput label="rxb/" style={{borderTopRightRadius: 0, borderBottomRightRadius: 0}} />
                           </FlexItem>
                           <FlexItem flush>
                              <TextInput
                              style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
                              id="title"
                              value={formState.getFieldValue('title')}
                              onChange={e => formState.setFieldValue('title', e.target.value) }
                              />
                           </FlexItem>
                        </Flex>
                        <FieldError error={formState.errors?.fieldErrors?.title} />	
                     </Chunk>
                     <Chunk>
                        <Label for="title">Tags</Label>
                        <TextInput
                           id="title"
                           value={formState.getFieldValue('title')}
                           onChange={e => formState.setFieldValue('title', e.target.value) }
                           />
                        <FieldError error={formState.errors?.fieldErrors?.title} />	
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