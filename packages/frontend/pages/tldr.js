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
	Header,
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


const ConnectedHeader = WithMatchMedia((props) => {

	const {
		media
	} = props;

	return(
		<Header position="static" type="">
			<Flex direction="row">
				<FlexItem>
						<Link href="/tldr">
							<Text type={ media.medium ? 'sectionHead' : 'big'} color="tint" style={{fontWeight: 700}}>tldr</Text>
						</Link>
				</FlexItem>
				<FlexItem shrink justify="center">
						<Touch onPress={()=>{
							alert('TODO: like, a menu or something');
						}}>
							<Icon shape="Menu" color={swatches.tint} />
						</Touch>
				</FlexItem>
			</Flex>
		</Header>
	);
});

const Card1 = (props) => {
	return (
		<Card style={{
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
				borderWidth: 0,
				shadowRadius: 16,
				shadowColor: 'rgba(0,0,0,.15)',
				borderRadius: 12
			}}>
			<Sectionless style={[
					{backgroundColor: swatches.tint},
					(media.medium) ? {paddingHorizontal: 30, paddingTop: 30, paddingBottom: 10} : {}
				]}>
					<Chunk style={{paddingBottom: 4}}>
						<Flex>
							<FlexItem>
								<Inline>
									<Avatar style={{height: 12, width: 12, opacity: .75}} source={{uri: 'https://randomuser.me/api/portraits/women/18.jpg'}} />
									<Text type="small" inverted color="secondary">
										rxb/buster-bluth
									</Text>
								</Inline>
							</FlexItem>
							<FlexItem style={{alignItems: 'flex-end'}}>
								<Text type="small" inverted color="secondary">
									v1.2
								</Text>
							</FlexItem>
						</Flex>
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
					
				
					<Chunk>
						<Text type="small" color="hint">
							<Icon 
								shape="ChevronDown"
								size="small"
								color={swatches.hint}
								style={{marginBottom: -2, marginRight: 4}}
								/>
							References & rationale
						</Text>
					</Chunk>
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
			<View style={{minHeight: '100vh'}}>
				<ConnectedHeader />

				<Stripe style={{paddingTop: 0}}>

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

										{/* cumulative score */}
										{/*
										<Chunk>
												
												<Flex noGutters>
														<FlexItem>
															<Button
																shape="ArrowUp"
																color="secondary"
																width="full"
		
																style={{borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1}}
																/>
														</FlexItem>
														<FlexItem shrink>
															<View style={{backgroundColor: swatches.shade, flex: 1, marginVertical: METRICS.pseudoLineHeight, justifyContent: 'center', paddingHorizontal: METRICS.space, marginHorizontal: 1}}>
																		<Text 
																			color="tint" 
																			weight="strong"
																			style={{lineHeight: 16, textAlign: 'center'}}
																			>
																			3,319
																		</Text>
																		<Text 
																			type="micro"
																			color="tint"
																			style={{lineHeight: 15, textAlign: 'center'}}
																			>
																			usefulness
																			</Text>
															</View>
														</FlexItem>
														<FlexItem>
																<Button
																	shape="ArrowDown"
																	color="secondary"
																	width="full"
		
																	style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0, flex: 1}}
																	/>
														</FlexItem>
														
													</Flex>
												</Chunk>
										*/}

										{/* split scores with labels */}
										<Chunk>
											<Flex noGutters>
												<FlexItem>
														<Button
															color="secondary"
															width="full"
															style={{borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1, marginRight: 1}}
															>
															<View style={{flexDirection: 'row', justifyContent: 'center'}}>
																	<Icon 
																		shape="ArrowUp" 
																		color={swatches.tint} 
																		style={{marginLeft: 3, marginRight: 3, }} 
																		/>
																	<View style={{marginLeft: 3}}>
																	<Text 
																		color="tint" 
																		weight="strong"
																		style={{lineHeight: 16}}
																		>
																		3,423
																	</Text>
																	<Text 
																		type="micro"
																		color="tint"
																		style={{lineHeight: 11, marginTop: 3,}}
																		>
																		useful
																		</Text>
																	</View>
															</View>
														</Button>
												</FlexItem>
					
												<FlexItem>
													<Button
															color="secondary"
															width="full"
															style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0, flex: 1}}
															>
															<View style={{flexDirection: 'row', justifyContent: 'center'}}>
																	
																	<View style={{marginRight: 3}}>
																	<Text 
																		color="tint" 
																		weight="strong"
																		style={{lineHeight: 16, textAlign: 'right'}}
																		>
																		104
																	</Text>
																	<Text 
																		type="micro"
																		color="tint"
																		style={{lineHeight: 11, marginTop: 3, textAlign: 'right'}}
																		>
																		not useful
																		</Text>
																	</View>
																	<Icon 
																		shape="ArrowDown" 
																		color={swatches.tint} 
																		style={{marginLeft: 3, marginRight: 3}} 
																		/>
															</View>
														</Button>
												</FlexItem>
												
											</Flex>
										

										{/* split scores without labels */}
										{/*
										<Chunk>									
											<Flex noGutters>
													<FlexItem>
														<Button
															shape="ArrowUp"
															label="3,423"
															color="secondary"
															width="full"
	
															style={{borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1, marginRight: 1}}
															/>
													</FlexItem>

													<FlexItem>
															<Button
																shape="ArrowDown"
																label="104"
																color="secondary"
																width="full"
	
																style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0, flex: 1}}
																/>
													</FlexItem>
													
												</Flex>
											</Chunk>
										*/}
										
										
										
											<Flex style={{marginTop: METRICS.space / 2}}>
												<FlexItem>
														<Button 
															shape="Share2" 
															color="secondary" 
															label="Share" 
															width="full"
															/>
												</FlexItem>
												<FlexItem>
														<Button 
															shape="Bookmark" 
															color="secondary" 
															label="Save" 
															width="full"
															/>
												</FlexItem>
											</Flex>
										</Chunk>
										

											<Chunk style={listItemStyle}>
												<Flex>
													
													<FlexItem>
														<Text weight="strong">Improvements (48)</Text>
														<Text type="small" color="secondary">Help improve this card</Text>
													</FlexItem>
													<FlexItem shrink justify="center" style={{paddingHorizontal: 3}}>
														<Icon
															color={swatches.textSecondary}
															shape="Gift"
															/>
													</FlexItem>
												</Flex>
											</Chunk>

											<Chunk style={listItemStyle}>
												<Flex>
													<FlexItem >
														<Text weight="strong">Forks (3)</Text>
														<Text type="small" color="secondary">Use this as a starting point</Text>
													</FlexItem>
													<FlexItem shrink justify="center" style={{paddingHorizontal: 3}}>
														<Icon
															color={swatches.textSecondary}
															shape="GitPullRequest"
															/>
													</FlexItem>
												</Flex>
											</Chunk>

											<Chunk style={listItemStyle}>
												<Flex>
													<FlexItem >
														<Text weight="strong">Versions (2)</Text>
														<Text type="small" color="secondary">This card is v1.2</Text>
													</FlexItem>
													<FlexItem shrink justify="center" style={{paddingHorizontal: 3}}>
														<Icon
															color={swatches.textSecondary}
															shape="List"
															/>
													</FlexItem>
												</Flex>
											</Chunk>

											<Chunk style={listItemStyle}>
												<Flex>
													<FlexItem shrink justify="center">
														<Avatar
															size="medium"
															source={{uri: 'https://randomuser.me/api/portraits/women/24.jpg'}}
															/>
													</FlexItem>
													<FlexItem>
														<Text>Maintainer Name</Text>
														<Text type="small" color="secondary">Maintainer Info</Text>
													</FlexItem>
												</Flex>
											</Chunk>
											
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
									itemsInRow={{
										small: 1,
										medium: 2,
										large: 4
									}}
									scrollItemWidth={300}
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
			</View>
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

const listItemStyle = {
	borderTopColor: swatches.border,
	borderTopWidth: 1,
	paddingTop: METRICS.space
}