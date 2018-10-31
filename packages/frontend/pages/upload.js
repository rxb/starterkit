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
	FileInput,
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
									<FileInput
										id="yourphoto"
										onChangeFile={(file)=>{
											this.setState({
												file: file,
												filepreview: URL.createObjectURL(file)
											});
										}}
										/>
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

								<Flex direction="row">

								<FlexItem>
								{this.state.filepreview &&

									<Chunk>
										<Text>Local preview</Text>
										<Image
											source={{uri: this.state.filepreview}}
											style={[{
												height: 300,
												width: 300
											}, styles.pseudoLineHeight]}
											/>

									</Chunk>

								}
								</FlexItem>
								<FlexItem>

								{this.state.fileid &&

									<Chunk>
										<Text>Server image <Link
											href={`http://localhost:3030/photos/${this.state.fileid}`}
											target="_blank"
											>
											{this.state.fileid}
										</Link></Text>
										<Image
											source={{uri: `http://localhost:3030/photos/${this.state.fileid}`}}
											style={[{
												height: 300,
												width: 300
											}, styles.pseudoLineHeight]}
											/>
									</Chunk>

								}
								</FlexItem>
								</Flex>
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

