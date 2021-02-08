import React from 'react';
import GoogleMapReact from 'google-map-react';

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
        this.handleApiLoaded = this.handleApiLoaded.bind(this);
    }

    handleApiLoaded = (map, maps) => {
        let marker = new maps.Marker({
            position: this.state.center,
            map,
            title: "Test",
        });
        this.setState({marker: marker});
        
        map.addListener("click", (mapsMouseEvent) => {
            marker.setPosition(mapsMouseEvent.latLng);
            this.props.setLatLong(mapsMouseEvent.latLng);
        });
    };

    render() {
        return (
            <div id="google-map" style={{ height: '40vh', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ 
                        key: this.apiKey, 
                        libraries: ['localContext', 'places']}}
                    defaultCenter={this.state.center}
                    defaultZoom={this.state.zoom}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
                    layerTypes={['TransitLayer']}
                >
              </GoogleMapReact>
            </div>
        );
    }
}

export default GoogleMap;