import React from 'react';
import { Animated, Easing, Touchable, View } from '../primitives';
import { ScrollView } from 'react-native-web';
import styles from '../styles/styles';
import swatches from '../styles/swatches';
import Card from './Card';
import Chunk from './Chunk';
import Touch from './Touch';
import Icon from './Icon';
import Header from './Header';
import Section from './Section';
import Stripe from './Stripe';
import { WithMatchMedia } from './WithMatchMedia';
import { METRICS, EASE } from '../designConstants';

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
		document.addEventListener("keydown", this.onKeyPress, false);
		if(this.props.visible){
			setTimeout(()=>{
				this.open();
			}, 1);
		}
	}
	componentWillUnmount(){
		document.removeEventListener("keydown", this.onKeyPress, false);
	}

	onKeyPress(event){
		if(this.props.visible){
			if(event.keyCode === 27) {
				event.preventDefault();
				this.props.onRequestClose();
			}
		}
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.visible){
			this.open();
		}
		else{
			this.close();
		}
	}

	open(){
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
			media,
			visible,
			...other
		} = this.props;

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
					        outputRange: [150, 0]
					      }),
					    }]
					}
				]}>
					<Stripe style={{paddingBottom: 0}}>
						<Section style={{ paddingBottom: 0}}>
							<Touch
								onPress={onRequestClose}
								style={{position: 'relative', left: -5}}
								>
								<Icon
									shape='X'
									color="gray"
									size="large"
									/>
							</Touch>
						</Section>
					</Stripe>
					<ScrollView>
						{children}
					</ScrollView>
				</Animated.View>
			</Animated.View>
		);

	}
}

export default WithMatchMedia(Modal);