import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Head from 'next/head'

import {
	fetchShow,
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
	console.log('props');
	console.log(props.fields)


	const {
		fields,
		setFieldState,
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
					value={fields.title}
					onChange={e => setFieldState({title: e.target.value}) }
					/>
			</Chunk>
			<Chunk>
				<Flex>
					<FlexItem>
						<Label>Your photo</Label>
						<FileInput
							id="photo"
							onChangeFile={(file)=>{
								setFieldState({
									// comes from server, doesn't get sent back to server
									photoUrl:  URL.createObjectURL(file),
									// comes from server, gets sent back to server
									photoId: false,
									// only exists client -> server
									photoNewFile: file
								});
							}}
							/>
					</FlexItem>
					{ fields.photoUrl &&
						<FlexItem shrink>
							<Image
							    source={{uri: fields.photoUrl }}
							    style={[{
							          width: 84,
							          flex: 1,
							          resizeMode: 'cover',
							          borderRadius: 4,
							          boxSizing: 'content-box'
							    }, styles.pseudoLineHeight]}
							    />
						</FlexItem>
					}
				</Flex>
			</Chunk>
			<Chunk>
				<Button
					type="primary"
					label="Let's do this"
					onPress={ handleSubmit }
					/>
			</Chunk>
			<Chunk>
				<Text>{JSON.stringify(fields)}</Text>
			</Chunk>
		</form>
	);
});




class ShowTest extends React.Component {

	static async getInitialProps (context) {
		const {store, isServer, pathname, query} = context;
		const showId = query.showId;
		return {
			showId
		}
	}

	constructor(props){
		super(props);
		this.state = {}
	}

	componentDidMount(){
		this.props.fetchShow(this.props.showId);
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
					<title>Edit show</title>
				</Head>
				<Stripe>
					<Bounds>
						<Sections>
							<Section type="pageHead">
								<Chunk>
									<Text type="pageHead">Edit show</Text>
								</Chunk>
							</Section>
							<Flex direction="column" switchDirection="medium">
								<FlexItem growFactor={2}>
									<Section>
										{ show.item && show.item.id &&
										<ShowForm
											initialFields={{
												title: show.item.title,
												photoUrl: show.item.photoUrl,
												photoId: show.item.photoId,
												id: show.item.id
											}}
											onSubmit={(fields)=>{
												const {photoNewFile, ...otherFields} = fields;
												readFileAsDataUrl(photoNewFile).then((encodedFile)=>{
													const showFields = {...otherFields, uri: encodedFile};
													createShow(showFields);
												})
											}}
											/>
										}
									</Section>
								</FlexItem>
								<FlexItem growFactor={1}>
									<Section>
										<Text>{JSON.stringify(show.error)}</Text>
										<Text>{JSON.stringify(show.item)}</Text>
										<Text>{JSON.stringify(show.loading)}</Text>
									</Section>
									<Section>
										{show.item &&
											<Fragment>
												<Chunk>
													<Text type="sectionHead">{show.item.title}</Text>
												</Chunk>
												<Chunk>
													<Text>server</Text>
													<Image
														source={{uri: show.item.photo}}
														style={[{
															height: 300,
														}, styles.pseudoLineHeight]}
														/>
												</Chunk>
											</Fragment>
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
	fetchShow,
	createShow
};

export default connect(
	mapStateToProps,
	actionCreators
)(ShowTest);

