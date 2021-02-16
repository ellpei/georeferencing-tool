import React from 'react';
import PropTypes from 'prop-types';

import Dot from './Dot';
import GeoCoordSelector from './geoCoordSelector.js';

const propTypes = {
  // Required functions to handle parent-level state management
  deleteDot: PropTypes.func.isRequired,
  addDot: PropTypes.func.isRequired,
  resetDots: PropTypes.func,
  dotStyles: PropTypes.object,
  dotRadius: PropTypes.number,
  backgroundImageUrl: PropTypes.string,
  styles: PropTypes.object,
  // The width in pixels of the box. If unset, will be 100%
  width: PropTypes.number,
  height: PropTypes.number,
  pixelCoordinates: PropTypes.bool,
};

const defaultProps = {
  pixelCoordinates: true,
  backgroundSize: 'cover',
};

export default class ReactImageDot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grabbing: false,
            dimensions: {},
            showModal: false,
            currentDot: {},
            currentParent: "",
            currentParentType: "Piste",
            lastCoords: this.props.coords !== undefined ? this.props.coords : {lat: 63.42833519737357, lng: 13.078345603820786},
        };
        this.onLoadPisteMap = this.onLoadPisteMap.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.setCurrentParent = this.setCurrentParent.bind(this);
        this.setCurrentParentType = this.setCurrentParentType.bind(this);
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

    onMouseUp = (e) => {
        const bounds = e.target.getBoundingClientRect();
        let {dimensions, currentParent, currentParentType, currentDot, lastCoords} = this.state; 
        let dot = {
            "x": Math.round(this.renderedToRealCoord(e.clientX - bounds.left, dimensions.renderWidth, dimensions.realWidth)),
            "y": Math.round(this.renderedToRealCoord(e.clientY - bounds.top, dimensions.renderHeight, dimensions.realHeight)),
            "parent": currentParent,
            "parentType": currentParentType,
            "lat": lastCoords.lat,
            "lng": lastCoords.lng,
        };
        this.setState({
            grabbing: false,
            showModal: true,
            currentDot: {...dot,...currentDot},
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

    setCurrentParent(parent) {
        let dot = this.state.currentDot;
        dot.parent = parent;
        this.setState({currentDot: dot, currentParent: parent});
        this.props.addParent(parent);
    }

    setCurrentParentType(type) {
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
        this.setState({currentDot: {}});
    }

    // Translate from rendered coordinates to real piste map coordinates
    renderedToRealCoord(coord, renderedLength, realLength) {
        return (coord/renderedLength)*realLength;
    }

    realToRenderedCoord(coord, renderedLength, realLength) {
        return (coord/realLength)*renderedLength;
    }

    handleShowModal() {
        this.setState({showModal: true}); 
    }

    handleCloseModal() {
        this.setState({showModal: false, currentDot: {}});
    }

    handleSave() {
        this.props.saveDot(this.state.currentDot);
        this.handleCloseModal();
    }

    render() {
        const { grabbing, showModal, currentDot } = this.state;
        const dim = this.state.dimensions; 

        const { dots, backgroundImageUrl, dotRadius } = this.props;
        const grabClass = grabbing ? 'react-image-dot__grabbing' : '';
        
        return (
        <div className="react-image-dot__container">
        
            <div className={`react-image-dot__wrapper ${grabClass}`}
            onMouseUp={this.onMouseUp}
            width={dim.realWidth}
            height={dim.realHeight}>
            <img src={backgroundImageUrl} alt="Piste map" 
            width={dim.realWidth} onLoad={this.onLoadPisteMap} />
            
            {dots.map((dot, i) =>
                <Dot
                dotX={Math.round(this.realToRenderedCoord(dot.x, dim.renderWidth, dim.realWidth))}
                dotY={Math.round(this.realToRenderedCoord(dot.y, dim.renderHeight, dim.realHeight))}
                i={i}
                styles={{
                    boxShadow: '0px 0px 0px 2px purple',
                    backgroundColor: 'purple',
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
            </div>
            <GeoCoordSelector show={showModal} dimensions={dim}
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
            />
            {this.props.resetDots &&
            <button onClick={this.resetDots}>Reset</button>
            }
        </div>
        );
    }
}

ReactImageDot.propTypes = propTypes;
ReactImageDot.defaultProps = defaultProps;
