import './styles/image-dots.css';
import './styles/geoCoordSelector.css';
import React from 'react';
import {Button} from 'react-bootstrap';
import FileForm from './fileForm.js';
import ReactImageDot from './image-dots/ReactImageDot';
import DotsInfo from './image-dots/DotsInfo';
import Delaunay from './delaunay/index.js';

class Matcher extends React.Component {

    constructor(props) {
        super(props);
        this.initialDots = [];
        this.state = {
            title: this.props.resort.title,
            src: this.props.resort.src,
            x: 0,
            y: 0,
            dots: this.initialDots,
            triangledots: [],
            triangles: [],
            parents: [],
            parentTypes: ['Piste', 'Lift', 'Terrain', 'Restaurant', 'Other'],
            windowWidth: window.innerWidth*0.98,
        }
        this.addParent = this.addParent.bind(this);
        this.addParentType = this.addParentType.bind(this);
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
        let triangledots = [...this.state.triangledots, new Delaunay.Point(dot.x, dot.y)];
        this.setState({
            dots: [...dots, dot],
            triangledots: triangledots,
        }, function() {
            this.setState({triangles: Delaunay.triangulate(this.state.triangledots)})
          });
    }

    saveDot = (dot) => {
        let {dots} = this.state;
        this.deleteDot(dots.length-1);
        this.addDot(dot);
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

    addParent(parent) {
        if(!this.state.parents.includes(parent)) {
            this.setState({parents: [...this.state.parents, parent]});
        }
    }

    addParentType(type) {
        if(!this.state.parentTypes.includes(type)) {
            this.setState({parentTypes: [...this.state.parentTypes, type]});
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
        this.initialDots = data;
        let dots = [];
        let parents = [];
        var dot;
        for(dot of data) {
            var parent;
            for(parent of dot.parent) {
                if(!parents.includes(parent)) {
                    parents = [...parents, parent];
                }
            }
            dot.x = parseInt(dot.x);
            dot.y = parseInt(dot.y);
            dots = [...dots, dot];
        }
        this.setState({dots: dots, parents: parents});
    }

    render() {
        const { dots, parents, parentTypes, src} = this.state;

        return (
            <div id="matcher">
                <ReactImageDot
                backgroundImageUrl={src}
                onLoadMap={this.onLoadPisteMap}
                dots={dots}
                triangles={this.state.triangles}
                parents={parents}
                parentTypes={parentTypes}
                deleteDot={this.deleteDot}
                saveDot={this.saveDot}
                addDot={this.addDot}
                addParent={this.addParent}
                addParentType={this.addParentType}
                dotRadius={1}
                /><br/>
                <div className="bottom-toolbox">
                    <FileForm imgSrc={this.state.src} data={this.state.dots} loadData={(data) => this.loadFileData(data)}></FileForm>
                    <DotsInfo dots={this.state.dots} deleteDot={this.deleteDot}></DotsInfo>
                    <Button variant='success' onClick={this.resetDots}>Reset</Button>
                </div>

            </div>);
    }
}

export default Matcher;
