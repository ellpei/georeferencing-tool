import './styles/App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MapForm from './mapForm.js';
import CoordinateMatcher from './geomatcher/CoordinateMatcher.js';
import MapCoordCollector from './mapcoords-only/MapCoordCollector.js';
import images from './images';
import Docs from './docs.js';
import About from './about.js';
import {Navbar, Nav} from 'react-bootstrap';
import {
    HashRouter as Router,
    Switch,
    Route,
    Redirect,
  } from "react-router-dom";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resortObject: null,
            useGeoCoords: true,
        };
    }

    setResort = (choice, useGeoCoords) => {
        this.setState({
            resortObject: images[choice],
            useGeoCoords: useGeoCoords
        });
    }

    uploadMap = (file, useGeoCoords) => {
        let filename = file.name;
        let title = filename.substr(0, filename.lastIndexOf('.'));
        this.setState({
            resortObject: { src: file.url, title: title},
            useGeoCoords: useGeoCoords,
        });
    }

    render() {
        return (
            <div className="App">
                <Router>
                    <Navbar className="navbar" bg="light" variant="light">
                        <Navbar.Brand href="/">
                            <div className="header">
                                <h1>Georeferencing Tool</h1>
                            </div>
                        </Navbar.Brand>
                        <Nav className="mr-auto">
                            <Nav.Link href="/docs">Docs</Nav.Link>
                            <Nav.Link href="/about">About</Nav.Link>
                        </Nav>
                    </Navbar>
                    <Switch>
                        <Route exact path="/">
                            <MapForm
                            resorts={images}
                            onSelect={this.setResort}
                            onUpload={this.uploadMap}/>
                        </Route>
                        <Route path="/docs">
                            <Docs />
                        </Route>
                        <Route path="/about">
                            <About />
                        </Route>
                        <Route path="/matcher">
                        {(() => {
                              if (!this.state.resortObject)
                                 return <Redirect to={{ pathname: '/', state: { from: this.props.location } }} />
                              else if (this.state.useGeoCoords)
                                 return <CoordinateMatcher resort={this.state.resortObject}/>
                              else
                                 return <MapCoordCollector resort={this.state.resortObject}/>
                          })()}


                            {/*this.state.resortObject ?

                                <Matcher
                                resort={this.state.resortObject}/> :
                                <Redirect to={{ pathname: '/', state: { from: this.props.location } }} />*/}
                        </Route>
                    </Switch>
                </Router>
            </div>
        );
    }


}


export default App;
