import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Head from 'next/head'
import uuid from 'uuid/v1';

import {
	addPrompt
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


// FEATHERS CLIENT
// let's try to get feathers client going
import feathers from '@feathersjs/client';
import io from 'socket.io-client';

const apiUrl = 'http://localhost:3030';
const socket = io(apiUrl);

const client = feathers();
client.configure(feathers.authentication(/*options*/))
client.configure(feathers.socketio(socket));



class Scratch extends React.Component {

	static async getInitialProps (context) {
		return {};
	}

	constructor(props){
		super(props);
		this.state = {
			things: [],
			showPrompt: false,
			token: ''
		}
	}

	componentDidMount(){

		// Log in either using the given email/password or the token from storage
		const login = async credentials => {
		  try {
		    if(!credentials) {
		      // Try to authenticate using an existing token
		      await client.reAuthenticate();
		      alert('reAuthenticate');
		    } else {
		      // Otherwise log in with the `local` strategy using the credentials we got
		      await client.authenticate({
		        strategy: 'local',
		        ...credentials
		      });
		      alert('authenticate');
		    }
		  } catch(error) {
		    alert(`error of some time ${error}`);
		  }
		};

		login();
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
							<Section type="pageHead">
								<Chunk>
									<Text type="pageHead">Scratch</Text>
								</Chunk>
							</Section>
							<Section>
								<Chunk>
									<Text>{this.state.accessToken}</Text>
									<Button
										label="log in with facebook"
										onPress={()=>{
											location.href='http://localhost:3030/oauth/facebook/'
										}}
										/>
								</Chunk>
							</Section>

							<Section>
								  {things.map(thing => (
								  		<Chunk>
									  		<Text>{thing.message} {thing.id}</Text>
									  		<Link  onPress={()=>{
												this.props.addPrompt( <DeletePrompt thing={thing} /> );
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
	addPrompt
};

export default connect(
	mapStateToProps,
	actionCreators
)(Scratch);

