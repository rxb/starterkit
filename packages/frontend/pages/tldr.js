import React, {Fragment} from 'react';
import { connect } from 'react-redux';

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
	Touch,
	View,
	withFormState,
	
} from '../components/cinderblock';

import styles from '../components/cinderblock/styles/styles';
import swatches from '../components/cinderblock/styles/swatches';
import {METRICS} from '../components/cinderblock/designConstants';
import {WithMatchMedia} from '../components/cinderblock/components/WithMatchMedia';
import Page from '../components/Page';




import Markdown from 'markdown-to-jsx';


const Card1 = (props) => {
	return (
		<Card style={{
				/*
				borderTopWidth: 12,
				borderTopColor: 'blue',
				borderTopStyle: 'solid',
				*/
				borderWidth: 0,
				shadowRadius: 16,
				shadowColor: 'rgba(0,0,0,.15)',
				borderRadius: 12
			}}>
			<Stripe style={{backgroundColor: swatches.tint}}>
				<Section>
					<Chunk>
						<Text type="pageHead" inverted>Buster Bluth</Text>
						<Text inverted>Lorem ipsum dolor sit amet, consectetur adipiscing elit</Text>
					</Chunk>
				</Section>
			</Stripe>
			<Stripe>

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
											<Text>{props.children}</Text>
										</Chunk>),
										},
										ul: {
										component: (props) => (<Chunk><ul style={{margin: 0, paddingLeft: 18}}>{props.children}</ul></Chunk>)
										},
										li: {
										component: (props) => (<li>{props.children}</li>)
										}
								},
							}}
						>{props.markdownContent}</Markdown>
				</Section>
				</Stripe>
			</Card>

	);
}

const Card2 = WithMatchMedia((props) => {

	const {
		media,
		tldr
	} = props;

	return (
		<Card style={{
				/*
				borderTopWidth: 12,
				borderTopColor: 'blue',
				borderTopStyle: 'solid',
				*/
				borderWidth: 0,
				shadowRadius: 16,
				shadowColor: 'rgba(0,0,0,.15)',
				borderRadius: 12
			}}>
			<Sectionless style={[
					{backgroundColor: swatches.tint},
					(media.medium) ? {paddingHorizontal: 30, paddingTop: 20, paddingBottom: 5} : {}
				]}>
					<Chunk style={{paddingBottom: METRICS.space / 4}}>
						<Inline>
						<Avatar style={{height: 14, width: 14}} source={{uri: 'https://randomuser.me/api/portraits/women/79.jpg'}} />
						<Text type="small" inverted color="secondary">
							rxb/buster-bluth  v1.2
						</Text>
						</Inline>
					</Chunk>
					<Chunk>
						<Text type="pageHead" inverted>{tldr.title}</Text>
						<Text inverted style={{fontStyle: 'italic'}}>{tldr.blurb}</Text>
					</Chunk>
			</Sectionless>
			<Sectionless style={[
					(media.medium) ? {paddingHorizontal: 30, paddingTop: 20, paddingBottom: 5} : {}
				]}>
					<View>
					{tldr.steps.map((step, i)=>(
						<Chunk style={{
							borderLeftWidth: 3,
							borderLeftColor: `${swatches.tint}44`,
							paddingBottom: 0,
							marginBottom: METRICS.space,
							paddingLeft: METRICS.space * .66
							}}>
							<Text weight="strong"><Markdown>{step.head}</Markdown></Text>
							<Text>{step.body}</Text>
						</Chunk>
					))}
					</View>
				</Sectionless>
			</Card>

	);
});


class Tldr extends React.Component {



