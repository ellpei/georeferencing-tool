import React from 'react';
import PropTypes from 'prop-types';
import Canvas from './Canvas';
import Dot from '../image-dots/Dot';
import InputModal from './InputModal.js';
import Delaunay from './delaunay/index.js';

const propTypes = {
  deleteDot: PropTypes.func.isRequired,
  addDot: PropTypes.func.isRequired,
  resetDots: PropTypes.func,
  dotStyles: PropTypes.object,
  dotRadius: PropTypes.number,
  backgroundImageUrl: PropTypes.string,
  styles: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  pixelCoordinates: PropTypes.bool,
};

const defaultProps = {
  pixelCoordinates: true,
  backgroundSize: 'cover',
};

export default class ImageCoordinateCollector extends React.Component {
    constructor(props) {
        super(props);
        let lastCoords = this.props.coords !== undefined ? this.props.coords : {lat: 63.42833519737357, lng: 13.078345603820786};
        this.state = {
            grabbing: false,
            dimensions: {},
            showModal: false,
            currentParent: [],
            currentParentType: "Piste",
            lastCoords: lastCoords,
            currentDot: {lat: lastCoords.lat, lng: lastCoords.lng},
        };
    }

    onLoadPisteMap = ({target: img}) => {
        this.setState({
            dimensions: {
                renderWidth: img.offsetWidth,
                renderHeight: img.offsetHeight,
                realWidth: img.naturalWidth,
                realHeight: img.naturalHeight,
            }
        });
    }

    calcEstimatedGeoCoord = (point) => {
        var nearestTriangle;
        let minDistance = Infinity;

        for(const triangle of this.props.triangles) {
            if(triangle.enclosesMapCoords(point)) {
                return triangle.transformMapCoords(point);
            }
            let distance = triangle.mapDistanceToPoint(point);
            if(distance < minDistance) {
                minDistance = distance;
                nearestTriangle = triangle;
            }
        }
        return nearestTriangle ? nearestTriangle.transformMapCoords(point) : null;
    }

    onMouseUp = (e) => {
        const bounds = e.target.getBoundingClientRect();
        let {dimensions, currentParent, currentParentType, currentDot, lastCoords} = this.state;
        let x = Math.round(this.renderedToRealCoord(e.clientX - bounds.left, dimensions.renderWidth, dimensions.realWidth));
        let y = Math.round(this.renderedToRealCoord(e.clientY - bounds.top, dimensions.renderHeight, dimensions.realHeight))
        let estimatedCoords = this.calcEstimatedGeoCoord(new Delaunay.Point({x: x, y: y}));

        let dot = {
            "x": x,
            "y": y,
            "parent": currentParent,
            "parentType": currentParentType,
            "lat": estimatedCoords ? estimatedCoords.x : lastCoords.lat,
            "lng": estimatedCoords ? estimatedCoords.y : lastCoords.lng,
        };

        this.setState({
            grabbing: false,
            showModal: true,
            currentDot: {...currentDot, ...dot},
            currentParent: currentDot.parent? currentDot.parent : currentParent,
        });
    }

    updateCurrentDot = (dot) => {
        let currentDot = this.state.currentDot;
        if(dot.lat !== undefined && dot.lng !== undefined) {
            this.setState({lastCoords: {lat: dot.lat, lng: dot.lng}});
        }
        this.setState({
            currentDot: {...currentDot,...dot},});
    }

    setCurrentParent = (parentList) => {
        let dot = this.state.currentDot;
        let newParents = [];
        var parent;
        for(parent of parentList) {
            newParents = [...newParents, parent.value];
            this.props.addParent(parent.value);
        }
        dot.parent = newParents;

        this.setState({currentDot: dot, currentParent: newParents});
    }

    setCurrentParentType = (type) => {
        let dot = this.state.currentDot;
        dot.parentType = type;
        this.setState({currentDot: dot, currentParentType: type});
        this.props.addParentType(type);
    }

    moveDot = (index) => {
        console.log("move dot");
        this.setState({
            grabbing: true,
            currentDot: this.props.dots[index],
        });
        this.props.deleteDot(index);
    }

