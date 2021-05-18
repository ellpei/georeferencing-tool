import '../styles/image-dots.css';
import '../styles/geoCoordSelector.css';
import areReferencePoints from './experiment/are_referencepoints.js';
import areLandmarks from './experiment/are_landmarks.js';
import testTriangles from './experiment/are_testtriangles.js';
import testGPSpoints from './experiment/worldcupbacken.js';
import React from 'react';
import FileForm from './FileForm.js';
import ImageCoordinateCollector from './ImageCoordinateCollector.js';
import DotsInfo from './DotsInfo.js';
import Delaunay from './delaunay/index.js';
import { Prompt } from 'react-router';

class CoordinateMatcher extends React.Component {

    constructor(props) {
        super(props);
        this.initialDots = [];
        this.state = {
            title: this.props.resort.title,
            src: this.props.resort.src,
            x: 0,
            y: 0,
            referencePoints: areReferencePoints.map(x => new Delaunay.Point(x)),
            dots: this.initialDots,
            triangles: [],
            testDots: [],
            landmarkTestData: [],
            parents: [],
            parentTypes: ['Piste', 'Lift', 'Terrain', 'Restaurant', 'Other'],
            windowWidth: window.innerWidth*0.98,
            shouldBlockNavigation: false,
        }
        console.log("Number of referencePoints: " + areReferencePoints.length);
    }

    componentDidUpdate() {
        if (this.state.shouldBlockNavigation) {
            window.onbeforeunload = () => true
        } else {
            window.onbeforeunload = undefined
        }
    }

    transformTestPoints = () => {
        /*
        let triangles = [];
        let trianglePoints = [];
        let size = "200";
        let triangleData = testTriangles[size].triangles;
        console.log("transforming run points for triangle set size " + size);
        for(const triangle of triangleData) {
            for(const point of triangle) {
                let pointObj = new Delaunay.Point(point);
                if(!this.includesPoint(trianglePoints, pointObj)) {
                    trianglePoints = [...trianglePoints, pointObj];
                }
            }
        }
        triangles = Delaunay.triangulate(trianglePoints);
        */
        let triangles = this.state.triangles;
        if(triangles.length === 0) {
            return;
        }
        let transformedCoords = [];
        for(const p of testGPSpoints) {
            let point = {lat: p.coordinates[1], lng: p.coordinates[0]};
            let nearestTriangle = this.findNearestTriangle(point, triangles);
            let {x, y} = nearestTriangle.transformGeoCoords(point);
            transformedCoords.push({x: Math.round(x), y: Math.round(y)});
        }
        this.setState({testDots: transformedCoords});
    }
    // Translate from rendered coordinates to real piste map coordinates
    renderedToRealCoord(coord, renderedLength, realLength) {
        return (coord/renderedLength)*realLength;
    }

    realToRenderedCoord(coord, renderedLength, realLength) {
        return (coord/realLength)*renderedLength;
    }

    findNearestTriangle = (point, triangles) => {
        var nearestTriangle;
        let minDistance = Infinity;

        for(const triangle of triangles) {
            let distance = triangle.geoDistanceToPoint(point);
            if(distance < minDistance) {
                minDistance = distance;
                nearestTriangle = triangle;
            }
        }
        return nearestTriangle;
    }

    doLandmarkTest = () => {
        let triangles = [];
        let trianglePoints = [];
        let size = "50";
        let triangleData = testTriangles[size].triangles;
        console.log("transforming run points for triangle set size " + size);
        for(const triangle of triangleData) {
            for(const point of triangle) {
                let pointObj = new Delaunay.Point(point);
                if(!this.includesPoint(trianglePoints, pointObj)) {
                    trianglePoints = [...trianglePoints, pointObj];
                }
            }
        }
        triangles = Delaunay.triangulate(trianglePoints);
        this.setState({triangles: triangles, dots: trianglePoints})
        let landmarkData = [];

        //use landmark points or reference points??
        for(const p of areReferencePoints) {
            let nearestTriangle = this.findNearestTriangle(p, triangles);
            let {x, y} = nearestTriangle.transformGeoCoords(p);
            x = Math.round(x);
            y = Math.round(y);
            let d = Math.sqrt((x - p.x)**2 + (y - p.y)**2);
            landmarkData.push({
                x_prim: Math.round(x),
                y_prim: Math.round(y),
                x: p.x,
                y: p.y,
                distance: d
            });
        }
        this.setState({landmarkTestData: landmarkData});
        return landmarkData;
    }

