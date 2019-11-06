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




import Markdown from 'markdown-to-jsx';



class Tldr extends React.Component {



	render() {

		const {
			user
		} = this.props;


		const  markdownContent = `

# Buster Bluth

*Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.*

* **Excepteur sint occaecat cupidatat**
Non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

* **Lorem ipsum dolor sit amet, consectetur adipiscing elit**
sed do eiusmod tempor incididunt ut labore Okay lets go

* **Excepteur sint occaecat cupidatat**
Non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

* **Lorem ipsum dolor sit amet, consectetur adipiscing elit**
sed do eiusmod tempor incididunt ut labore Okay lets go
		`;

		return (
			<Page>
				<Stripe>
					<Bounds>
						<Sections>
							<Section type="pageHead">

								<Chunk>
									<Card style={{
										maxWidth: 500,
										borderTopWidth: 10,
										borderTopColor: 'blue',
										borderTopStyle: 'solid'
									}}>
										<Section>

											<Markdown
												options={{
										            overrides: {
										            	h1: {
										            		component: (props) => (<Chunk>
										            			<Text type="pageHead">{props.children}</Text>
										            		</Chunk>)
										            	},
										            	h2: {
										            		component: (props) => (<Chunk>
										            			<Text type="sectionHead">{props.children}</Text>
										            		</Chunk>)
										            	},
										            	h3: {
										            		component: (props) => (<Chunk>
										            			<Text type="big">{props.children}</Text>
										            		</Chunk>)
										            	},
										                p: {
										                    component: (props) => (<Chunk>
										            			<Text >{props.children}</Text>
										            		</Chunk>),
										                },
										            },
										        }}
												>{markdownContent}</Markdown>

										</Section>

									</Card>

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
)(Tldr);