    resetDots = () => {
        this.props.resetDots();
        this.setState({currentDot: this.state.lastCoords});
    }

    // Translate from rendered coordinates to real piste map coordinates
    renderedToRealCoord = (coord, renderedLength, realLength) => {
        return (coord/renderedLength)*realLength;
    }

    realToRenderedCoord = (coord, renderedLength, realLength) => {
        return (coord/realLength)*renderedLength;
    }

    handleShowModal = () => {
        this.setState({showModal: true});
    }

    handleCloseModal = () => {
        this.setState({showModal: false, currentDot: {}});
    }

    handleSave = () => {
        this.props.saveDot(this.state.currentDot);
        this.handleCloseModal();
    }

    render() {
        const {grabbing, showModal, currentDot} = this.state;
        const dim = this.state.dimensions;
        const {dots, testDots, backgroundImageUrl, dotRadius, triangles} = this.props;
        const grabClass = grabbing ? 'react-image-dot__grabbing' : '';

        return (
        <div id="react-image-dot-container">

            <div className={`react-image-dot__wrapper ${grabClass} no-select`}
            onMouseUp={this.onMouseUp}
            width={dim.realWidth}
            height={dim.realHeight}>

            <Canvas
            id="canvas"
            width={dim.realWidth}
            height={dim.realHeight}
            triangles={triangles}>
            </Canvas>

            <img
            id="pistemap-img"
            src={backgroundImageUrl} alt="Piste map"
            width={dim.realWidth} onLoad={this.onLoadPisteMap} />

            {dots.map((dot, i) =>
                <Dot
                dotX={Math.round(this.realToRenderedCoord(dot.x, dim.renderWidth, dim.realWidth))}
                dotY={Math.round(this.realToRenderedCoord(dot.y, dim.renderHeight, dim.realHeight))}
                i={i}
                styles={{
                    boxShadow: '0px 0px 0px 2px blue',
                    backgroundColor: 'blue',
                }}
                moveDot={this.moveDot}
                dotRadius={dotRadius}
                key={i}
                />)}

            {Object.keys(currentDot).length === 0 ? null: <Dot
                dotX={Math.round(this.realToRenderedCoord(currentDot.x, dim.renderWidth, dim.realWidth))}
                dotY={Math.round(this.realToRenderedCoord(currentDot.y, dim.renderHeight, dim.realHeight))}
                i={0}
                styles={{
                    boxShadow: '0px 0px 0px 2px green',
                    backgroundColor: 'green',
                }}
                moveDot={() => console.log('try to move temp dot')}
                dotRadius={dotRadius}
                key={-1}
                />}

            {testDots.map((dot, i) =>
                    <Dot
                    dotX={Math.round(this.realToRenderedCoord(dot.x, dim.renderWidth, dim.realWidth))}
                    dotY={Math.round(this.realToRenderedCoord(dot.y, dim.renderHeight, dim.realHeight))}
                    i={i}
                    styles={{
                        boxShadow: '0px 0px 0px 2px lime',
                        backgroundColor: 'lime',
                    }}
                    moveDot={() => {}}
                    dotRadius={dotRadius}
                    key={i}
                    />)}


            </div>
            <InputModal
            show={showModal}
            dimensions={dim}
            posX={this.realToRenderedCoord(currentDot.x, dim.renderWidth, dim.realWidth)}
            handleClose={this.handleCloseModal}
            handleSave={this.handleSave}
            setCurrentParent={this.setCurrentParent}
            setCurrentParentType={this.setCurrentParentType}
            updateCurrentDot={this.updateCurrentDot}
            currentParent={this.state.currentParent}
            currentParentType={this.state.currentParentType}
            currentDot={this.state.currentDot}
            parents={this.props.parents}
            parentTypes={this.props.parentTypes}
            dots={this.props.dots}
            triangles={triangles}
            />
            {this.props.resetDots &&
            <button onClick={this.resetDots}>Reset</button>}
        </div>
        );
    }
}

ImageCoordinateCollector.propTypes = propTypes;
ImageCoordinateCollector.defaultProps = defaultProps;
