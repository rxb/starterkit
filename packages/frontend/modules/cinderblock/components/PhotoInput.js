import React, {Fragment, useState} from 'react';
import Icon from './Icon';
import Text from './Text';
import Flex from './Flex';
import FlexItem from './FlexItem';
import {View, Image} from '../primitives';
import FileInput from './FileInput';
import FakeInput from './FakeInput';
import styles from '../styles/styles';
import swatches from '../styles/swatches';

const Test = (props) => (
	<>
	<PhotoInput onChangeFile={(fileState)=>(
		formState.setFieldValues({
			/* comes from server, doesn't get sent back to server */
			photoUrl: fileState.filepreview,
			/* comes from server, gets sent back to server */
			photoId: false,
			/* only exists client -> server */
			photoNewFile: fileState.file
		}))}
		/>
	<FieldError error={formState.error?.fieldErrors?.photoUrl} />
	</>	
);

const PhotoInput = (props) => {

	const { onChangeFile, style } = props;
	const [fileState, setFileState] = useState({});
	const [inputKey, setInputKey] = useState(0); // new key resets/rerenders file input

	return(
		<View style={style}>
			<Flex>
				<FlexItem>
					<FileInput
						inputKey={inputKey}
						shape="Camera"
						id="photo"
						placeholder={ fileState.filepreview ? 'Select a new file' : 'Select a file'}
						onChangeFile={ fileState => {
							setFileState(fileState);
							onChangeFile(fileState);
						}}
						/>
					{ fileState.filepreview &&
						<FakeInput
						label="Remove photo"
						shape="X"
						onPress={ ()=>{
							setFileState({});
							onChangeFile({});
							setInputKey((inputKey+1));
						}}
						/>
					}
				</FlexItem>
				{ fileState.filepreview &&
					<FlexItem shrink>
						<Image
						source={{uri: fileState.filepreview }}
						style={[{
							width: 120,
							flex: 1,
							resizeMode: 'cover',
							borderRadius: 4,
							boxSizing: 'content-box'
						}, styles.pseudoLineHeight]}
						/>
					</FlexItem>
				}
			</Flex> 
		</View>
	)
}

export default PhotoInput;