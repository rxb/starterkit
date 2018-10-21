import React, {Fragment} from 'react';
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
		if(thisPrompt){
			const onRequestClose = () => { this.hidePrompt(thisPrompt.id) };
			const promptContent = React.cloneElement(thisPrompt.content, {onRequestClose});
			return(
				<Prompt
					visible={thisPrompt.showable}
					onRequestClose={onRequestClose}
					onCompleteClose={()=>{
						this.deletePrompt(thisPrompt.id)
					}}
					>
					{promptContent}
				</Prompt>
			);
		}
		else{
			return false;
		}


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

		const DeletePrompt = (props) => {
			const {
				thing,
				onRequestClose
			} = props;
			return (
				<Sectionless>
					<Chunk>
						<Text type="sectionHead">Are you sure?</Text>
					</Chunk>
					<Chunk>
						<Text>Deleting your comment {thing.id}</Text>
					</Chunk>
					<Chunk>
						<Button
							onPress={()=>{
								const things = [...this.state.things];
								const index = things.findIndex(item => item.id == thing.id);
								if(index >= 0){
									things.splice(index, 1);
									this.setState({things: things});
								}
								onRequestClose();
							}}
							label="Yes I'm sure"
							width="full"
							/>
						<Button
							onPress={()=>{
								onRequestClose();
							}}
							label="No thanks"
							color="secondary"
							width="full"
							/>
					</Chunk>

				</Sectionless>
			)
		};

		const {
			user
		} = this.props;
		const {
			things
		} = this.state;

		return (
			<Fragment>
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
												this.promptManager.showPrompt( <DeletePrompt thing={thing} /> );
									  		}}>
									  			<Text color="tint">Delete</Text>
									  		</Link>
									  	</Chunk>


								  ))}
								<Chunk>
									<Button
										label="add thing"
										onPress={()=>{
											const things = [...this.state.things];
											things.push({message: 'ok new thing', id: uuid()});
											this.setState({things: things});
										}}
										/>
								</Chunk>

							</Section>
						</Sections>
					</Bounds>
				</Stripe>


			</Page>

			<PromptManager
					ref={ref => {this.promptManager = ref}}
					/>
			</Fragment>
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