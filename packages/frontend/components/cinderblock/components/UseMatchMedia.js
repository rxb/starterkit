import React, { useEffect, useState } from 'react';

import { MEDIA_QUERIES } from '../designConstants';

// TODO: 
// consider adding param for custom media queries passed in to useMatchMedia beyond standard breakpoints

function useMatchMedia() {

	const [queries, setQueries] = useState({});
	const [matches, setMatches] = useState({});

	const mediaQueryKeys = Object.keys(MEDIA_QUERIES);

	const handleMediaChange = () => {
		const tempMatches = {};
		mediaQueryKeys.forEach(key => {
			tempMatches[key] = queries[key].matches;
		});
		setMatches(tempMatches);
	}

	const tempQueries;
	mediaQueryKeys.forEach(key => {
		const query = window.matchMedia(MEDIA_QUERIES[key]);
		query.addListener(handleMediaChange)
		tempQueries[key] = query;
	});
	setQueries( tempQueries );
	
	// check initial values
	handleMediaChange();

	// return object of state-ly variables 
	return matches;
}

export default useMatchMedia;