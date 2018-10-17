import React from 'react';

const Sections = (props) => {

	const {
		children,
	} = props;

	const childrenWithProps = React.Children.map(children,
		(child, i) => {
			// "if" statements can return null components, so needs to check
			if(React.isValidElement(child)){
				return React.cloneElement(child, {
					isFirstChild: (i==0),
				})
			}
		}
	);

	return childrenWithProps;
}

export default Sections;