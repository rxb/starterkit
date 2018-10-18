import React, {Fragment} from 'react';
import { withFormik } from 'formik';
import { connect } from 'react-redux';
import Head from 'next/head'
import uuid from 'uuid/v1';

import {
	fetchShow,
	createShowComment,
	deleteShowComment,
	fetchShowComments
} from '../actions';


import {
	Avatar,
	Bounds,
	Button,
	Card,
	CheckBox,
	Chunk,
	Flex,
	FlexItem,
	Icon,
	Inline,
	Image,
	Label,
	List,
	Link,
	Modal,
	Picker,
	Section,
	Sections,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch
} from '../components/cinderblock';


import styles from '../components/cinderblock/styles/styles';
import Page from '../components/Page';


//import { View } from '../components/cinderblock/primitives';
import { Transition, animated } from 'react-spring';
const AnimatedView = animated(View)


import { Animated, Easing, Touchable, View } from '../components/cinderblock/primitives';
import { METRICS, EASE } from '../components/cinderblock/designConstants';
class Prompt extends React.Component{

	static defaultProps = {
    	onPressEnter: ()=>{},
    	dismissable: true
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
	}
	componentWillUnmount(){
		document.removeEventListener("keydown", this.onKeyPress, false);
	}

	onKeyPress(event){
		if(this.props.visible){
			if(event.keyCode === 27 && this.props.dismissable) {
				this.props.onRequestClose();
			}
			else if(event.keyCode === 13){
				this.props.onPressEnter();
			}
		}
	}

	componentWillReceiveProps(nextProps){
		const duration = 250;
		if(nextProps.visible){
			// open
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
			// close
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
			onClose,
			media,
			dismissable,
			visible,
			...other
		} = this.props;

		const promptStyle = styles['prompt'];


		return(
			<Animated.View style={[
				styles['modal-container'],
				{
					display: this.state.display,
					opacity: this.state.visibilityValue
				}
			]}>

				<Touch
					onPress={(dismissable) ? onRequestClose : ()=>{} }
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
						{children}
					</Stripe>
				</Animated.View>
			</Animated.View>
		);
	}
}



class Scratch extends React.Component {

	static async getInitialProps (context) {
		return {};
	}

	constructor(props){
		super(props);
		this.state = {
			things: [],
			showPrompt: false
		}
	}

	render() {

		const {
			user
		} = this.props;
		const {
			things
		} = this.state;

		return (
			<Page>
				<Head>
					<meta property='og:title' content='Scratch' />
					<title>Scratch</title>
				</Head>
				<Stripe>
					<Bounds>
						<Sections>
							<Section>
								<Chunk>
									<Text type="pageHead">Scratch</Text>
								</Chunk>

								<Transition native
								  keys={things.map((thing) => thing.id)}
								  from={{ opacity: 0, height: 0 }}
								  enter={{ opacity: 1, height: 'auto' }}
								  leave={{ opacity: 0, height: 0 }}>
								  {things.map(thing => styles => (
								  	<AnimatedView style={{...styles}}>
								  		<Chunk>
									  		<Text>{thing.message} {thing.id}</Text>
									  		<Link  onPress={()=>{
									  			/*
									  			var r = confirm("Are you sure?");
												if (r == true) {
												   	const things = this.state.things.filter( item => item.id != thing.id);
													this.setState({things: things});
												}
												*/
												this.setState({showPrompt: true})
									  		}}>
									  			<Text color="tint">Delete</Text>
									  		</Link>
									  	</Chunk>
								  	</AnimatedView>
								  ))}
								</Transition>

								<Button
									label="add thing"
									onPress={()=>{
										const things = [...this.state.things];
										things.push({message: 'ok new thing', id: uuid()});
										this.setState({things: things});
									}}
									/>

							</Section>
						</Sections>
					</Bounds>
				</Stripe>

					<Prompt visible={this.state.showPrompt} onRequestClose={()=>{
						this.setState({showPrompt: false});
					}}>
						<Text>Hello I am prompt</Text>
					</Prompt>

			</Page>
		);
	}
}


const mapStateToProps = (state, ownProps) => {
	return ({
		user: state.user
	});
}

const actionCreators = {
};

export default connect(
	mapStateToProps,
	actionCreators
)(Scratch);