import React from 'react';
import { Animated, Easing, Touchable, View } from '../primitives';
import { ScrollView } from 'react-native-web';
import styles from '../styles/styles';
import swatches from '../styles/swatches';
import Card from './Card';
import Chunk from './Chunk';
import Stripe from './Stripe';
import Touch from './Touch';
import Icon from './Icon';
import Section from './Section';
import { METRICS, EASE } from '../designConstants';

/*

know that there is an input bug in ios versions < 11.3
fixed positioning gets weird

*/


class Prompt extends React.Component{

	static defaultProps = {
    	onPressEnter: ()=>{},
    	onRequestClose: ()=>{},
    	onCompleteClose: ()=>{},
    	dismissable: true,
    	visible: false
  	}

	constructor(props) {
		super(props);
		this.state = {
			display: 'none',
			visibilityValue: new Animated.Value(0)
		}
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onRequestClose = this.onRequestClose.bind(this);
		this.onCompleteClose = this.onCompleteClose.bind(this);
	}

	componentDidMount(){
		document.addEventListener("keydown", this.onKeyPress, false);
		if(this.props.showable){
			setTimeout(()=>{
				this.open();
			}, 1);
		}
	}
	componentWillUnmount(){
		document.removeEventListener("keydown", this.onKeyPress, false);
	}

	onKeyPress(event){
		if(this.props.showable){
			if(event.keyCode === 27 && this.props.dismissable) {
				this.props.onRequestClose();
			}
			else if(event.keyCode === 13){
				this.props.onPressEnter();
			}
		}
	}

	componentDidUpdate(prevProps){
		if(this.props.showable != prevProps.showable){
			if(this.props.showable){
				this.open();
			}
			else{
				this.close();
			}
		}
	}

	onRequestClose(){
		this.props.hidePrompt(this.props.id);
		this.props.onRequestClose();
	}

	onCompleteClose(){
		this.props.removePrompt(this.props.id)
		this.props.onCompleteClose();
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
			this.onCompleteClose();
		});
	}


	render() {
		const {
			dismissable,
			content,
			...other
		} = this.props;

		const promptStyle = styles['prompt'];
		const promptContent = React.cloneElement(content, {
			onRequestClose: this.onRequestClose,
			onCompleteClose: this.onCompleteClose
		});

		return(
			<Animated.View style={[
				styles['modal-container'],
				{
					display: this.state.display,
					opacity: this.state.visibilityValue
				}
			]}>

				<Touch
					onPress={(dismissable) ? this.onRequestClose : ()=>{} }
					noFeedback
					>
						<View style={[ styles['modal-backdrop'] ]} />
				</Touch>
				<Animated.View style={[
					promptStyle,
					{
						transform: [{
					      translateY: this.state.visibilityValue.interpolate({
					        inputRange: [0, 1],
					        outputRange: [150, 0]
					      }),
					    }]
					}
				]}>
					<Stripe>
						{promptContent}
					</Stripe>
				</Animated.View>
			</Animated.View>
		);
	}
}


class Prompter extends React.Component {

	render() {
		const {
			children,
			prompts,
			...other
		} = this.props;
		const thisPrompt = this.props.prompts[0];
		if(thisPrompt){
			return(
				<Prompt
					showable={thisPrompt.showable}
					{...thisPrompt}
					{...other}
					/>
			);
		}
		else{
			return false;
		}
	}

}



export default Prompter;