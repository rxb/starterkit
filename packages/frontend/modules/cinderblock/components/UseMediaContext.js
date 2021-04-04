import React, { useEffect, useState, useContext } from 'react';

export const MediaContext = React.createContext({});

export const initMediaProvider = (mediaQueries={}) => {

	return ({children}) => {

		if ( typeof window === 'undefined' || !window.matchMedia ) {
			return <>{children}</>;
		}

		const [matches, setMatches] = useState({});

		useEffect(()=>{
			const initialState = {};
			Object.entries(mediaQueries).forEach(([key, value]) => {
				const matchMediaValue = window.matchMedia(value);
				initialState[key] = matchMediaValue.matches;
				matchMediaValue.addListener(mq => {
					setMatches(prevState => ({
					  ...prevState,
					  [key]: mq.matches,
					}))
				});
				setMatches(initialState);
			});
			
		}, []);

		return <MediaContext.Provider value={matches}>{children}</MediaContext.Provider>
	}
}

export const useMediaContext = () => {
	return useContext(MediaContext);
};