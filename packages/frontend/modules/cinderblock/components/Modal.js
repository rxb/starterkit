import React from 'react';
import { Animated, Easing, Touchable, View } from '../primitives';
import { ScrollView } from 'react-native-web';
import styles from '../styles/styles';
import swatches from '../styles/swatches';
import Card from './Card';
import Flex from './Flex';
import FlexItem from './FlexItem';
import Chunk from './Chunk';
import Touch from './Touch';
import Icon from './Icon';
import Header from './Header';
import Section from './Section';
import Stripe from './Stripe';
import { MediaContext } from './UseMediaContext';
import { METRICS, EASE } from '../designConstants';

import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

/*

know that there is an input bug in ios versions < 11.3
fixed positioning gets weird

*/



/*

/////////////////////////
potential redux version

// state shape
modals: [
	{id: id, content: content, status: showing / hiding }
]

const id = id;
dispatch(showModal(id, content));
// mounts modal hidden then triggers animation to reveal

dispatch(hideModal(id));
// animates hiding, then triggers

dispatch(removeModal(id));


/////////////////////////
alternate way is to have a skeleton modal just hanging out and waiting to be popped

*/


class Modal extends React.Component{

	static contextType = MediaContext;

	// for body locking
	targetRef = React.createRef();
  	targetElement = null;

	static defaultProps = {
    	onPressEnter: ()=>{},
    	onRequestClose: ()=>{ console.log('onRequestClose not implemented') },
    	onCompleteClose: ()=>{ },
    	visible: false
  	}

	constructor(props) {
		super(props);
		this.state = {
			display: 'none',
			visibilityValue: new Animated.Value(0)
		}
		this.onKeyPress = this.onKeyPress.bind(this);

	}

	componentDidMount(){

		// if there are problems in ios with body locking
		// it's probably because of this https://github.com/willmcpo/body-scroll-lock/issues/102#issuecomment-482599456
		this.targetElement = this.targetRef.current;

		document.addEventListener("keydown", this.onKeyPress, false);
		if(this.props.visible){
			setTimeout(()=>{
				this.open();
			}, 1);
		}
	}
	componentWillUnmount(){
		document.removeEventListener("keydown", this.onKeyPress, false);
		clearAllBodyScrollLocks();
	}

	onKeyPress(event){
		if(this.props.visible){
			if(event.keyCode === 27) {
				event.preventDefault();
				this.props.onRequestClose();
			}
		}
	}

	/*
	UNSAFE_componentWillReceiveProps(nextProps){
		if(nextProps.visible){
			this.open();
		}
		else{
			this.close();
		}
	}
	*/
	componentDidUpdate(prevProps){
		if(this.props.visible != prevProps.visible){
			if(this.props.visible){
				this.open();
			}
			else{
				this.close();
			}
		}
	}

	open(){		
		disableBodyScroll(this.targetElement);
		const duration = 250;
		this.setState({display: 'flex'})
		Animated.timing(
			this.state.visibilityValue,{
				toValue: 1,
				easing: EASE,
				duration
			}
		).start();
	}

	close(){
		enableBodyScroll(this.targetElement);
		const duration = 250;
		Animated.timing(
			this.state.visibilityValue,{
				toValue: 0,
				easing: EASE,
				duration
			}
		).start(()=>{
			this.setState({display: 'none'});
			this.props.onCompleteClose();
		});
	}


	render() {

		const {
			children,
			onRequestClose,
			visible,
			...other
		} = this.props;

		const media = this.context;

		const isFull = !media['medium'];
		const modalStyle = (isFull) ? styles['modal--full'] : styles['modal'];

		return(
			<Animated.View style={[
				styles['modal-container'],
				{
					display: this.state.display,
					opacity: this.state.visibilityValue
				}
			]}>
				{ (true || !isFull) &&
					<Touch
						onPress={onRequestClose}
						noFeedback
						>
							<View style={[ styles['modal-backdrop'] ]} />
					</Touch>
				}
				<Animated.View style={[
					modalStyle,
					{
						transform: [{
					      translateY: this.state.visibilityValue.interpolate({
					        inputRange: [0, 1],
					        outputRange: [180, 0]
					      }),
					    }]
					}
				]}>
					{/*
					<Stripe style={{borderBottomWidth: 1, borderBottomColor: swatches.border}}>
						<Section style={{ paddingVertical: 0}}>
							<Flex>
								<FlexItem shrink>
									<Touch
										onPress={onRequestClose}
										style={{backgroundColor: 'lightgray', borderRadius: 32}}
										>
										<View>
										<Icon
											shape='X'
											color="white"
											size="medium"
											/>
										</View>
									</Touch>
								</FlexItem>
							</Flex>
						</Section>
					</Stripe>
					*/}

					<View style={{position: 'absolute', top: 0, right: 0, padding: METRICS.base, zIndex: 5}}>
						<Touch
							onPress={onRequestClose}
							style={{backgroundColor: swatches.shade, borderRadius: 32, padding: 4}}
							>
							<View>
							<Icon
								shape='X'
								color={swatches.textHint}
								size="medium"
								/>
							</View>
						</Touch>
					</View>

					{/* scrollview is blocking the rest */}

					<ScrollView 
						style={{/*backgroundColor: 'green'*/}} 
						ref={this.targetRef}
						>
						{children}
					</ScrollView>
				</Animated.View>
			</Animated.View>
		);

	}
}

export default Modal;