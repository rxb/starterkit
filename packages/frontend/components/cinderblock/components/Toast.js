import React from 'react';
import { Animated, Touchable, View } from '../primitives';
import Text from './Text';
import styles from '../styles/styles';
import { METRICS, EASE } from '../designConstants';

const duration = 200;

class ToastItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visibility: new Animated.Value(0),
			display: 'block'
		}
		this.teardown = this.teardown.bind(this);
	}

	componentDidMount(){
		Animated.timing(
			this.state.visibility,{
				toValue: 1,
				easing: EASE,
				duration
			}
		).start();
	}

	teardown(){
		const self = this;
		return new Promise(
			function (resolve, reject) {
				Animated.timing(
					self.state.visibility, {
						toValue: 0,
						easing: EASE,
						duration
					})
					.start(()=>{
						self.setState({display: 'none'});
						resolve();
					});
			}
		);
	}

	render(){
		return(
			<Animated.View
				style={{
					display: this.state.display,
					marginTop: this.state.visibility.interpolate({
				    	inputRange: [0, 1],
				        outputRange: [-60, 0]
				    }),
					opacity: this.state.visibility
				}}
				>
				<View style={styles.toast}>
					<Text color="primary" inverted>{this.props.toast.message}</Text>
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
			toastCursor: 0,
		}
		this.addToast = this.addToast.bind(this);
		this.removeToast = this.removeToast.bind(this);
		this.getToastId = this.getToastId.bind(this);
	}

	getToastId(){
		const thisToastId = this.state.toastCursor;
		this.setState({toastCursor: this.state.toastCursor+1})
		return `toast${thisToastId}`;
	}

	// clearToasts being used at the moment
	// seems to be the problem
	// i think it has to do with the refs getting weird
	// when state gets recreated
	/*
	clearToasts(){
		const newToasts = [...this.state.toasts];
		const index = newToasts.findIndex((t)=>{
			return t.id == toast.id
		})
		newToasts.splice(index, 1);
		this.setState({toasts: newToasts});
	}
	*/

	addToast(message){
		const thisToastId = this.getToastId();
		const toasts = [...this.state.toasts];
		const newToast = {
			message: `${thisToastId} -- ${message}`,
			id: thisToastId,
			ref: React.createRef()
		};
		toasts.push(newToast);
		this.setState({toasts});
		this.removeToast(newToast);
	}

	removeToast(toast){
		const self = this;
		setTimeout(()=>{
			toast.ref.current.teardown()
		}, 5000);
	}

	render() {
		const {
			...other
		} = this.props;

		return(
			<View style={{position: 'fixed', top: 0, left: 0, right: 0}}>
				{this.state.toasts.map((toast, i)=>{
					return <ToastItem key={i} toast={toast} ref={toast.ref} />
				})}
			</View>
		);
	}
}


export default Toast;