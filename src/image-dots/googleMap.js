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
        this.state = {
            center: {
                lat: this.props.currentDot.lat,
                lng: this.props.currentDot.lng,
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


        // plot all the other markers
        var dot;
        for(dot of this.props.dots) {
          var latLng = new google.maps.LatLng(dot.lat,dot.lng);
          var m = new google.maps.Marker({
              position: latLng,
              map,
              title: JSON.stringify(dot.parent),
              icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: '#00F',
                  fillOpacity: 0.6,
                  strokeColor: '#00A',
                  strokeOpacity: 0.9,
                  strokeWeight: 1,
                  scale: 4
              }
          });
        }
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
