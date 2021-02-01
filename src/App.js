import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MapForm from './mapForm.js';
import Matcher from './matcher.js';
import images from './images';
import Docs from './docs.js';
import About from './about.js';
import {Navbar, Nav} from 'react-bootstrap'; 
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
  } from "react-router-dom";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resortIndex: -1,
        };
    }
    setResort = (choice) => {
        this.setState({resortIndex: choice});
        console.log("Resortindex: " + choice);
    }

    render() {
        return (
            <div className="App">
            <Router>
                <Navbar bg="light" variant="light">
                    <Navbar.Brand href="/">
                        <div className="header">
                            <h1>GeoMatcher</h1>
                        </div>
                    </Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/docs">Docs</Nav.Link>
                        <Nav.Link href="/about">About</Nav.Link>
                    </Nav>
                </Navbar>
                <Switch>
                    <Route exact path="/">
                        <MapForm resorts={images} onSearch={this.setResort}/>
                    </Route>
                    <Route path="/docs">
                        <Docs />
                    </Route>
                    <Route path="/about">
                        <About />
                    </Route>
                    <Route path="/matcher">
                        {this.state.resortIndex !== -1 ? 
                            <Matcher resort={images[this.state.resortIndex]}></Matcher> :
                        <Redirect to={{ pathname: '/', state: { from: this.props.location } }} />}
                    </Route>
                </Switch>
            </Router>
                
              {/*this.state.resortIndex === -1 ? 
                <MapForm resorts={images} onSearch={this.setResort}></MapForm> : 
                <Matcher resort={images[this.state.resortIndex]}></Matcher>*/}
            </div>
        );
    }
    
  
}


export default App;
