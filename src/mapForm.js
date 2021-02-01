import './mapForm.css';
import React from 'react';
import {Container, Form} from 'react-bootstrap';
import {Link} from "react-router-dom";

class MapForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            val: this.props.resorts[0].id,
        }
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
    }

    handleDropdownChange(e) {
        this.setState({val: e.target.value});
    }

    render() {
        return (
            <div id="mapform" >
                <div className="vertical-center">
                    <Container className="selectcontainer">
                        <Form>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Select ski area</Form.Label>
                                <Form.Control as="select"
                                onChange={this.handleDropdownChange}>
                                {this.props.resorts.map((resort => (
                                    <option key={resort.title} value={resort.id}>{resort.title}</option>
                                )))}
                                </Form.Control>
                                <br/>
                                <Link to="/matcher" onClick={() => this.props.onSearch(this.state.val)} className="btn btn-primary">Start!</Link>
                            </Form.Group>
                        </Form>
                    </Container>
                </div>
            </div>
        );
    }
    
}
export default MapForm;