import React from 'react';
import { Animated, Touchable, View } from '../primitives';
import Text from './Text';
import Touch from './Touch';
import Icon from './Icon';
import Flex from './Flex';
import FlexItem from './FlexItem';
import styles from '../styles/styles';
import swatches from '../styles/swatches';
import { METRICS, EASE } from '../designConstants';
import uuid from 'uuid/v1';

const duration = 200;

class ToastItem extends React.Component {

	static defaultProps = {
    	onCompleteClose: ()=>{ },
  	}

	constructor(props) {
		super(props);
		this.state = {
			visibility: new Animated.Value(0),
		}
	}

	componentDidMount(){
		if(this.props.visible){
			setTimeout(()=>{
				this.open();
			}, 1);
		}
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.visible){
			this.open();
		}
		else{
			this.close();
		}
	}

	open(){
		Animated.timing(
			this.state.visibility,{
				toValue: 1,
				easing: EASE,
				duration
			}
		).start();
	}

	close(){
		Animated.timing(
			this.state.visibility, {
				toValue: 0,
				easing: EASE,
				duration
			})
			.start(()=>{
				this.props.onCompleteClose();
			});
	}

	render(){
		return(
			<Animated.View
				style={{
					marginTop: this.state.visibility.interpolate({
				    	inputRange: [0, 1],
				        outputRange: [-60, 0]
				    }),
					opacity: this.state.visibility
				}}
				>
				<View style={styles.toast}>
					<Flex direction="row">
						<FlexItem>
							<Text color="primary" inverted>{this.props.toast.message}</Text>
						</FlexItem>
						<FlexItem shrink>
							<Touch onPress={()=>{
								this.props.onRequestClose();
							}}>
								<Icon
									shape='X'
									color={swatches.textSecondaryInverted}
									size="medium"
									/>
							</Touch>
						</FlexItem>
					</Flex>
				</View>
			</Animated.View>
		);
	}
}


class Toast extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			toasts: [],
		}
	}

	addToast(message){
		const toastId = uuid();
		const toasts = [...this.state.toasts];
		const newToast = {
			message: `${toastId} -- ${message}`,
			id: toastId,
			visible: true
		};
		toasts.push(newToast);
		this.setState({toasts});
		this.startRemoveCountdown(toastId);
	}

	startRemoveCountdown(toastId){
		setTimeout(()=>{
			this.hideToast(toastId);
		}, 5000);
	}

	hideToast(toastId){
		const newToasts = [...this.state.toasts];
		const index = newToasts.findIndex( toast => toast.id == toastId );
		if(index >= 0){
			newToasts[index].visible = false;
			this.setState({toasts: newToasts})
		}
	}

	removeToast(toastId){
		const newToasts = [...this.state.toasts];
		const index = newToasts.findIndex( toast => toast.id == toastId );
		if(index >= 0){
			newToasts.splice(index, 1);
			this.setState({toasts: newToasts})
		}
	}

	render() {
		const {
			...other
		} = this.props;

		return(
			<View style={{position: 'fixed', top: 0, left: 0, right: 0}}>
				{this.state.toasts.map((toast, i)=>{
					return <ToastItem
								key={toast.id}
								toast={toast}
								visible={toast.visible}
								onRequestClose={()=>{this.hideToast(toast.id)}}
								onCompleteClose={()=>{this.removeToast(toast.id)}}
								/>
				})}
			</View>
		);
	}
}


export default Toast;