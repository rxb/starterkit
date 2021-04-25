// LINK
// For internal routing
// captures the href and turns it into an onPress router push + scroll adjustment
// the onPress prop is just for additional actions, don't use this for onPress without an href, that's a job for Touch

import React from 'react';
import Touch from './Touch';
import Router from 'next/router'


/*
TODO:
Consider using https://github.com/fridays/next-routes
for nice dynamic routes like
http://tldr.cards/c/finance
http://tldr.cards/u/rxb
*/

class Link extends React.Component {

	render() {
		const {
			href,
			children,
			onPress = () => {},
			...other
		} = this.props;

		return(
				<Touch
					accessibilityRole="link"
					href={href}
					onPress={(event)=>{
						event.preventDefault();
						onPress();
						if(!this.props.target){ // if opening new window, don't use router
							Router.push(href).then(()=>{window.scroll(0,0)}); // TODO: maybe use next/Link ?
						}
					}}
					{...other}
					>
						{children}
				</Touch>
		);
	}
}


export default Link;