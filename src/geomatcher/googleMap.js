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
var mapTriangles = [];

class GoogleMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            zoom: 13,
            map: {},
            currentMarker: {},
            mapLoaded: false,
            google: {},
        };
        this.apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
        this.mapRef = React.createRef();
    }

    getSnapshotBeforeUpdate(prevProps) {
        return {
            markerUpdateRequired: prevProps.currentDot !== this.props.currentDot,
            dotMarkersUpdateRequired: prevProps.dots !== this.props.dots,
            triangleUpdateRequired: prevProps.triangles !== this.props.triangles,
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(snapshot.markerUpdateRequired) {
            this.updateCurrentMarker();
        }
        if (snapshot.dotMarkersUpdateRequired) {
            this.plotDotMarkers();
        }
        if(snapshot.triangleUpdateRequired) {
            this.drawTriangles();
        }
    }

    componentDidMount() {
        this.loadMap();
    }

    loadMap = () => {
        window.initMap = this.initMap;
        loadJS('https://maps.googleapis.com/maps/api/js?key='+this.apiKey+'&callback=initMap');
    }

    getCenter = () => {
        return {
            lat: parseFloat(this.props.currentDot.lat) || 63.42833519737357,
            lng: parseFloat(this.props.currentDot.lng) || 13.078345603820786
        };
    }

    initMap = () => {
        const google = window.google;
        let map = this.mapRef;
        let {zoom} = this.state;

        map = new google.maps.Map(this.mapRef.current, {
            center: this.getCenter(),
            zoom: zoom,
            mapTypeId: google.maps.MapTypeId.HYBRID
        });

        let currentMarker = new google.maps.Marker({
            position: this.getCenter(),
            map,
            title: "Marker",
        });
        this.setState({
            map: map,
            google: google,
            currentMarker: currentMarker
        });

        map.addListener("click", (mapsMouseEvent) => {
            currentMarker.setPosition(mapsMouseEvent.latLng);
            this.props.setLatLong(mapsMouseEvent.latLng);
            map.panTo(mapsMouseEvent.latLng);
        });
        this.plotDotMarkers();
        this.drawTriangles();
    }

    updateCurrentMarker = () => {
        const {map, currentMarker} = this.state;
        let center = this.getCenter();
        currentMarker.setPosition(center);
        map.setCenter(center);
    }

    plotDotMarkers = () => {
        const {google, map} = this.state;
        markers.map(m => m.setMap(null));
        markers = this.props.dots.map(dot => {
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
            return m;
        });
    }

    drawTriangles = () => {
        const {google, map} = this.state;
        mapTriangles.map(t => t.setMap(null));
        mapTriangles = this.props.triangles.map(t => {
            const triangleCoords = [
              { lat: t.p1.lat, lng: t.p1.lng },
              { lat: t.p2.lat, lng: t.p2.lng },
              { lat: t.p3.lat, lng: t.p3.lng },
              { lat: t.p1.lat, lng: t.p1.lng },
            ];
            const p = new google.maps.Polyline({
              path: triangleCoords,
              strokeColor: "#000000",
              strokeOpacity: 0.8,
              strokeWeight: 1,
            });
            p.setMap(map);
            return p;
        });
    }

    render() {
        return (<div id="google-map" style={{ height: '40vh', width: '100%' }}>
                  <div ref={this.mapRef} id="map"></div>
                </div>
        );
    }
}


export default GoogleMap;