	render() {

		const {
			markdownContent,
			user
		} = this.props;


		
		return (
			<Page>
				<Stripe >
					<Bounds>
						<Sections>

							<Flex direction="column" switchDirection="large">

								<FlexItem growFactor={1}>

									<Section>

										<Chunk>
											<Card2 markdownContent={markdownContent} {...this.props} />
										</Chunk>
									</Section>

								</FlexItem>
								<FlexItem growFactor={0} style={{flexBasis: 360, flex: 0}}>
									<Section>
										<Chunk>
											<Flex>
												<FlexItem>
													<Inline style={{flexWrap: 'noWrap', flex: 1}}>
														<Button
															width="full"
															color="secondary"
															shape="ArrowUp"
															style={{borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1}}
															/>
														<Button
															width="full"
															color="secondary"
															shape="ArrowDown"
															style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0, flex: 1}}
															/>
													</Inline>
												</FlexItem>
												<FlexItem shrink>
													<Inline style={{flexWrap: 'noWrap'}}>
														<Button shape="Edit3" color="secondary" />
														<Button shape="GitPullRequest" color="secondary" />
														<Button shape="Bookmark" color="secondary" />
													</Inline>
												</FlexItem>
											</Flex>
										</Chunk>
										<List
											items={[
												<Text>References & rationale</Text>,
												<Text>Issues</Text>,
												<Text>Contributors & forks</Text>,
												<Flex>
													<FlexItem shrink>
														<Avatar
															size="medium"
															source={{uri: 'https://randomuser.me/api/portraits/women/69.jpg'}}
															/>
													</FlexItem>
													<FlexItem>
														<Text>Maintainer Name</Text>
														<Text type="small" color="secondary">Maintainer Info</Text>
													</FlexItem>
												</Flex>
											]}
											renderItem={(item, i)=>{
												return(
													<Chunk key={i}>
														<Flex>
															<FlexItem>
																{item}
															</FlexItem>
															<FlexItem shrink>
																<Icon
																	shape="ChevronRight"
																	color={swatches.textHint}
																	/>
															</FlexItem>
														</Flex>
													</Chunk>
												);
											}}
											/>
									</Section>

								</FlexItem>
							</Flex>

					</Sections>
					</Bounds>
				</Stripe>
				<Stripe style={{backgroundColor: swatches.backgroundShade}}>
					<Bounds>
						<Sections>

							<Section>
								<Chunk>
									<Text type="sectionHead">Related cards</Text>
								</Chunk>
								<List
									variant={{
										small: 'scroll',
										large: 'grid'
									}}
									itemsInRow={4}
									items={[
										{title: 'Something is cool', blurb: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'},
										{title: 'Something is cool', blurb: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'},
										{title: 'Something is cool', blurb: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'},
										{title: 'Something is cool', blurb: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'},
									]}
									renderItem={(item, i)=>{
										return(
											<Chunk key={i}>
												<Card>
													<Section>
														<Chunk>
															<Text type="big">{item.title}</Text>
														</Chunk>
														<Chunk>
															<Text>{item.blurb}</Text>
														</Chunk>
													</Section>
												</Card>
											</Chunk>
										);
									}}
									/>

							</Section>

						</Sections>
					</Bounds>
				</Stripe>
			</Page>
		);


	}
}

const  markdownContent = `
* **Excepteur sint occaecat cupidatat**
Non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

* **Lorem ipsum dolor sit amet, consectetur adipiscing elit**
sed do eiusmod tempor incididunt ut labore Okay lets go

* **Excepteur sint occaecat cupidatat**
Non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

* **Lorem ipsum dolor sit amet, consectetur adipiscing elit**
sed do eiusmod tempor incididunt ut labore Okay lets go
		`;

const tldr = {
	title: "Buster Bluth",
	blurb: "Free juice? This Party Is Going To Be Off The Hook!",
	steps: [
		{ 
			head: "Excepteur sint occaecat cupidatat",
			body: "Non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
		},
		{ 
			head: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
			body: "sed do eiusmod tempor incididunt ut labore Okay lets go"
		},
		{ 
			head: "Excepteur sint occaecat cupidatat",
			body: "Non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. sed do eiusmod tempor incididunt ut labore Okay lets go"
		},
		{ 
			head: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
			body: "sed do eiusmod tempor incididunt ut labore Okay lets go"
		},		
		{ 
			head: "Excepteur sint occaecat cupidatat",
			body: "Non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
		},
	]
}


const mapStateToProps = (state, ownProps) => {	
	return ({
		user: state.user,
		markdownContent,
		tldr
	});
}

const actionCreators = {};

export default connect(
	mapStateToProps,
	actionCreators
)(Tldr);