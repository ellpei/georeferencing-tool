import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  dotX: PropTypes.number.isRequired,
  dotY: PropTypes.number.isRequired,
  i: PropTypes.number.isRequired,
  moveDot: PropTypes.func.isRequired,
  dotRadius: PropTypes.number,

  styles: PropTypes.object,
}

const defaultProps = {
  dotRadius: 5,
};

export default class Dot extends React.Component {
  onMouseDown = () => {
    this.props.moveDot(this.props.i);
  }

  render() {
    const { dotX, dotY, styles, dotRadius } = this.props;
    return (
      <div
        className="react-image-dot"
        onMouseDown={this.onMouseDown}
        style={{
          ...styles,
          height: dotRadius * 2,
          width: dotRadius * 2,
          borderRadius: dotRadius,
          transform: `translate(${-dotRadius}, ${-dotRadius})`,
          top: dotY,
          left: dotX
        }}
      />
    );
  }
}

Dot.propTypes = propTypes;
Dot.defaultProps = defaultProps;
