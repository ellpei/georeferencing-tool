import '../styles/image-dots.css';
import React from 'react';
import {Button} from 'react-bootstrap';
import FileForm from './FileForm.js';
import ImageCoordinateCollector from './ImageCoordinateCollector.js';
import DotsInfo from '../image-dots/DotsInfo';

class MapCoordCollector extends React.Component {

    constructor(props) {
        super(props);
        this.initialDots = [];
        this.state = {
            title: this.props.resort.title,
            src: this.props.resort.src,
            x: 0,
            y: 0,
            dots: this.initialDots,
            windowWidth: window.innerWidth*0.98,
        }
    }
    // Translate from rendered coordinates to real piste map coordinates
    renderedToRealCoord(coord, renderedLength, realLength) {
        return (coord/renderedLength)*realLength;
    }

    realToRenderedCoord(coord, renderedLength, realLength) {
        return (coord/realLength)*renderedLength;
    }

    addDot = (dot) => {
        let dots = this.state.dots;
        this.setState({
            dots: [...dots, dot],
        });
    }

    saveDot = (dot) => {
        let {dots} = this.state;
        this.deleteDot(dots.length-1);
        this.addDot(dot);
    }

    deleteDot = (index) => {
        this.setState({
            dots: this.state.dots.filter((e, i) => {return i !== index;}),
        });
    }

    resetDots = () => {
        this.setState({
            dots: this.initialDots,
        });
    }

    addParent = (parent) => {
        if(!this.state.parents.includes(parent)) {
            this.setState({parents: [...this.state.parents, parent]});
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

    loadPointData = (data) => {
        this.initialDots = data;
        this.setState({dots: data});
    }

    render() {
        const { dots, src} = this.state;

        return (
            <div id="matcher">
                <ImageCoordinateCollector
                backgroundImageUrl={src}
                onLoadMap={this.onLoadPisteMap}
                parents={[]}
                dots={dots}
                deleteDot={this.deleteDot}
                saveDot={this.saveDot}
                addDot={this.addDot}
                dotRadius={1}
                />
                <div className="bottom-toolbox">
                    <FileForm
                        imgSrc={this.state.src}
                        points={this.state.dots}
                        loadPointData={this.loadPointData}/>
                    <DotsInfo dots={this.state.dots} deleteDot={this.deleteDot}></DotsInfo>
                    <Button variant='success' onClick={this.resetDots}>Reset</Button>
                </div>
            </div>);
    }
}

export default MapCoordCollector;
