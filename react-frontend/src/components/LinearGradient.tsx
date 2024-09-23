import React from 'react';
import PropTypes from 'prop-types';

interface LinearGradientProps {
  data: {
    fromColor: string;
    toColor: string;
    min: string;
    max: string;
  };
}

const LinearGradient: React.FC<LinearGradientProps> = props => {
  const { data } = props;
  const boxStyle = {
    width: 180,
    margin: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${data.fromColor}, ${data.toColor})`,
    height: 20
  };
  return (
    <div>
      <div style={boxStyle} className="display-flex">
        <span>{data.min}</span>
        <span className="fill"></span>
        <span>{data.max}</span>
      </div>
      <div style={{ ...boxStyle, ...gradientStyle }} className="mt8"></div>
    </div>
  );
};

LinearGradient.propTypes = {
  data: PropTypes.shape({
    fromColor: PropTypes.string.isRequired,
    toColor: PropTypes.string.isRequired,
    min: PropTypes.string.isRequired,
    max: PropTypes.string.isRequired,
  }).isRequired
};

export default LinearGradient;
