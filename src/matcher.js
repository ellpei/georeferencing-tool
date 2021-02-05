import './styles/matcher.css';
import './styles/image-dots.css';
import './styles/geoCoordSelector.css';
import React from 'react';

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
            currentPiste: "",
            dots: this.initialDots,
            parents: [],
            windowWidth: window.innerWidth*0.98,
            currentDot: {},
        }
        this.setCurrentPiste = this.setCurrentPiste.bind(this);
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
            currentDot: point,
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
            currentDot: {},
        });
    }
    
    resetDots = () => {
        this.setState({
            dots: this.initialDots,
            currentDot: {},
        });
    }

    setCurrentPiste(pisteName) {
        if(!this.state.parents.includes(pisteName)) {
            this.setState({parents: [...this.state.parents, pisteName]});
        }
        this.setState({currentPiste: pisteName});
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
        var res = "";
        this.state.dots.map(d => res += JSON.stringify(d));
        return res; 
    }

    render() {
        const { dots, currentDot, currentPiste } = this.state;

        return (
            <div id="matcher">
                <ReactImageDot
                backgroundImageUrl={this.state.src}
                onLoadMap={this.onLoadPisteMap}
                width={this.state.windowWidth}
                dots={dots}
                parents={this.state.parents}
                deleteDot={this.deleteDot}
                addDot={this.addDot}
                setCurrentPiste={this.setCurrentPiste}
                dotRadius={6}
                currentDot={currentDot}
                currentPiste={currentPiste}
                dotStyles={{
                    backgroundColor: 'red',
                    boxShadow: '0 2px 4px gray',
                }} 
                />
                <FileForm imgSrc={this.state.src} data={this.state.dots} loadData={(data) => this.loadFileData(data)}></FileForm>
                current piste: {this.state.currentPiste}

                <button onClick={this.resetDots}>Reset</button>
                
                <p>Piste points</p>
                {this.printPistePoints()}

                
            
            </div>);
    }
}

export default Matcher; 