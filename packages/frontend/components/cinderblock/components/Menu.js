// MENU
// this outclick stuff won't work on react native
// there's a lot that is counting on DOM stuff
// but maybe you should be using native components there for menus anyhow

import React from 'react';
import { View } from '../primitives';
import styles from '../styles/styles';
import ReactDOM from 'react-dom';

class Menu extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			visible: false,
		}
		this.toggle = this.toggle.bind(this);
	}
	toggle(){
		this.setState({visible: !this.state.visible})
	}
	render(){
		return(
			<View style={styles['menu-container']}>
				{ this.state.visible &&
					<MenuComponent
						{...this.props}
						onRequestClose={this.toggle}
						/>
				}
			</View>
		);
	}
};

class MenuComponent extends React.Component {
	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	componentDidMount(){
		setTimeout(()=>{
			document.addEventListener('click', this.handleClick, false);
		}, 1);
	}
	componentWillUnmount(){
		document.removeEventListener('click', this.handleClick, false);
	}
	handleClick(e) {
		if(ReactDOM.findDOMNode(this.outer).contains(e.target)){
			return false;
		}
		this.props.onRequestClose();
	}
	render(){
		const {
			children,
			visible,
		} = this.props;
		return (
			<View style={styles.menu} ref={ outer => this.outer = outer }>
				{this.props.children}
			</View>
		);
	}
}

export default Menu;