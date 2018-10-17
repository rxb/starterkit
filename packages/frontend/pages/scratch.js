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


import { View } from '../components/cinderblock/primitives';
import { Transition, animated } from 'react-spring';
const AnimatedView = animated(View)




class ListItem extends React.Component {
	render(){
		const {
			thing,
			i
		} = this.props;
		return(
			<View style={{backgroundColor: 'red', marginBottom: 2}}>
				<Text>{i}. {thing}</Text>
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
			things: []
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

								<Transition
								  keys={things.map((thing) => thing.id)}
								  from={{ opacity: 0, height: 0 }}
								  enter={{ opacity: 1, height: 'auto' }}
								  leave={{ opacity: 0, height: 0 }}>
								  {things.map(thing => styles => (
								  	<AnimatedView style={{...styles, backgroundColor: 'red'}}>
								  		<Text>{thing.message} {thing.id}</Text>
								  		<Touch onPress={()=>{
								  			const things = this.state.things.filter( item => item.id != thing.id);
											this.setState({things: things});
								  		}}>
								  			<Text>Delete</Text>
								  		</Touch>
								  	</AnimatedView>
								  ))}
								</Transition>

								{/*this.state.things.map((thing,i) => (
									<ListItem thing={thing} i={i} key={i} />
								))*/}

								<Touch onPress={()=>{
									const things = [...this.state.things];
									things.push({message: 'ok new thing', id: uuid()});
									this.setState({things: things});
								}}>
									<Button label="add thing" />
								</Touch>

							</Section>
						</Sections>
					</Bounds>
				</Stripe>
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