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
import { WithMatchMedia } from './WithMatchMedia';
import { METRICS, EASE } from '../designConstants';

/*

know that there is an input bug in ios versions < 11.3
fixed positioning gets weird

*/



class Modal extends React.Component{

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
		const duration = 250;
		if(nextProps.visible){
			this.setState({display: 'flex'})
			Animated.timing(
				this.state.visibilityValue,{
					toValue: 1,
					easing: EASE,
					duration
				}
			).start();
		}
		else{
			Animated.timing(
				this.state.visibilityValue,{
					toValue: 0,
					easing: EASE,
					duration
				}
			).start(()=>{
				this.setState({display: 'none'});
			});
		}
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
				{ !isFull &&
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
					{/*
					<View style={{
						paddingHorizontal: METRICS.spaceSection,
						paddingTop: METRICS.spaceSection,
						paddingBottom: METRICS.space
					}}>
						<Touch
							onPress={onRequestClose}
							style={{position: 'relative', left: -7}}
							>
							<Icon
								shape='X'
								color="gray"
								size="large"
								/>
						</Touch>
					</View>
					*/}
					<Header>
						<Touch
							onPress={onRequestClose}
							style={{position: 'relative', left: -2}}
							>
							<Icon
								shape='X'
								color="gray"
								size="medium"
								/>
						</Touch>
					</Header>
					<ScrollView>
						{children}
					</ScrollView>
				</Animated.View>
			</Animated.View>
		);

	}
}

export default WithMatchMedia(Modal);