import './styles/mapForm.css';
import React from 'react';
import {Container, Form} from 'react-bootstrap';
import {Link} from "react-router-dom";

class MapForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            val: this.props.resorts[0].id,
            uploadedMap: null,
            useGeoCoords: true,
        }
    }

    handleDropdownChange = (e) => {
        this.setState({val: e.target.value});
    }

    handleStart = () => {
        let { uploadedMap, val, useGeoCoords } = this.state;
        if(uploadedMap == null) {
            this.props.onSelect(val, useGeoCoords);
        } else {
            this.props.onUpload(uploadedMap, useGeoCoords);
        }
    }

    handleFileChange = (e) => {
        if(e.target.files[0] == null) return
        this.setState({
            uploadedMap: URL.createObjectURL(e.target.files[0])
        })
    }

    render() {
        var toggleCheckBox = () =>  this.setState({useGeoCoords: !this.state.useGeoCoords});
        return (
            <div id="mapform" >
                <div className="vertical-center">
                    <Container className="selectcontainer">
                        <Form>
                            <Form.Label className="form-title">Welcome!</Form.Label>
                            <Form.Group controlId="mode">
                                <Form.Label>Select coordinate collection mode</Form.Label><br/>
                                <Form.Check
                                custom
                                inline
                                type='radio'
                                id={0}
                                label='Geographic and map coordinates'
                                checked={this.state.useGeoCoords}
                                onChange={toggleCheckBox}
                                />

                                <Form.Check
                                custom
                                inline
                                type='radio'
                                id={1}
                                label='Only map coordinates'
                                checked={!this.state.useGeoCoords}
                                onChange={toggleCheckBox}
                                />
                            </Form.Group>


                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Select or upload ski map</Form.Label>
                                <Form.Control as="select"
                                onChange={this.handleDropdownChange}>
                                {this.props.resorts.map((resort => (
                                    <option key={resort.title} value={resort.id}>{resort.title}</option>
                                )))}
                                </Form.Control>
                                <br/>
                                <Form.File onChange={this.handleFileChange}
                                multiple={false}
                                accept="image/png, image/jpeg"/>
                                <br/>
                                {this.state.uploadedMap ?
                                    <div className="image-wrapper">
                                        <img src={this.state.uploadedMap} alt="preview"/>
                                        <br/><br/>
                                    </div> : null }
                                </Form.Group>
                                <Link to="/matcher" onClick={this.handleStart} className="btn btn-primary">Start!</Link>
                        </Form>
                    </Container>
                </div>
            </div>
        );
    }

}
export default MapForm;
