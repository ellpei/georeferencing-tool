import '../styles/geoCoordSelector.css';
import React from 'react';
import Backdrop from './backdrop.js';
import Dot from './Dot';
import {Button, Form} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Creatable from 'react-select/creatable';

class GeoCoordSelector extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            pisteInputValue: "",
        }
        this.handleClose = this.handleClose.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    handleClose() {
        this.setState({show: false});
    }

    // Called when adding pistes / lifts 
    onKeyUp(e) {
        if (e.charCode === 13) {
            e.preventDefault(); 
            let pisteName = e.target.value;
            this.props.setCurrentPiste(pisteName);
            this.setState({pisteInputValue: ""});
        }
    }

    getValueLabelList(list) {
        let res = [];
        list.map(x => res.push({value: x, label: x}));
        return res; 
    }

    render() {
        const {posY, posX, dotRadius, show, handleClose, handleDelete, dotStyles} = this.props; 
    
        return (
            <div id="geoCoordSelector">
                {show ? 
                    <div className="coord-selector">
                    <Backdrop show={show} clicked={handleClose} />
                    
                    <Card className="modal-body" 
                    style={{
                        top: Math.round(posY)-dotRadius,
                        left: Math.round(posX)+20}}>
                        <Card.Body>
                            <Card.Title>Select Coordinates</Card.Title>
                            <Card.Text>
                            
                            </Card.Text>
                            Select or add parent:
                            <Creatable 
                            onCreateOption={this.props.setCurrentPiste}
                            onChange={(x) => this.props.setCurrentPiste(x.value)}
                            defaultValue={this.getValueLabelList([this.props.currentPiste])}
                            options={this.getValueLabelList(this.props.parents)}
                        />
                                                 
                        </Card.Body>
                        <Card.Footer>
                        <Button variant="secondary" onClick={handleDelete}>Delete</Button>
                            <Button variant="secondary" onClick={handleClose}>Close</Button>
                            <Button variant="primary" onClick={handleClose}>Save</Button>  
                        </Card.Footer> 
                    </Card>
                    </div>
                 : null}
                
            </div>);
    }
}

export default GeoCoordSelector; 