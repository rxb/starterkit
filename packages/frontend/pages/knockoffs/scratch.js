import React, {Fragment, useState, useCallback, useRef} from 'react';

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
} from 'cinderblock';

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'



const Scratch = (props) => {

   const [items, setItems] = useState([
      {
          id: 1,
          text: 'Write a cool JS library',
      },
      {
          id: 2,
          text: 'Make it generic enough',
      },
      {
          id: 3,
          text: 'Write README',
      },
      {
          id: 4,
          text: 'Create some examples',
      },
      {
          id: 5,
          text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
      },
      {
          id: 6,
          text: '???',
      },
      {
          id: 7,
          text: 'PROFIT',
      },
  ]);


   const moveItem = useCallback((dragIndex, hoverIndex) => {
      const dragItem = items[dragIndex];
      const newItems = [...items];
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, dragItem);
      setItems(newItems);
   }, [items]);


   return (
         
         <Stripe>
            {/*
            <Bounds>
               <Section>
                  <Chunk>
                     <Text type="sectionHead">Drag and drop test</Text>
                  </Chunk>
                  <DndProvider backend={HTML5Backend}>
                     {items.map((item, i) => (
                        <Reorderable key={item.id} index={i} id={item.id} moveItem={moveItem}>
                           <Card>
                              <Sectionless>
                                 <Chunk>
                                 <Text>{item.text}</Text>
                                 </Chunk>
                              </Sectionless>
                           </Card>
                        </Reorderable>
                     ))}
                  </DndProvider>
               </Section>
            </Bounds>
                     */}
         </Stripe>
   );
}

export default Scratch;