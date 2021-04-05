// REORDERABLE
// this only works on web, at the moment
// it would need a new react-dnd "backend" for react native
// people have talked about making one in the issues so see if one exists before trying to make your own
// https://github.com/Nedomas/react-dnd-react-native-backend
/*

// EXAMPLE USE

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend' 

const moveItem = useCallback((dragIndex, hoverIndex) => {
   const dragItem = items[dragIndex];
   const newItems = [...items];
   newItems.splice(dragIndex, 1);
   newItems.splice(hoverIndex, 0, dragItem);
   setItems(newItems);
}, [items]);

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

*/

import React, {Fragment, useState, useCallback, useRef} from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemTypes = {
   REORDERABLE: 'reorderable',
}

const Reorderable = ({ id, children, index, moveItem }) => {
   const ref = useRef(null);
   const [, drop] = useDrop({
       accept: ItemTypes.REORDERABLE,
       hover(item, monitor) {
           if (!ref.current) {
               return;
           }
           const dragIndex = item.index;
           const hoverIndex = index;
           // Don't replace items with themselves
           if (dragIndex === hoverIndex) {
               return;
           }
           // Determine rectangle on screen
           const hoverBoundingRect = ref.current?.getBoundingClientRect();
           // Get vertical middle
           const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
           // Determine mouse position
           const clientOffset = monitor.getClientOffset();
           // Get pixels to the top
           const hoverClientY = clientOffset.y - hoverBoundingRect.top;
           // Only perform the move when the mouse has crossed half of the items height
           // When dragging downwards, only move when the cursor is below 50%
           // When dragging upwards, only move when the cursor is above 50%
           // Dragging downwards
           if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
               return;
           }
           // Dragging upwards
           if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
               return;
           }
           // Time to actually perform the action
           moveItem(dragIndex, hoverIndex);
           // Note: we're mutating the monitor item here!
           // Generally it's better to avoid mutations,
           // but it's good here for the sake of performance
           // to avoid expensive index searches.
           item.index = hoverIndex;
       },
   });

   const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.REORDERABLE,
      item: { id, index },
      collect: (monitor) => ({
          isDragging: monitor.isDragging(),
      }),
   });

   const opacity = isDragging ? 0 : 1;
   drag(drop(ref));
   return (<div ref={ref} style={{opacity}}>
      {children} 
   </div>);
};

export default Reorderable;