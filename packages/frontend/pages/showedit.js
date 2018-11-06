import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Head from 'next/head'

import {
	fetchShow,
	createShow,
	patchShow
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
import ShowCard from '../components/ShowCard';


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
				<Label for="title">Genres</Label>
				{(['Comedy', 'Drama', 'Documentary']).map((item, i)=>{
					const checked = fields.genre.indexOf(item) != -1;
					return(
						<CheckBox
							label={item}
							value={checked}
							onChange={() => {
								const newItems = (checked) ?  fields.genre.filter(a => a !== item) : fields.genre.concat([item]);
								setFieldState({genre: newItems})
							}}
							/>
					);
				})}
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
			patchShow
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
												id: show.item.id,
												genre: []
											}}
											onSubmit={ async (fields)=>{
												const {id, photoNewFile, ...showFields} = fields;
												if(photoNewFile){
													showFields.uri = await readFileAsDataUrl(photoNewFile);
												}
												patchShow(id, showFields);
											}}
											/>
										}
									</Section>
								</FlexItem>
								<FlexItem growFactor={1}>

									<Section>
										<ShowCard show={show.item} />
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
	createShow,
	patchShow
};

export default connect(
	mapStateToProps,
	actionCreators
)(ShowTest);

