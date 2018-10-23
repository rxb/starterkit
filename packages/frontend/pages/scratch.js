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
							<Section type="pageHead">
								<Chunk>
									<Text type="pageHead">Scratch</Text>
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

