import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Head from 'next/head'

import {
	createShowComment,
	createShow
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
	View,
	withFormState
} from '../components/cinderblock';


import styles from '../components/cinderblock/styles/styles';
import Page from '../components/Page';

// move this somewhere
// utils? or even file input, (like a thunkable thing that can be run when needed?)
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


const ShowForm = withFormState((props) => {
	const {
		getFieldValue,
		setFieldValue,
		handleSubmit,
		resetFields,
		fieldErrors = {}
	} = props;

	return(
		<form>
			<Chunk>
				<Label for="title">Show title</Label>
				<TextInput
					id="title"
					value={getFieldValue('title')}
					onChange={e => setFieldValue('title', e.target.value)}
					/>
			</Chunk>
			<Chunk>
				<Label>Your photo</Label>
				<FileInput
					id="yourphoto"
					onChangeFile={(file)=>{
						props.onPhotoUpdate(file);
						setFieldValue('file', file)
					}}
					/>
			</Chunk>
			<Chunk>
				<Button
					type="primary"
					label="Let's do this"
					onPress={ handleSubmit }
					/>
			</Chunk>
		</form>
	);
});



class ShowTest extends React.Component {

	static async getInitialProps (context) {
		return {};
	}

	constructor(props){
		super(props);
		this.state = {}
	}

	render() {

		const {
			show,
			createShow,
			createShowComment
		} = this.props;

		return (
			<Fragment>
			<Page>
				<Head>
					<meta property='og:title' content='Scratch' />
					<title>Show test</title>
				</Head>
				<Stripe>
					<Bounds>
						<Sections>
							<Section type="pageHead">
								<Chunk>
									<Text type="pageHead">New show</Text>
								</Chunk>
							</Section>
							<Flex direction="row">
								<FlexItem>
									<Section>
										<ShowForm
											onPhotoUpdate={(file)=>{
												this.setState({
													filepreview: URL.createObjectURL(file)
												});
											}}
											onSubmit={(fields)=>{
												console.log('onSubmit');
												const {file, ...otherFields} = fields;
												createShow({...otherFields});
												/*
												readFileAsDataUrl(file).then((encodedFile)=>{
													const showFields = {...otherFields, uri: encodedFile};
													const what = createShow(showFields);
													console.log(what);
												})
												*/
											}}
											/>
									</Section>
								</FlexItem>
								<FlexItem>
									<Section>
										<Text>{JSON.stringify(show.error)}</Text>
										<Text>{JSON.stringify(show.item)}</Text>
										<Text>{JSON.stringify(show.loading)}</Text>
									</Section>
									<Section>
										{show.item &&
											<Chunk>
												<Text type="sectionHead">{show.item.title}</Text>
												<Text numberOfLines={1}><Link
													href={show.item.uri}
													target="_blank"
													color="tint"
													>
													{show.item.url}
												</Link></Text>
												<Image
													source={{uri: `http://localhost:3030/photos/${this.state.fileid}`}}
													style={[{
														height: 300,
													}, styles.pseudoLineHeight]}
													/>
												<Image
													source={{uri: show.item.url}}
													style={[{
														height: 300,
													}, styles.pseudoLineHeight]}
													/>
											</Chunk>
										}
									</Section>
								</FlexItem>
							</Flex>
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
		show: state.show
	});
}

const actionCreators = {
	createShow,
	createShowComment
};

export default connect(
	mapStateToProps,
	actionCreators
)(ShowTest);

