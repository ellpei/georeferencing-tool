import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MapForm from './mapForm.js';
import Matcher from './matcher.js';
import images from './images'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resortIndex: -1,
        };
    }
    setResort = (choice) => {
        this.setState({resortIndex: choice});
    }
    render() {
        return (
            <div className="App">
                <div className="header">
                    <h1>Georeferencing Tool</h1>
                </div>
              {this.state.resortIndex === -1 ? 
                <MapForm resorts={images} onSearch={this.setResort}></MapForm> : 
                <Matcher resort={images[this.state.resortIndex]}></Matcher>}
            </div>
        );
    }
  
}

export default App;
