import React from 'react';
import PropTypes from 'prop-types';
import './Skeleton.css';

const Skeleton = ({ variant, width, height, count, className }) => {
  const getSkeletonClass = () => {
    const baseClass = 'skeleton';
    const variantClass = `skeleton-${variant}`;
    return `${baseClass} ${variantClass} ${className || ''}`.trim();
  };

  const getStyle = () => {
    const style = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;
    return style;
  };

  const skeletons = Array.from({ length: count }, (_, index) => (
    <div key={index} className={getSkeletonClass()} style={getStyle()}></div>
  ));

  return count > 1 ? <div className="skeleton-group">{skeletons}</div> : skeletons[0];
};

Skeleton.propTypes = {
  variant: PropTypes.oneOf(['text', 'title', 'card', 'circle', 'rectangle']),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  count: PropTypes.number,
  className: PropTypes.string,
};

Skeleton.defaultProps = {
  variant: 'text',
  count: 1,
};

export default Skeleton;
