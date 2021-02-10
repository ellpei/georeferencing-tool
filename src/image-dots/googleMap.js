import '../styles/googleMaps.css';
import React from 'react';

function loadJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
}

class GoogleMap extends React.Component {

    constructor(props) {
        super(props);
        let {lat, lng} = this.props.currentDot;
        this.state = {
            center: {
                lat: lat !== undefined ? lat : 63.42833519737357,
                lng: lng !== undefined ? lng : 13.078345603820786,
            },
            zoom: 13,
            marker: {},
        };
        this.apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
        this.mapRef = React.createRef(); 
    }

    componentDidMount() {
        window.initMap = this.initMap;
        loadJS('https://maps.googleapis.com/maps/api/js?key='+this.apiKey+'&callback=initMap')
    }

    initMap = () => {
        const google = window.google;
        let map = this.mapRef; 
        let {center, zoom} = this.state;

        map = new google.maps.Map(this.mapRef.current, {
            center: center,
            zoom: zoom,
        });

        let marker = new google.maps.Marker({
            position: center,
            map,
            title: "Marker",
        });
        this.setState({marker: marker});
        
        map.addListener("click", (mapsMouseEvent) => {
            marker.setPosition(mapsMouseEvent.latLng);
            this.props.setLatLong(mapsMouseEvent.latLng);
            map.panTo(mapsMouseEvent.latLng);
        });
    }

    render() {
        return (
            <div id="google-map" style={{ height: '40vh', width: '100%' }}>
              <div ref={this.mapRef} id="map"></div>
            </div>
        );
    }
}


export default GoogleMap;