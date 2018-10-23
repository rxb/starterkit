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
		this.startHideTimeout = this.startHideTimeout.bind(this);
		this.remove = this.remove.bind(this);
	}

	componentDidMount(){
		if(this.props.visible){
			setTimeout(()=>{
				this.show();
			}, 1);
		}
	}


	componentWillReceiveProps(nextProps){
		if (this.props.visible != nextProps.visible){
			if(nextProps.visible){
				this.show();
			}
			else{
				this.hide();
			}
		}
	}

	show(){
		Animated.timing(
			this.state.visibility,{
				toValue: 1,
				easing: EASE,
				duration
			}
		).start(this.startHideTimeout);
	}

	hide(){
		Animated.timing(
			this.state.visibility, {
				toValue: 0,
				easing: EASE,
				duration
			})
			.start(this.remove);
	}

	remove(){
		try{
			this.props.removeToast(this.props.toast.id)
		}
		catch{
			console.log('do you have multiple toasters mounted?');
			// toast is gone already
			// there are probably multiple toasters mounted
			// not the worst thing ever, but maybe look into that
		}
	}

	startHideTimeout(){
		const hideDelay = (this.props.toast.hideDelay !== undefined) ? this.props.toast.hideDelay : 5000;
		const autoHide = (this.props.toast.autoHide !== undefined) ? this.props.toast.autoHide : true;
		if(autoHide){
			const hideToast = this.props.hideToast;
			const id = this.props.toast.id;
			setTimeout(()=>{
				try{
					hideToast(id);
				}
				catch{
					console.log('do you have multiple toasters mounted?');
					// toast is gone already
					// there are probably multiple toasters mounted
					// not the worst thing ever, but maybe look into that
				}
			}, hideDelay);
		}
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
								this.hide();
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

	componentDidMount(){
		console.log(`toaster mounted`);
	}

	render() {
		const {
			toasts,
			...other
		} = this.props;

		return(
			<View style={styles.toaster}>
				<View style={styles['toaster-inner']}>
					{toasts.map((toast, i)=>{
						return <ToastItem
									key={toast.id}
									toast={toast}
									visible={toast.visible}
									{...other}
									/>
					})}
				</View>
			</View>
		);
	}
}


export default Toast;