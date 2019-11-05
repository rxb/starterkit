import React, {Fragment} from 'react';
import { connect } from 'react-redux';

import {
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
	Map,
	Modal,
	Picker,
	Section,
	Sections,
	Sectionless,
	Stripe,
	Text,
	TextInput,
	Touch,
	View,
	withFormState
} from '../components/cinderblock';

import styles from '../components/cinderblock/styles/styles';
import Page from '../components/Page';

import AREAS from './areas';



import Markdown from 'markdown-to-jsx';



class Scratch extends React.Component {



	render() {

		const {
			user
		} = this.props;


		const  markdownContent = `

# Buster

## Buster

### Buster

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

http://askjeeves.com

* Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. [^1]

* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
Okay lets go

1. This is a thing

1. This is another thing

1. This is a third thing
		`;

		return (
			<Page>
				<Stripe>
					<Bounds>
						<Sections>
							<Section type="pageHead">

								{/*
								<Chunk>
									<Text type="pageHead">Scratch</Text>
								</Chunk>
								*/}

								<Card style={{
									maxWidth: 500
								}}>
									<Section>
									<Chunk>
										<Text type="pageHead">What up!</Text>
									</Chunk>
									<Chunk>
										<Markdown
											options={{
									            overrides: {
									            	h1: {
									            		component: Text,
									            		props: {type: 'pageHead'}
									            	},
									            	h2: {
									            		component: Text,
									            		props: {type: 'sectionHead'}
									            	},
									            	h3: {
									            		component: Text,
									            		props: {type: 'big'}
									            	},
									                p: {
									                    component: Text,
									                },
									            },
									        }}
											>{markdownContent}</Markdown>
									</Chunk>
								</Section>

								</Card>
							</Section>

								<Section>
									<Chunk>
										<Map
											style={{height: 350}}
											cluster={true}
											markers={AREAS.map((area, i)=>{
												return {lat: area.lat, lon: area.lon, title: area.name}
											})}
											/>

									</Chunk>
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
		user: state.user,
	});
}

const actionCreators = {};

export default connect(
	mapStateToProps,
	actionCreators
)(Scratch);