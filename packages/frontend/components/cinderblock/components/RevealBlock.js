import React, {Fragment, useState, useEffect, useCallback } from 'react';
import { Animated } from '@/components/cinderblock/primitives';
import {METRICS, EASE} from '@/components/cinderblock/designConstants';


const RevealBlock = (props) => {

   const { 
      delay = 0, 
      duration = 250,
      offset = 100,
      fromTop = false,
      style
   } = props;
   const [blockValue, setBlockValue] = useState('none');
   const [visibilityValue, setVisibilityValue] = useState(new Animated.Value(0));
   const directionMultiplier = (fromTop) ? -1 : 1;

   useEffect(()=>{
      if(props.visible){
         setBlockValue('flex');
         Animated.timing(
            visibilityValue,{
               toValue: 1,
               easing: EASE,
               duration,
               delay
            }
         ).start()
      }
      else{
         Animated.timing(
            visibilityValue,{
               toValue: 0,
               easing: EASE,
               duration,
               delay
            }
         ).start(()=>{
            setBlockValue('none');
         })
      }
   }, [props.visible]);

   return(
      <Animated.View
         style={[{
            display: blockValue,
            opacity: visibilityValue,
            transform: [{
               translateY: visibilityValue.interpolate({
               inputRange: [0, 1],
               outputRange: [(offset * directionMultiplier), 0]
               }),
            }]
         }, style]}
         >
         {props.children}
      </Animated.View>
   );
   

}

export default RevealBlock;