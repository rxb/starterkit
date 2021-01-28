import React, { useEffect, useState, useContext } from 'react';
import { MEDIA_QUERIES } from '../designConstants';

const MediaContext = React.createContext({});

export const initMediaProvider = () => {

	return ({children}) => {

		if ( typeof window === 'undefined' || !window.matchMedia ) {
			return <>children</>;
		}

		const [matches, setMatches] = useState({});

		useEffect(()=>{
			console.log('adding listeners');
			Object.entries(MEDIA_QUERIES).forEach(([key, value]) => {
				console.log(`${key}: ${value}`);
				const matchMediaValue = window.matchMedia(value);
				matchMediaValue.addListener(mq => {
					console.log('heard listener!');
					setMatches(prevState => ({
					  ...prevState,
					  [key]: mq.matches,
					}))
				})
			});
			
		}, []);

		return <MediaContext.Provider value={matches}>{children}</MediaContext.Provider>
	}
}


export const useMediaContext = () => {
	return useContext(MediaContext);
};