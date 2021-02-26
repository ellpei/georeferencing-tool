import '../styles/geoCoordSelector.css';
import React from 'react';
import Backdrop from './backdrop.js';
import {Button, Form, Row, Col} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Creatable from 'react-select/creatable';
import GoogleMap from './googleMap.js';

class GeoCoordSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pisteInputValue: "",
        }
        this.handleClose = this.handleClose.bind(this);
        this.onChangeParentType = this.onChangeParentType.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    handleClose() {
        this.setState({show: false});
    }

    getValueLabelList(parents) {
        if(Array.isArray(parents)) {
            let res = [];
            parents.map(x => res.push({value: x, label: x}));
            return res;
        }
        return [{value: parents, label: parents}];
    }

    onChangeParentType(event) {
        this.props.setCurrentParentType(event.target.value);
    }

    onKeyPress(e) {
        if(e.key === 'Enter') {
            this.props.handleSave();
        }
    }

    setLatLong = (pos) => {
        this.props.updateCurrentDot({lat: pos.lat(), lng: pos.lng()});
    }

    render() {
        const {show, handleClose, parentTypes} = this.props;
        const wW = window.innerWidth;
        var left = this.props.posX > wW/2 ? 0 : Math.round(wW*0.525);
        return (
            <div id="geoCoordSelector">
                {show ?
                    <div className="coord-selector">
                    <Backdrop show={show} clicked={handleClose} />

                    <Card className="modal-body"
                    style={{
                        top: 10,
                        left: left}}>
                        <Card.Body>
                            <Card.Title>Select Coordinates</Card.Title>
                            <Card.Text>
                            </Card.Text>
                            <Form>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">x:</Form.Label>
                                    <Col sm="3">
                                        <Form.Control type="number" defaultValue={this.props.currentDot.x}
                                        onChange={(e) => {this.props.updateCurrentDot({x: e.target.value})}}/>
                                    </Col>
                                    <Form.Label column sm="3">y:</Form.Label>
                                    <Col sm="3">
                                        <Form.Control type="number" defaultValue={this.props.currentDot.y}
                                        onChange={(e) => {this.props.updateCurrentDot({y: e.target.value})}}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">lat:</Form.Label>
                                    <Form.Label column sm="3">
                                        {this.props.currentDot.lat}
                                    </Form.Label>
                                    <Form.Label column sm="3">lng:</Form.Label>
                                    <Form.Label column sm="3">
                                        {this.props.currentDot.lng}
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group>
                                    <GoogleMap
                                    setLatLong={this.setLatLong}
                                    currentDot={this.props.currentDot}
                                    dots={this.props.dots}></GoogleMap>
                                </Form.Group>
                                <div>
                                    {parentTypes.map(type =>
                                        <span key={type}>
                                            <input type="radio" value={type}
                                            onChange={this.onChangeParentType}
                                            name="type" className="parent-type-selector"
                                            checked={this.props.currentParentType === type}/>{type}
                                        </span>)}
                                </div>
                                {this.props.currentParentType === 'Terrain' ? null :
                                  <Form.Group>
                                    Select or add parent:
                                    <Creatable isMulti={true}
                                    onChange={(x) => this.props.setCurrentParent(x)}
                                    defaultValue={this.getValueLabelList(this.props.currentParent)}
                                    options={this.getValueLabelList(this.props.parents)}
                                    />
                                  </Form.Group>}
                                <Form.Control type="text"
                                defaultValue={this.props.currentDot.note}
                                placeholder="Notes..."
                                onChange={(e) => this.props.updateCurrentDot({note: e.target.value})}
                                onKeyPress={this.onKeyPress}/>
                            </Form>
                        </Card.Body>
                        <Card.Footer>
                        <Button variant="secondary" onClick={handleClose}>Delete</Button>
                            <Button variant="secondary" onClick={handleClose}>Close</Button>
                            <Button variant="primary" onClick={this.props.handleSave}>Save</Button>
                        </Card.Footer>
                    </Card>
                    </div>
                 : null}

            </div>);
    }
}

export default GeoCoordSelector;
