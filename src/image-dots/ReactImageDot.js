import React from 'react';
import PropTypes from 'prop-types';

import Dot from './Dot';

const propTypes = {
  // Required functions to handle parent-level state management
  deleteDot: PropTypes.func.isRequired,
  addDot: PropTypes.func.isRequired,

  resetDots: PropTypes.func,

  // CSS Styles for dots
  dotStyles: PropTypes.object,

  // The radius of the dot
  dotRadius: PropTypes.number,

  // The background image url to use
  backgroundImageUrl: PropTypes.string,

  // Additional styles for container
  styles: PropTypes.object,

  // The width in pixels of the box. If unset, will be 100%
  width: PropTypes.number,

  // The width in pixels of height
  height: PropTypes.number,

  // To use pixel coordinates vs a scale from 0-1
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
    };
  }

  onMouseUp = (e) => {
    const bounds = e.target.getBoundingClientRect();
    this.setState({
      grabbing: false,
    });
    this.props.addDot({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    });
  }

  moveDot = (index) => {
    this.setState({
      grabbing: true,
    });
    this.props.deleteDot(index);
  }

  resetDots = () => {
    this.props.resetDots();
  }

  render() {
    const { grabbing } = this.state;

    const { dots, width, height, styles, dotStyles, backgroundImageUrl, dotRadius } = this.props;
    const grabClass = grabbing ? 'react-image-dot__grabbing' : '';

    return (
      <div className="react-image-dot__container">
      
        <div className={`react-image-dot__wrapper ${grabClass}`}
          onMouseUp={this.onMouseUp}
          style={{
            ...styles,
            width,
            height,
          }}>
          <img src={backgroundImageUrl} alt="Piste map" 
                width="100%" />
          {dots.map((dot, i) =>
            <Dot
              x={dot.x}
              y={dot.y}
              i={i}
              styles={dotStyles}
              moveDot={this.moveDot}
              dotRadius={dotRadius}
              key={i}
            />
          )}
        </div>
        {this.props.resetDots &&
          <button onClick={this.resetDots}>Reset</button>
        }
      </div>
    );
  }
}

ReactImageDot.propTypes = propTypes;
ReactImageDot.defaultProps = defaultProps;
