import React from 'react';
import { Touchable, View } from '../primitives';
import Text from './Text';
import styles from '../styles/styles';


const stateStyles = {
	active: {opacity: .5},
	default: {opacity: 1}
};

class Touch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isPressed: false
		}
	}

	render() {
		const {
			children,
			style,
			noFeedback,
			isLoading,
			...other
		} = this.props;

		const {
			isPressed
		} = this.state

		const stateStyle = (isPressed || isLoading) ? stateStyles.active : stateStyles.default;

		return(
				<Touchable
					{...other}
					onPressIn={()=>{
						if(!noFeedback){
							this.setState({isPressed: true});
						}
					}}
					onPressOut={()=>{
						if(!noFeedback){
							this.setState({isPressed: false});
						}
					}}
					>
					<View
						style={ [ styles.touch, stateStyle, style ]}
						{...other}
						>
						<React.Fragment>
							{children}
						</React.Fragment>
					</View>
				</Touchable>
		);
	}
}


export default Touch;