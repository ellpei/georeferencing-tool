import './styles/image-dots.css';
import './styles/geoCoordSelector.css';
import anchorPoints from './assets/are_anchorpoints.js';
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
            referencePoints: anchorPoints,
            dots: this.initialDots,
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

    findEnclosingTriangle = (point, triangles) => {
        for(const triangle of triangles) {
            if(triangle.enclosesGeoCoords(point)) {
                return triangle;
            }
        }
    }
    // Calculate the total error using reference points
    // Used for thesis experiments of åre
    calculateError = () => {
        let {referencePoints, triangles} = this.state;
        if(triangles.length < 1) return null;
        var numClassified = 0;
        let error = 0;
        for(const refPoint of referencePoints) {
            let point = new Delaunay.Point(refPoint);
            let enclosingTriangle = this.findEnclosingTriangle(point, triangles);
            if(enclosingTriangle) {
                let mapCoords = enclosingTriangle.transformGeoCoords(point);
                let distance = point.distance(new Delaunay.Point(mapCoords));
                error += distance;
                numClassified++;
            }
        }
        return {error: error, numClassified: numClassified};
    }

    addDot = (dot) => {
        let dots = this.state.dots;
        this.setState({
            dots: [...dots, new Delaunay.Point(dot)],
        }, function() {
            this.setState({
                triangles: Delaunay.triangulate(this.state.dots)
            }, function() {
                this.setState({
                    currentError: this.calculateError()
                });
            });
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
        }, function() {
            this.setState({triangles: Delaunay.triangulate(this.state.dots)})
        });
    }

    resetDots = () => {
        this.setState({
            dots: this.initialDots,
        }, function() {
            this.setState({triangles: []})
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

    loadPointData = (data) => {
        data = data.map(x => new Delaunay.Point(x));
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
        this.setState({dots: dots, parents: parents}, function() {
            this.setState({triangles: Delaunay.triangulate(this.state.dots)})
        });
    }

    includesPoint = (pointList, point) => {
        for(const p of pointList) {
            if(p.x === point.x && p.y === point.y) {
                return true;
            }
        }
        return false;
    }

    loadTriangleData = (data) => {
        let points = [];
        let parents = [];
        for(const triangle of data) {
            for(const point of triangle) {
                let pointObj = new Delaunay.Point(point);
                if(!this.includesPoint(points, pointObj)) {
                    points = [...points, pointObj];
                    for(const parent of pointObj.parent) {
                        if(!parents.includes(parent)) {
                            parents = [...parents, parent];
                        }
                    }
                }
            }
        }
        this.initialDots = points;
        this.setState({dots: points, parents: parents}, function() {
            this.setState({triangles: Delaunay.triangulate(this.state.dots)})
        });
    }

    render() {
        const { dots, parents, parentTypes, src, currentError} = this.state;

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
                    <FileForm
                        imgSrc={this.state.src}
                        points={this.state.dots}
                        triangles={this.state.triangles}
                        loadPointData={this.loadPointData}
                        loadTriangleData={this.loadTriangleData}
                        currentError={currentError}>
                    </FileForm>
                    <DotsInfo dots={this.state.dots} deleteDot={this.deleteDot}></DotsInfo>
                    <Button variant='success' onClick={this.resetDots}>Reset</Button>
                </div>

            </div>);
    }
}

export default Matcher;
