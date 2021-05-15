import React, { Fragment, useContext } from 'react';

import {
	Button,
	Card,
	Chunk,
	Image,
	Sectionless,
	Text,
	ThemeContext
} from 'cinderblock';


const ShowCard = (props) => {
	const { styles, METRICS, SWATCHES } = useContext(ThemeContext);

	const {
		show
	} = props;

	return (
		<Card>
			<Image source={{ uri: show.photoUrl }} style={{
				height: 200,
			}} />
			<Sectionless>
				<Chunk>
					<Text weight="strong" numberOfLines={1}>{show.title}</Text>
					<Text numberOfLines={2} type="small" color="secondary">A show that you might like</Text>
				</Chunk>
			</Sectionless>
		</Card>
	);
}

export default ShowCard;