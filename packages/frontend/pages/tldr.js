import React, {Fragment, useState} from 'react';
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



const Card1 = WithMatchMedia((props) => {

	const [showReferences, setReferences] = useState(false);

	const {
		media,
		tldr
	} = props;

	return (
		<Card style={[
			thisCardStyle,
			{
				borderRadius: 12
			}
			]}>
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
						<View style={{
							borderLeftWidth: 3,
							borderLeftColor: `${swatches.tint}44`,
							marginBottom: METRICS.space,
							paddingLeft: METRICS.space * .66
							}}>
							<View>
								<Text weight="strong"><Markdown>{step.head}</Markdown></Text>
								<Text>{step.body}</Text>
							</View>
							{ showReferences &&
								<View 
									style={{
										marginTop: METRICS.space /2,
										padding: METRICS.space / 2,
										background: swatches.shade,
										borderRadius: METRICS.borderRadius
									}}>
										<Text type="small">Notes notes notes</Text>
								</View>
							}
						</View>
					))}
					</View>
					
				
					<Chunk>
						<Touch onPress={()=>{
							setReferences(!showReferences)
							/*
							if(!showReferences){
								setTimeout( () => {
									window.scrollTo({
										top: 0,
										left: 0,
										behavior: 'smooth'
									});
								}, 300);
							}
							*/
						}}>
					
							<Text color="hint">
								<Icon 
									shape="ChevronDown"
									color={swatches.hint}
									style={{marginBottom: -6, marginRight: 4}}
									/>
								References & rationale
							</Text>
						</Touch>
					</Chunk>
				</Sectionless>
					
			</Card>
	);
});

const Card2 = WithMatchMedia((props) => {

	const [showReferences, setReferences] = useState(false);

	const {
		media,
		tldr,
		style
	} = props;

	return (
		<Card style={[
			thisCardStyle,
			{
				borderRadius: 12
			},
			style
			]}>
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
					(media.medium) ? {paddingHorizontal: 30, paddingTop: 30, paddingBottom: 10} : {}
				]}>
					<View>
					{tldr.steps.map((step, i)=>(
						<View style={{
							borderLeftWidth: 2,
							borderLeftColor: swatches.border,
							marginBottom: METRICS.space,
							paddingLeft: METRICS.space * .66
							}}>
							<View>
								<Text weight="strong"><Markdown>{step.head}</Markdown></Text>
								<Text color="secondary">{step.body}</Text>
							</View>
							{ showReferences &&
								<View 
									style={{
										marginTop: METRICS.space /2,
										padding: METRICS.space / 2,
										background: swatches.shade,
										borderRadius: METRICS.borderRadius
									}}>
										<Text type="small" color="secondary">{step.note}</Text>
								</View>
							}
						</View>
					))}
					</View>
					
				
					<Chunk>
						<Touch onPress={()=>{
							setReferences(!showReferences)
						}}>

							
							{ !showReferences &&
								<Text color="hint">
									<Icon 
										shape="ChevronDown"
										color={swatches.hint}
										style={{marginBottom: -6, marginRight: 4}}
										/>
									Show references & rationale
								</Text>
							}	

							{ showReferences &&
								<Text color="hint">
									<Icon 
										shape="ChevronUp"
										color={swatches.hint}
										style={{marginBottom: -6, marginRight: 4}}
										/>
									Hide references & rationale
								</Text>
							}							
						</Touch>
					</Chunk>
				</Sectionless>
					
			</Card>
	);
});


class Tldr extends React.Component {



	render() {

		const {
			user
		} = this.props;


		
		return (
			<View style={{minHeight: '100vh'}}>
				<ConnectedHeader />

				<Stripe style={{/*paddingTop: 0,*/ backgroundColor: swatches.notwhite}}>

					<Bounds>

							<Flex direction="column" switchDirection="large">

								<FlexItem growFactor={1}>
									<Section style={{paddingTop: 0, paddingBottom: 0}}>
										<Chunk>
											<Card2 {...this.props} />
										</Chunk>
									</Section>
								</FlexItem>

								<FlexItem growFactor={0} style={{flexBasis: 350, flex: 0}}>
									<Section>

									
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
														<Text weight="strong">Issues (48)</Text>
														<Text type="small" color="secondary">Report problems and suggest improvements</Text>
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
														<Text type="small" color="secondary">Use this card as a starting point for a new one</Text>
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
														<Text weight="strong">Rebecca Black</Text>
														<Text type="small" color="secondary">@rxb</Text>
													</FlexItem>
												</Flex>
											</Chunk>
											
									</Section>

								</FlexItem>
							</Flex>

					</Bounds>
				</Stripe>
				<Stripe style={{backgroundColor: swatches.backgroundShade}}>
					<Bounds>

							<Section>
								<Chunk>
									<Text type="sectionHead">Related cards</Text>
								</Chunk>
								<List
									variant={{
										small: 'scroll',
										medium: 'grid'
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
												<Card style={[
													thisCardStyle,
													{minHeight: 150} 
													]}>
													<Sectionless
														style={{
															borderTopWidth: 5,
															borderTopColor: swatches.tint,
															paddingTop: METRICS.space
														}}
														>
														<Chunk>
															<Text type="small" color="hint">rxb/buster-bluth</Text>
															<Text type="big">{item.title}</Text>
															<Text type="" color="secondary">{item.blurb}</Text>
														</Chunk>
													</Sectionless>
												</Card>
											</Chunk>
										);
									}}
									/>

							</Section>

					</Bounds>
				</Stripe>
			</View>
		);


	}
}


const tldr = {
	title: "Buster Bluth",
	blurb: "Free juice? This Party Is Going To Be Off The Hook!",
	steps: [
		{ 
			head: "Excepteur sint occaecat cupidatat",
			body: "Non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
			note: "Well here we are with a note"
		},
		{ 
			head: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
			body: "sed do eiusmod tempor incididunt ut labore Okay lets go",
			note: "Well here we are with a note"
		},
		{ 
			head: "Excepteur sint occaecat cupidatat",
			body: "Non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. sed do eiusmod tempor incididunt ut labore Okay lets go",
			note: "Well here we are with a note"
		},
		{ 
			head: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
			body: "sed do eiusmod tempor incididunt ut labore Okay lets go",
			note: "Well here we are with a note"
		},		
		{ 
			head: "Excepteur sint occaecat cupidatat",
			body: "Non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
			note: "Well here we are with a note"
		},
	]
}


const mapStateToProps = (state, ownProps) => {	
	return ({
		user: state.user,
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

const thisCardStyle = {
	borderWidth: 0,
	shadowRadius: 16,
	shadowColor: 'rgba(0,0,0,.15)',
}