    generateTestReport = () => {
        let N = this.state.dots.length;
        let results = [];
        let testSet = this.state.dots.slice();
        // Calculate min RMSE for each subset of size n
        var n;
        for(n = N; n >= 3; n--) {
            let minRMSE = Infinity, minTriangles = [], indexToRemove = 0;
            var i;
            for(i = 0; i < n; i++) {
                let subset = testSet.slice();
                subset.splice(i, 1);
                let triangles = Delaunay.triangulate(subset);
                let rmse = this.calculateError(triangles);
                if(rmse < minRMSE) {
                    indexToRemove = i;
                    minRMSE = rmse;
                    minTriangles = triangles;
                }
            }
            results.push({
                n: n-1,
                minRMSE: minRMSE,
                minTriangles: minTriangles,
            });
            testSet.splice(indexToRemove, 1);
        }
        return results;
    }
    // Calculate the total error using reference points
    // Used for thesis experiments of åre
    calculateError = (triangles) => {
        let {referencePoints} = this.state;
        if(triangles.length < 1) return null;
        var numClassified = 0;
        let error = 0;
        for(const point of referencePoints) {
            let nearestTriangle = this.findNearestTriangle(point, triangles);
            if(nearestTriangle) {
                let mapCoords = nearestTriangle.transformGeoCoords(point);
                let distance = point.distance(new Delaunay.Point(mapCoords));
                error += distance;
                numClassified++;
            }
        }
        return error / Math.sqrt( numClassified);
    }

    addDot = (dot) => {
        let dots = this.state.dots;
        this.setState({
            dots: [...dots, new Delaunay.Point(dot)],
            shouldBlockNavigation: true,
        }, function() {
            this.setState({
                triangles: Delaunay.triangulate(this.state.dots)
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

    addParent = (parent) => {
        if(!this.state.parents.includes(parent)) {
            this.setState({parents: [...this.state.parents, parent]});
        }
    }

    addParentType = (type) => {
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
        const { dots, triangles, testDots, landmarkTestData, parents, parentTypes, src} = this.state;

        return (
            <div id="matcher">
                <Prompt
                  when={this.state.shouldBlockNavigation}
                  message='You have unsaved changes, are you sure you want to leave?'
                />
                <ImageCoordinateCollector
                backgroundImageUrl={src}
                onLoadMap={this.onLoadPisteMap}
                dots={dots}
                triangles={triangles}
                testDots={testDots}
                landmarkTestData={landmarkTestData}
                parents={parents}
                parentTypes={parentTypes}
                deleteDot={this.deleteDot}
                saveDot={this.saveDot}
                addDot={this.addDot}
                addParent={this.addParent}
                addParentType={this.addParentType}
                dotRadius={2}
                /><br/>
                <div className="bottom-toolbox">
                    <FileForm
                        imgSrc={this.state.src}
                        points={this.state.dots}
                        triangles={this.state.triangles}
                        loadPointData={this.loadPointData}
                        loadTriangleData={this.loadTriangleData}
                        doLandmarkTest={this.doLandmarkTest}
                        generateTestReport={this.generateTestReport}
                        plotTestData={this.transformTestPoints}>
                    </FileForm>
                    <DotsInfo
                        dots={this.state.dots}
                        deleteDot={this.deleteDot}
                        resetDots={this.resetDots}/>
                </div>
            </div>);
    }
}

export default CoordinateMatcher;
