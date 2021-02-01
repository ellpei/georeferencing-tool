import './matcher.css';
import React from 'react';
import {Form, Button} from 'react-bootstrap';

class Matcher extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.resort.title,
            src: this.props.resort.src,
            dimensions: {},
            x: 0,
            y: 0,
            pistePoints: {},
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
            let dict = this.state.pistePoints;
            e.preventDefault(); 
            let pisteName = e.target.value;
            if(!(pisteName in dict)) {
                dict[pisteName] = {};
            } else {
                console.log("piste name already exists");
            }
            this.setState({pisteInputValue: ""});
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
                        <Form.Control type="text" 
                        value={this.state.pisteInputValue} 
                        onChange={e => this.setState({pisteInputValue: e.target.value})} 
                        placeholder="Add piste" onKeyPress={this.onKeyUp}/>
                    </Form>
                </div>
                <div className="piste-button-container">
                    {Object.keys(this.state.pistePoints)
                    .map(x => <Button key={x}>{x}</Button>)}
                </div>
            </div>);
    }
}

export default Matcher; 