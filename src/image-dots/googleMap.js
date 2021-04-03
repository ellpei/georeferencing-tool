import '../styles/googleMaps.css';
import React from 'react';

function loadJS(src) {
    let script = window.document.querySelector(`script[src="${src}"]`);
    if(script) {
        script.remove();
    }
    script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    window.document.body.appendChild(script);
}

var markers = [];

class GoogleMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            center: {
                lat: this.props.currentDot.lat || 63.42833519737357,
                lng: this.props.currentDot.lng || 13.078345603820786,
            },
            zoom: 13,
            map: {},
            currentMarker: {},
            mapLoaded: false,
        };
        this.apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
        this.mapRef = React.createRef();
    }

    getSnapshotBeforeUpdate(prevProps) {
        return { markerUpdateRequired: prevProps.dots !== this.props.dots };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
          if (snapshot.markerUpdateRequired) {
              this.plotDotMarkers()
          }
    }

    componentDidMount() {
        this.loadMap();
    }

    loadMap = () => {
        window.initMap = this.initMap;
        loadJS('https://maps.googleapis.com/maps/api/js?key='+this.apiKey+'&callback=initMap');
    }

    initMap = () => {
        const google = window.google;
        let map = this.mapRef;
        let {center, zoom} = this.state;

        map = new google.maps.Map(this.mapRef.current, {
            center: center,
            zoom: zoom,
        });
        this.setState({map: map})

        let currentMarker = new google.maps.Marker({
            position: center,
            map,
            title: "Marker",
        });
        this.setState({currentMarker: currentMarker});

        map.addListener("click", (mapsMouseEvent) => {
            currentMarker.setPosition(mapsMouseEvent.latLng);
            this.props.setLatLong(mapsMouseEvent.latLng);
            map.panTo(mapsMouseEvent.latLng);
        });
        this.plotDotMarkers()
    }

    plotDotMarkers = () => {
        // plot all the other markers
        const google = window.google;
        let map = this.state.map;
        markers.map(m => m.setMap(null));
        markers = [];
        var dot;
        for(dot of this.props.dots) {
          var latLng = new google.maps.LatLng(dot.lat,dot.lng);
          let m = new google.maps.Marker({
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
          markers.push(m);
        }
    }

    render() {
        return (<div id="google-map" style={{ height: '40vh', width: '100%' }}>
                  <div ref={this.mapRef} id="map"></div>
                </div>
        );
    }
}


export default GoogleMap;
