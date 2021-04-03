import React, {Fragment} from 'react';
import Text from './Text';
import {View} from '../primitives';

const Map = () => <View />;
export default Map;

/*
// LEAFLET MAP
// Leaflet is very much not react-like
// It doesn't even use modules
// But here's a wrapper
class Map extends React.Component {

	mapRef = React.createRef();


	static defaultProps = {
        center: [0,0],
        zoom: 1
    }

	componentDidMount() {

		// DIV needs to wait to be mounted completely
		setTimeout( () => {
			import('leaflet').then( () => {
				// this is some crazy shit
				// but leaflet really wants to be global
				// hopefully this isn't a problem later
				require('leaflet.markercluster');

				this.map = L.map(this.mapRef.current, {
					center: this.props.center,
					zoom: this.props.zoom,
					layers: [
						L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
							attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						}),
					]
				});
				this.layerGroup = L.featureGroup().addTo(this.map);
		      	this.drawMarkers(this.props.markers);
		 	});
		}, 100);

	}

	drawMarkers(items = []){
		this.layerGroup.clearLayers();
		let targetGroup = this.layerGroup;
		if(this.props.cluster){
			const markerClusterGroup = L.markerClusterGroup({maxClusterRadius: 50, removeOutsideVisibleBounds: true});
			markerClusterGroup.addTo(this.layerGroup);
			targetGroup = markerClusterGroup;
		}

		items.forEach((m, i) => {
			const marker = L.marker({lat: m.lat, lon: m.lon});
			if(m.title){
				marker.bindPopup(m.title);
			}
			marker.addTo(targetGroup);
		});

		if(this.props.fitBounds && items.length > 0){
			this.map.fitBounds( items.map( m => ([m.lat, m.lon]) )  );
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.markers !== prevProps.markers && this.layerGroup) {
			this.drawMarkers(this.props.markers);
		}
	}

	render(){
		const {
			children,
			markers,
			cluster,
			style,
			...other
		} = this.props
		return(
			<div ref={this.mapRef} style={style} {...other}>{children}</div>
		);
	}

}

export default Map;

*/