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





class Scratch extends React.Component {

	render() {

		const {
			user
		} = this.props;

		return (
			<Page>
				<Stripe>
					<Bounds>
						<Sections>
							<Section type="pageHead">
								<Chunk>
									<Text type="pageHead">Scratch</Text>
								</Chunk>
								<Chunk>
									<View
										style={{
											height: 10,
											background: 'red'
										}}
										/>
								</Chunk>
								<Chunk>
									<Flex>
										<FlexItem
											growFactor={3}
											>

											<View
												style={{
													background: 'blue'
												}}
												>
												<Inline style={{flexWrap: 'noWrap'}}>
												<Image
										  			source={`https://www.google.com/s2/favicons?domain=http://eventbrite.com`}
										  			style={{
										  				width: 12,
										  				height: 12,
										  				resizeMode: 'contain',
										  			}}
										  			/>
												<Text
													style={{
														overflow: 'hidden',
														textOverflow: 'ellipsis'
													}}
													ellipsizeMode="tail">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
												</Inline>
											</View>

										</FlexItem>
										<FlexItem>
											<View
											style={{
												background: 'green',
												height: 10
											}}
											>
											</View>
										</FlexItem>
									</Flex>
								</Chunk>
								<Chunk>
									<Flex>
										<FlexItem
											growFactor={3}
											>
											<Inline>
												<View
												style={{
													background: 'blue',
													height: 10

												}}
												>
												<Text>ok</Text>
												</View>
											</Inline>
										</FlexItem>
										<FlexItem>
											<View
											style={{
												background: 'green',
												height: 10

											}}
											>
											</View>
										</FlexItem>
									</Flex>
								</Chunk>
								<Chunk>
									<Flex>
										<FlexItem
											growFactor={3}
											>
												<View
												style={{
													background: 'blue',
													height: 10

												}}
												>
												<Text>ok</Text>
												</View>
										</FlexItem>
										<FlexItem>
											<View
											style={{
												background: 'green',
												height: 10

											}}
											>
											</View>
										</FlexItem>
									</Flex>
								</Chunk>
								<Chunk>
									<Text
										numberOfLines={1}
										ellipsizeMode="tail"
										>
										<Image
								  			source={`https://www.google.com/s2/favicons?domain=http://eventbrite.com`}
								  			style={{
								  				width: 12,
								  				height: 12,
								  				resizeMode: 'contain',
								  				flex: 1,
								  				marginRight: 6
								  			}}
								  			/>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
									</Text>
								</Chunk>
								<Chunk>
									<Flex>
										<FlexItem
											growFactor={3}
											>

											<View
												style={{
													background: 'blue'
												}}
												>
												<Text
													numberOfLines={1}
													ellipsizeMode="tail"
													>
													<Image
											  			source={`https://www.google.com/s2/favicons?domain=http://eventbrite.com`}
											  			style={{
											  				width: 12,
											  				height: 12,
											  				resizeMode: 'contain',
											  				flex: 1,
											  				marginRight: 6
											  			}}
											  			/>
														Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
												</Text>
											</View>

										</FlexItem>
										<FlexItem>
											<View
											style={{
												background: 'green',
												height: 10
											}}
											>
											</View>
										</FlexItem>
									</Flex>
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