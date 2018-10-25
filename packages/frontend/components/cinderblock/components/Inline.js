import React from 'react';
import { View } from '../primitives';
import styles from '../styles/styles';


/*

INLINE
a simple component to replicate the feel of display: inline
in a world where flexbox is the only way to lay things out
may not work exactly as expected with non-body text sizes

*/

const Inline = (props) => {
	const {
		children,
		style,
	} = props;

	const wrappedChildren = React.Children.map(children,
		(child, i) => {
			// "if" statements can return null components, so needs to check
			if(React.isValidElement(child)){
				return (
					<View style={[styles.inlineItem, (i==0 ? styles['inlineItem--firstChild'] : {}), style]}>
						{child}
					</View>
				);
			}
		}
	);


	return(
		<View style={styles.inline}>
			{wrappedChildren}
		</View>
	);
}

export default Inline;