import React from 'react';
import Touch from './Touch';
import Router from 'next/router'


/*
Consider using https://github.com/fridays/next-routes
for nice dynamic routes like
http://tldr.cards/c/finance
http://tldr.cards/u/rxb

Don't worry about it for now

*/

class Link extends React.Component {

	render() {
		const {
			href,
			children,
			...other
		} = this.props;

		return(
				<Touch
					accessibilityRole="link"
					href={href}
					onPress={(event)=>{
						event.preventDefault();
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