import '../styles/geoCoordSelector.css';
import React from 'react';
import Backdrop from '../image-dots/backdrop.js';
import {Button, Form, Row, Col} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

class InputModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pisteInputValue: "",
        }
    }

    handleClose = () => {
        this.setState({show: false});
    }

    onKeyPress = (e) => {
        if(e.key === 'Enter') {
            this.props.handleSave();
        }
    }

    render() {
        const {show, handleClose} = this.props;
        const wW = window.innerWidth;
        var left = this.props.posX > wW/2 ? 0 : Math.round(wW*0.525);
        return (
            <div id="geoCoordSelector" className={show ? "" : "hidden"}>

                    <div className="coord-selector">
                    <Backdrop show={show} clicked={handleClose} />
                    <Card className="modal-body"
                    style={{
                        top: 10,
                        left: left}}>
                        <Card.Body>
                            <Card.Title>Edit point data</Card.Title>
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
            </div>);
    }
}

export default InputModal;
