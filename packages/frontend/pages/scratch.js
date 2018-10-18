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
	Prompt,
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


/*
import { Transition, animated } from 'react-spring';
const AnimatedView = animated(View)
*/

import { Animated, Easing, Touchable, View } from '../components/cinderblock/primitives';
import { METRICS, EASE } from '../components/cinderblock/designConstants';






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
			<Fragment>
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
			</Fragment>
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

	_renderDeletePrompt(thing){
		return(
			<Chunk>
			<Text>some garbage</Text>
			<Button
				onPress={()=>{
					const things = [...this.state.things];
					const index = things.findIndex(item => item.id == thing.id);
					if(index >= 0){
						things.splice(index, 1);
						this.setState({things: things});
					}
				}}
				label="Yes I'm sure"
				/>
			</Chunk>
		);
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


								  {things.map(thing => (
								  		<Chunk>
									  		<Text>{thing.message} {thing.id}</Text>
									  		<Link  onPress={()=>{
												this.promptManager.showPrompt( this._renderDeletePrompt(thing) );
									  		}}>
									  			<Text color="tint">Delete</Text>
									  		</Link>
									  	</Chunk>


								  ))}

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



/*
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
				this.promptManager.showPrompt( this._renderDeletePrompt(thing) );
	  		}}>
	  			<Text color="tint">Delete</Text>
	  		</Link>
	  	</Chunk>
  	</AnimatedView>
  ))}
</Transition>
*/