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
	Map,
	Modal,
	Picker,
	Section,
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

const TESTCOLORS = ["#193941","#ff7864","#041799","#7ad1ee","#D51C29","#00A99D","#00B7B7","#ad0520","#F22263","#4C581A","#4DB4D7","#fcbf18","#9b5260","#bf5700","#D44329","#76B9E1","#5A5A69","#e61e00","#ffd316","#C4E538","#FF8772","#3A547C","#DC6EDC","#42AF89","#7ba6ad","#50c88c","#F15D59","#0ab99c","#ab2525","#8f4b21","#FF6600","#a51ec1","#00C9BA","#ff6633","#AAD038","#4d5d5b","#64C8FF","#e69866","#748899","#798f5a","#6c64ff","#ffd582","#008fa7","#48dacb","#b3dae5","#e5dd42","#e8d41a","#b39b90","#005000","#F985E8","#f99973","#BE9BD9","#8ff2a6","#7ED0E1","#00a300","#3f4a5d","#7B2980","#3d4f56","#659d92","#0DD6AF","#b7c9e0","#8C1928","#0096C8","#213e74","#F37321","#C1E0E5","#E6EA5B","#17214C","#46c1b2","#4D1970","#096228","#ffc83f","#c1bc87","#b20000","#9C1E2C","#FF4000","#8AEB66","#6B57A5","#85e4f9","#E2E000","#2763ff","#2BE0A8","#564858","#77C588","#D20028","#2a597e","#3C266F","#E2C207","#93C840","#c63030","#01a19a","#E11383","#EE0000","#E77038","#DC8200","#0f6800","#faa819","#c676ff","#9D8931","#00bea0","#FF8B40","#007C79","#f8005b","#BF206F","#d04bdb","#D2529E","#2C8C79","#008754","#FF3C96","#CC0000","#FCC200","#A5AE51","#C02627","#bd1a88","#F2E36F","#5d7850","#4d07a8","#f7941e","#DC6E28","#2EC9ED","#C40505","#451834","#006ebf","#F3859C","#FF6D00","#ec008c","#3ca9b7","#ff66cc","#95D5D5","#de0057","#FCBA60","#30602F","#F7E503","#F2781C","#517abd","#D31D52","#F5844F","#f4e11c","#3e96d2","#EC5A7D","#8c61a8","#5400AD","#ff0000","#009680","#676760","#FFF31A","#216d40","#ff5917","#223e98","#F15C30","#5d4284","#029874","#EF6A63","#FFB000","#76163e","#FFA501","#0000cc","#971d1f","#842442","#e5a735","#ea5455","#6a5770","#4683B0","#28c83c","#00635a","#d9e022","#208cbc","#283494","#004E8B","#8c222f","#A50E27","#0000e6","#F27597","#b56c23","#ffe900","#501596","#E0B03C","#7F0ACF","#6ED2C8","#d95f4c","#65A9C1","#73b84d","#94a338","#22ff22","#6e1e46","#C92A39","#002d62","#ebc9f4","#96c7d7","#2200aa","#009900","#144F59","#79c416","#1e315f","#da4a75","#C41E3A","#c0c037","#0baef7","#96D698","#ee3c2d","#FFD400","#ff51a7","#0326F2","#7a4fdc","#669900","#0646fa","#2ff7d0","#2C42D2","#32aa32","#00c800","#89a527","#3566b9","#7f8000","#ffcc00","#FC93C6","#6fa04f","#DDB0A2","#0074DD","#cd5d28","#ff5000","#9C9C9D","#58b74e","#40B761","#be0040","#C1CF82","#51BBB7","#628481","#006DC8","#FF8500","#FC9302","#31B1CB","#EF464E","#0f4c81","#00b2d9"]

//const TESTCOLORS = ["ff595e","ff924c","ffca3a","c5ca30","8ac926","36949d","1982c4","4267ac","565aa0","6a4c93"].map(color => `#${color}`)

class ColorTest extends React.Component {



	render() {


		
		return (
			<Page>
				<Stripe>
					<Bounds>

						<Section>
							<Chunk>
								<Text type="pageHead">Color Test</Text>
							</Chunk>

							<List 
								variant={{
									small: 'grid',
								}}
								itemsInRow={{
									small: 2,
									medium: 3,
									large: 5
								}}
								items={TESTCOLORS}
								renderItem={(item, i)=>{
									return(
									<Chunk>
										<View 
											style={{
												backgroundColor: item,
												height: 100,
												/*
												borderWidth: 1,
												borderColor: 'black'
												*/
											}}
											/>
										<Text>{item}</Text>
									</Chunk>
									);
								}}
								/>
						</Section>
					</Bounds>
				</Stripe>
			</Page>
		);


	}
}


const mapStateToProps = (state, ownProps) => {
	return ({
		//user: state.user,
	});
}

const actionCreators = {};

export default connect(
	mapStateToProps,
	actionCreators
)(ColorTest);