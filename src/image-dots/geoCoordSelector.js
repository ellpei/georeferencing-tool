import '../styles/geoCoordSelector.css';
import React from 'react';
import Backdrop from './backdrop.js';
import Dot from './Dot';
import {Button} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';


class GeoCoordSelector extends React.Component {
    
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.setState({show: false});
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
                                Card
                            </Card.Text>
                            <Button variant="secondary" onClick={handleDelete}>Delete</Button>
                            <Button variant="secondary" onClick={handleClose}>Close</Button>
                            <Button variant="primary" onClick={handleClose}>Save</Button>                        
                        </Card.Body>
                    </Card>
                    </div>
                 : null}
                
            </div>);
    }
}

export default GeoCoordSelector; 