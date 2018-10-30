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

const readFileAsDataUrl = (inputFile) => {
  const temporaryFileReader = new FileReader();
  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result);
    };
    temporaryFileReader.readAsDataURL(inputFile);
  });
};


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
												  file: e.target.files[0],
											      filepreview: URL.createObjectURL(e.target.files[0]),
											      filename: e.target.value.split(/(\\|\/)/g).pop(),
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
											readFileAsDataUrl(this.state.file).then((encodedFile)=>{
												fetch('http://localhost:3030/uploads', {
													method: 'POST',
													headers: {
														'Accept': 'application/json',
														'Content-Type': 'application/json'
													},
													body: JSON.stringify({
													uri: encodedFile,
													name: "Some guy"
													})
												})
												.then( response => response.json() )
												.then( json => this.setState({fileid: json.id }) );
											})
										}}
										/>
								</Chunk>

								{this.state.fileid &&
									<Chunk>
										<Text>This is the server ID</Text>
										<Link
											href={`http://localhost:3030/uploads/${this.state.fileid}`}
											target="_blank"
											>
											{this.state.fileid}
										</Link>
									</Chunk>
								}

								{this.state.filepreview &&
									<Chunk>
										<Image
											source={{uri: this.state.filepreview}}
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

