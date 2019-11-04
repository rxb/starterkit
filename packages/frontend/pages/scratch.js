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

// import createMarkdownRenderer from 'rn-markdown'
// const Markdown = createMarkdownRenderer({ gfm: false })
// const SimpleMarkdown = require("simple-markdown");
// const defaultOutput = SimpleMarkdown.defaultOutput;

import Markdown from 'markdown-to-jsx';

//const Markdown = () => { return false }	;

class Scratch extends React.Component {

	render() {

		const {
			user
		} = this.props;


		const  markdownContent = `

# Zarathustra

## Zarathustra

### Zarathustra

ideal god love derive salvation faithful intentions salvation truth. Oneself transvaluation faithful war enlightenment ultimate right joy overcome faithful ideal christianity revaluation pious. Joy christianity mountains prejudice fearful abstract derive.

http://askjeeves.com

* Joy christian pious virtues hope transvaluation grandeur love christianity ascetic play victorious law. Endless will pious will noble endless. [^1]

* Strong revaluation disgust superiority reason sexuality morality prejudice will. Depths faithful noble truth marvelous fearful enlightenment aversion depths christian philosophy value burying.

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