import './styles/matcher.css';
import './styles/image-dots.css';
import React from 'react';
import {Form, Button} from 'react-bootstrap';

import FileForm from './fileForm.js';
import ReactImageDot from './image-dots/ReactImageDot';

class Matcher extends React.Component {
    
    constructor(props) {
        super(props);
        this.initialDots = [];
        this.state = {
            title: this.props.resort.title,
            src: this.props.resort.src,
            x: 0,
            y: 0,
            pisteInputValue: "",
            currentPiste: "",
            dots: this.initialDots,
            parents: [],
            windowWidth: window.innerWidth*0.98,
        }
        this.onKeyUp = this.onKeyUp.bind(this);
    }
    // Translate from rendered coordinates to real piste map coordinates
    renderedToRealCoord(coord, renderedLength, realLength) {
        return (coord/renderedLength)*realLength;
    }

    realToRenderedCoord(coord, renderedLength, realLength) {
        return (coord/realLength)*renderedLength;
    }

    addDot = (dot) => {
        let currentPiste = this.state.currentPiste; 
        let point = {
            "x": dot.x,
            "y": dot.y,
            "long": 0, "lat": 0, 
            "parent": currentPiste,
            "parentType": "piste",
            "note": ""
        };
        this.setState({
            dots: [...this.state.dots, point],
        });

        if(!this.state.parents.includes(point.parent)) {
            this.setState({parents: [...this.state.parents, point.parent]});
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

    // Called when adding pistes / lifts 
    onKeyUp(e) {
        if (e.charCode === 13) {
            //let dict = this.state.pistePoints;
            e.preventDefault(); 
            let pisteName = e.target.value;
            if(!this.state.parents.includes(pisteName)) {
                this.setState({parents: [...this.state.parents, pisteName]});
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

    loadFileData(data) {
        this.setState({dots: data});
    }

    printPistePoints() {
        this.state.dots.sort((a, b) => a.parent > b.parent ? 1 : -1);
        var res = "";
        this.state.dots.map(d => res += JSON.stringify(d));
        return res; 
    }

    render() {
        const { dots } = this.state;

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
                <FileForm imgSrc={this.state.src} data={this.state.dots} loadData={(data) => this.loadFileData(data)}></FileForm>
                
                <button onClick={this.resetDots}>Reset</button>
                
                <p>Piste points</p>
                {this.printPistePoints()}

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
                    {this.state.parents
                    .map(x => <Button key={x} onClick={() => this.setState({currentPiste: x})}>{x}</Button>)}
                </div>
            
            </div>);
    }
}

export default Matcher; 