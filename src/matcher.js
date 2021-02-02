import './styles/matcher.css';
import './styles/image-dots.css';
import React from 'react';
import {Form, Button} from 'react-bootstrap';

import ReactImageDot from './image-dots/ReactImageDot';
import DotsInfo from './image-dots/DotsInfo';

class Matcher extends React.Component {
    
    constructor(props) {
        super(props);
        this.initialDots = [{ x: 35, y: 32 }, { x: 96, y: 120 }];
        this.state = {
            title: this.props.resort.title,
            src: this.props.resort.src,
            dimensions: {},
            x: 0,
            y: 0,
            pistePoints: {},
            pisteInputValue: "",
            dots: this.initialDots,
            windowWidth: window.innerWidth*0.98,
        }
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onLoadPisteMap = this.onLoadPisteMap.bind(this);
    }

    addDot = (dot) => {
        this.setState({
          dots: [
            ...this.state.dots,
            dot,
          ],
        });
    }
    
    deleteDot = (index) => {
        this.setState({
            dots: this.state.dots.filter((e, i) => {
                return i !== index;
            }),
        });
    }
    
    resetDots = () => {
        this.setState({
            dots: this.initialDots,
        });
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

    handleResize = () => {
        this.setState({ windowWidth: window.innerWidth*0.98 });
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }
      
    componentWillUnmount() {
        window.addEventListener("resize", this.handleResize);
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
        const { dots } = this.state;
        const dim = this.state.dimensions;
        const wW = this.state.windowWidth;
        const wH = this.state.windowHeight;

        return (
            <div id="matcher">
                <img src={this.state.src} 
                alt={this.state.title} width="100%" 
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

                <ReactImageDot
                backgroundImageUrl={this.state.src}
                width={wW}
                height={wH}
                dots={dots}
                deleteDot={this.deleteDot}
                addDot={this.addDot}
                dotRadius={6}
                dotStyles={{
                    backgroundColor: 'red',
                    boxShadow: '0 2px 4px gray',
                }} 
                />
                <button onClick={this.resetDots}>Reset</button>
                {<DotsInfo
                height={480}
                width={480}
                realHeight={dim.realHeight}
                realWidth={dim.realWidth}
                dots={dots}
                deleteDot={this.deleteDot}
                />}
            </div>);
    }
}

export default Matcher; 