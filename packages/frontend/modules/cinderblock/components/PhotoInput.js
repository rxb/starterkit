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


const PhotoInput = (props) => {

	const { onChangeFile, fileState, style } = props;
	const [inputKey, setInputKey] = useState(0); // new key resets/rerenders file input

	return(
		<View style={style}>
			<Flex>
				<FlexItem>
					<FileInput
						inputKey={inputKey}
						shape="Camera"
						id="photo"
						placeholder={ fileState.preview ? 'Select a new file' : 'Select a file'}
						onChangeFile={ fileState => {
							onChangeFile(fileState);
						}}
						/>
					{ fileState.preview &&
						<FakeInput
						label="Remove photo"
						shape="X"
						onPress={ ()=>{
							onChangeFile({});
							setInputKey((inputKey+1));
						}}
						/>
					}
				</FlexItem>
				{ fileState.preview &&
					<FlexItem shrink>
						<Image
						source={{uri: fileState.preview }}
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