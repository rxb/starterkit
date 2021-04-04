import React, {Fragment, useState, useEffect, useCallback, useRef } from 'react';
import { Animated, Text, View } from 'modules/cinderblock/primitives';
import {METRICS, EASE} from 'modules/cinderblock/designConstants';


const RevealBlock = (props) => {

   const { 
      delay = 0, 
      duration = 2000,
      offset = 100,
      fromTop = false,
      visible = false,
      style
   } = props;
   const [blockValue, setBlockValue] = useState('none');
   const visibilityValue = useRef(new Animated.Value(0)).current;
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
   }, [visible]);

   return(
      <>
      <Text>{JSON.stringify(visible)} - {JSON.stringify(visibilityValue)}</Text>
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
         }, style]}>
            {props.children}
      </Animated.View>
      </>
   );
   

}

export default RevealBlock;