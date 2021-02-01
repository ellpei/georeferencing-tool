import React from 'react';
import {Container, Row, Col, Form} from 'react-bootstrap';

class Matcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.resort.title,
            src: this.props.resort.src,
            x: 0,
            y: 0,
            pistepoints: {},
            pisteInputValue: "",
        }
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    _onMouseMove(e) {
        this.setState({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
    }

    _onMouseDown(e) {
        console.log('clicked on ' + this.state.x + ', ' + this.state.y);
    }

    onKeyUp(e) {
        if (e.charCode === 13) {
            e.preventDefault(); 
            this.setState({ pisteInputValue: e.target.value });
        }
    }

    render() {
        return (
            <div id="matcher">
                <h2>{this.state.title}</h2>
                <Container>
                    <Row width="100%">
                        <Col>
                            <img src={this.state.src} 
                            alt={this.state.title} width="100%" 
                            onMouseMove={this._onMouseMove.bind(this)}
                            onMouseDown={this._onMouseDown.bind(this)}
                            />
                        </Col>
                        <Col>google maps</Col>
                    </Row>
                    <Row>
                        <Col>(x: {this.state.x}, y: {this.state.y}) <br/>
                            <Form>
                                <Form.Control type="text" placeholder="Add piste" onKeyPress={this.onKeyUp}/>
                                <span>Input value is : {this.state.pisteInputValue}</span>
                            </Form>
                        </Col>
                        <Col></Col>
                    </Row>
                </Container>
            </div>);
    }
}

export default Matcher; 