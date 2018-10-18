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
    	onRequestClose: ()=>{ console.log('onRequestClose not implemented') },
    	onCompleteClose: ()=>{ },
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
			if(event.keyCode === 27 && this.props.dismissable) {
				this.props.onRequestClose();
			}
			else if(event.keyCode === 13){
				this.props.onPressEnter();
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
			onCompleteClose,
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


/*

prompt notes

api for showing / dismissing prompts

const promptId = showPrompt(content);
hidePrompt(promptId);


*/




class PromptManager extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			prompts: []
		}
	}

	showPrompt(content){
		console.log('show');
		const id = uuid();
		const prompts = [...this.state.prompts];
		prompts.push({
			id: id,
			content: content,
			showable: true
		});
		this.setState({ prompts: prompts })
		return id;
	}

	hidePrompt(id){
		const prompts = [...this.state.prompts];
		const index = prompts.findIndex(prompt => prompt.id == id);
		prompts[index].showable = false;
		this.setState({ prompts: prompts })
	}

	deletePrompt(id){
		const prompts = [...this.state.prompts];
		const index = prompts.findIndex(prompt => prompt.id == id);
		prompts.splice(index, 1);
		this.setState({ prompts: prompts })
	}

	render(){
		const {
			children
		} = this.props;
		const thisPrompt = this.state.prompts[0];
		return(
			<View>
				<Text>ok</Text>
				{ thisPrompt &&
					<Prompt
						visible={thisPrompt.showable}
						onRequestClose={()=>{
							this.hidePrompt(thisPrompt.id)
						}}
						onCompleteClose={()=>{
							this.deletePrompt(thisPrompt.id)
						}}
						>
						{thisPrompt.content}
					</Prompt>
				}
			</View>
		)
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
												const id = this.promptManager.showPrompt(
													<Text>YEAH CONTENT</Text>
												);
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

				<PromptManager
					ref={ref => {this.promptManager = ref}}
					/>
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