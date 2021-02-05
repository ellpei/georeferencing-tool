import '../styles/geoCoordSelector.css';
import React from 'react';
import Backdrop from './backdrop.js';
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
        this.onChangeParentType = this.onChangeParentType.bind(this);
    }

    handleClose() {
        this.setState({show: false});
    }

    getValueLabelList(list) {
        let res = [];
        list.map(x => res.push({value: x, label: x}));
        return res; 
    }

    onChangeParentType(event) {
        event.preventDefault(); 
        this.props.setCurrentParentType(event.target.value);
    }

    render() {
        const {posY, posX, dotRadius, show, handleClose, handleDelete, handleSave, parentTypes} = this.props; 
    
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
                            <Form>
                                Select or add parent:
                                <Creatable 
                                onCreateOption={this.setCurrentParent}
                                onChange={(x) => this.props.setCurrentParent(x.value)}
                                defaultValue={this.getValueLabelList([this.props.currentParent])}
                                options={this.getValueLabelList(this.props.parents)}/>
                                <div>
                                    {parentTypes.map(type => 
                                        <span key={type}>
                                            <input type="radio" value={type} 
                                            onChange={this.onChangeParentType} 
                                            name="type" className="parent-type-selector" 
                                            checked={this.props.currentParentType === type}/>{type}
                                        </span>)}
                                </div>
                            </Form>
                            
                                                 
                        </Card.Body>
                        <Card.Footer>
                        <Button variant="secondary" onClick={handleDelete}>Delete</Button>
                            <Button variant="secondary" onClick={handleClose}>Close</Button>
                            <Button variant="primary" onClick={handleSave}>Save</Button>  
                        </Card.Footer> 
                    </Card>
                    </div>
                 : null}
                
            </div>);
    }
}

export default GeoCoordSelector; 