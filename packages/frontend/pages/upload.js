import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Head from 'next/head'

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
	Touch,
	View
} from '../components/cinderblock';


import styles from '../components/cinderblock/styles/styles';
import Page from '../components/Page';


class Upload extends React.Component {

	static async getInitialProps (context) {
		return {};
	}

	constructor(props){
		super(props);
		this.state = {}
	}

	render() {

		const {
			user
		} = this.props;

		return (
			<Fragment>
			<Page>
				<Head>
					<meta property='og:title' content='Scratch' />
					<title>Upload test</title>
				</Head>
				<Stripe>
					<Bounds>
						<Sections>
							<Section type="pageHead">
								<Chunk>
									<Text type="pageHead">Upload test</Text>
								</Chunk>
							</Section>
							<Section>
								<Chunk>
									<Label>Your photo</Label>
									<View style={[styles.input]}>
										{!this.state.filename &&
											<Text color="hint">Pick a file</Text>
										}
										{this.state.filename &&
											<Text color="primary">{this.state.filename}</Text>
										}
										<input
											type="file"
											id="somephoto"
											onChange={(e)=>{
												this.setState({
											      file: URL.createObjectURL(e.target.files[0]),
											      filename: e.target.value.split(/(\\|\/)/g).pop()
											    })
											}}
											style={{
												position: 'absolute',
												opacity: 0,
												width: '100%',
												height: '100%'
											}}
											/>
									</View>
								</Chunk>
								<Chunk>
									<Button
										type="primary"
										label="Let's do this"
										onPress={()=>{
											alert('filez');
										}}
										/>
								</Chunk>

								{this.state.file &&
									<Chunk>
										<Image
											source={{uri: this.state.file}}
											style={[{
												height: 300,
												width: 300
											}, styles.pseudoLineHeight]}
											/>

									</Chunk>
								}
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
)(Upload);

