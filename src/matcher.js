import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';

class Matcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.resort.title,
            src: this.props.resort.src,
        }
    }

    render() {
        return (
            <div id="matcher">
                <h2>{this.state.title}</h2>
                <Container>
                    <Row>
                        <Col>
                            <img src={this.state.src} alt={this.state.title} width="500px"/>
                        </Col>
                        <Col>google maps</Col>
                    </Row>
                </Container>
            </div>);
    }

}

export default Matcher; 