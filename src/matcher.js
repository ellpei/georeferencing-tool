import './styles/matcher.css';
import './styles/image-dots.css';
import React from 'react';
import {Form, Button} from 'react-bootstrap';

import ReactImageDot from './image-dots/ReactImageDot';
import DotsInfo from './image-dots/DotsInfo';

class Matcher extends React.Component {
    
    constructor(props) {
        super(props);
        this.initialDots = [{ x: 35, y: 32 }];
        this.state = {
            title: this.props.resort.title,
            src: this.props.resort.src,
            dimensions: {},
            x: 0,
            y: 0,
            pistePoints: {},
            pisteInputValue: "",
            currentPiste: "",
            dots: this.initialDots,
            windowWidth: window.innerWidth*0.98,
        }
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onLoadPisteMap = this.onLoadPisteMap.bind(this);
    }

    addDot = (dot) => {
        let dict = this.state.pistePoints;
        let currentPiste = this.state.currentPiste; 
        let dim = this.state.dimensions;

        if(dict[currentPiste]) {
            dict[currentPiste].push({
                "x":(dot.x/dim.renderWidth)*dim.realWidth, 
                "y": (dot.y/dim.renderHeight)*dim.realHeight,
                "long": 0,
                "lat": 0,
                "note": "",
            });
            this.setState({
              dots: [
                ...this.state.dots,
                dot,
              ],
            });
        } else {
            alert('Please select a piste');
        }
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

    onKeyUp(e) {
        if (e.charCode === 13) {
            let dict = this.state.pistePoints;
            e.preventDefault(); 
            let pisteName = e.target.value;
            if(!(pisteName in dict)) {
                dict[pisteName] = [];
            } else {
                console.log("piste name already exists");
            }
            this.setState({currentPiste: pisteName, pisteInputValue: ""});
        }
    }

    handleResize = () => {
        this.setState({ windowWidth: window.innerWidth*0.98 });
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }
      
    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
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

    printPistePoints() {
        let pPoints = this.state.pistePoints;
        let pNames = Object.keys(pPoints);
        
        return (<ul>{pNames.map((pName, i) => 
            <li key={i}>{pName}: {pPoints[pName].map( (p, i) =>
                <span key={i}>({p.x.toFixed(2)}, {p.y.toFixed(2)}):({p.long}, {p.lat}), </span>
            )}</li>)}
            </ul>);
    }

    render() {
        const { dots, pistePoints } = this.state;
        const dim = this.state.dimensions;

        return (
            <div id="matcher">
                <ReactImageDot
                backgroundImageUrl={this.state.src}
                onLoadMap={this.onLoadPisteMap}
                width={this.state.windowWidth}
                dots={dots}
                deleteDot={this.deleteDot}
                addDot={this.addDot}
                dotRadius={6}
                dotStyles={{
                    backgroundColor: 'red',
                    boxShadow: '0 2px 4px gray',
                }} 
                />
                <p>Render dim w:{dim.renderWidth} h:{dim.renderHeight}</p>
                <p>Real dim w:{dim.realWidth} h:{dim.realHeight}</p>
                <button onClick={this.resetDots}>Reset</button>
                {<DotsInfo
                width={dim.renderWidth}
                height={dim.renderHeight}
                realHeight={dim.realHeight}
                realWidth={dim.realWidth}
                dots={dots}
                deleteDot={this.deleteDot}
                />}
                
                <p>Dots</p>
                <p>{dots.map((dot, i) => <span key={i}>({dot.x}, {dot.y}), </span>)}</p>
                
                <p>Piste points</p>
                {this.printPistePoints()}
                {/*Object.keys(this.state.pistePoints)
                    .map(x => <span key={x}>{x}: </span>)*/} 

                <br/>
                current piste: {this.state.currentPiste}
                
                <div className="piste-input">
                    <Form>
                        <Form.Control type="text" 
                        value={this.state.pisteInputValue} 
                        onChange={e => this.setState({pisteInputValue: e.target.value})} 
                        placeholder="Add piste" onKeyPress={this.onKeyUp}/>
                    </Form>
                    <br/>
                </div>
                <div className="piste-button-container">
                    {Object.keys(pistePoints)
                    .map(x => <Button key={x} onClick={() => this.setState({currentPiste: x})}>{x}</Button>)}
                </div>

            </div>);
    }
}

export default Matcher; 