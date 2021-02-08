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
            note: this.props.currentDot.note ? this.props.currentDot.note : '',
        }
        this.handleClose = this.handleClose.bind(this);
        this.onChangeParentType = this.onChangeParentType.bind(this);
        this.handleChangeNote = this.handleChangeNote.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
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
        this.props.setCurrentParentType(event.target.value);
    }

    handleChangeNote(event) {
        this.setState({note: event.target.value});
    }

    handleSave() {
        this.props.handleSave({note: this.state.note});
    }

    onKeyPress(e) {
        if(e.key == 'Enter') {
            this.handleSave();
        }
    }

    render() {
        const {posY, posX, dotRadius, show, handleClose, parentTypes} = this.props; 
    
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
                                <Form.Control type="text" value={this.state.note} placeholder="Notes..." onChange={this.handleChangeNote} onKeyPress={this.onKeyPress}/>
                            </Form>
                        </Card.Body>
                        <Card.Footer>
                        <Button variant="secondary" onClick={handleClose}>Delete</Button>
                            <Button variant="secondary" onClick={handleClose}>Close</Button>
                            <Button variant="primary" onClick={this.handleSave}>Save</Button>  
                        </Card.Footer> 
                    </Card>
                    </div>
                 : null}
                
            </div>);
    }
}

export default GeoCoordSelector; 