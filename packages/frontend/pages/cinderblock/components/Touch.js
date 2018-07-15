import React from 'react';
import { Touchable, View } from '../primitives';
import Text from './Text';
import styles from '../styles/styles';

class Touch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			opacity: 1
		}
	}

	render() {
		const {
			children,
			style,
			noFeedback,
			...other
		} = this.props;


		return(
				<Touchable
					{...other}
					onPressIn={()=>{
						if(!noFeedback){
							this.setState({
								opacity: .5
							})
						}
					}}
					onPressOut={()=>{
						if(!noFeedback){
							this.setState({
								opacity: 1
							})
						}
					}}
					>
					<View style={ [{
							opacity: this.state.opacity
						}, style]}>
						<React.Fragment>{children}</React.Fragment>
					</View>
				</Touchable>
		);
	}
}


export default Touch;