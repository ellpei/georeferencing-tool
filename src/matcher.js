import './matcher.css';
import React from 'react';
import {Container, Row, Col, Form} from 'react-bootstrap';

class Matcher extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.resort.title,
            src: this.props.resort.src,
            dimensions: {},
            x: 0,
            y: 0,
            pistepoints: [],
            pisteInputValue: "",
        }
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onLoadPisteMap = this.onLoadPisteMap.bind(this);
    }

    _onMouseMove(e) {
        let dim = this.state.dimensions;
        let x = (e.nativeEvent.offsetX / dim.renderWidth) * dim.realWidth;
        let y = (e.nativeEvent.offsetY / dim.renderHeight) * dim.realHeight;

        this.setState({x: x.toFixed(2), y: y.toFixed(2)});
    }

    _onMouseDown(e) {
        console.log('clicked on ' + this.state.x + ', ' + this.state.y);
    }

    onKeyUp(e) {
        if (e.charCode === 13) {
            e.preventDefault(); 
            let pisteName = e.target.value;
            this.setState({ pisteInputValue: pisteName });
            const newList = this.state.pistepoints.concat({"name": pisteName,});
            this.setState({pistepoints: newList});
        }
    }

    onLoadPisteMap({target: img}) {
        this.setState({
            dimensions: {
                renderWidth: img.offsetWidth, 
                renderHeight: img.offsetHeight,
                realWidth: img.naturalWidth,
                realHeight: img.naturalHeight,
            }
        });
    }

    render() {
        return (
            <div id="matcher">
                <h2>{this.state.title}</h2>
                RenderDim: {this.state.dimensions.renderWidth} x {this.state.dimensions.renderHeight}
                <br/>
                RealDim: {this.state.dimensions.realWidth} x {this.state.dimensions.realHeight}
                <Container>
                    <Row>
                        <Col>
                            <img src={this.state.src} 
                            alt={this.state.title} width="80%" 
                            onMouseMove={this._onMouseMove.bind(this)}
                            onMouseDown={this._onMouseDown.bind(this)}
                            onLoad={this.onLoadPisteMap}
                            />
                            <br/>
                            (x: {this.state.x}, y: {this.state.y})
                            <div className="piste-input">
                                <Form>
                                    <Form.Control type="text" placeholder="Add piste" onKeyPress={this.onKeyUp}/>
                                    <span>Input value is : {this.state.pisteInputValue}</span>
                                </Form>
                            </div>
                            
                        </Col>
                    </Row>
                </Container>
                <ul>
                hello {Object.keys(this.state.pistepoints)}
                </ul>
            </div>);
    }
}

export default Matcher; 