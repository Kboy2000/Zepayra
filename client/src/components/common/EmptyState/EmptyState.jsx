import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../index';
import './EmptyState.css';

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction, 
  variant,
  className 
}) => {
  return (
    <div className={`empty-state empty-state-${variant} ${className || ''}`.trim()}>
      {icon && <div className="empty-state-icon">{icon}</div>}
      {title && <h3 className="empty-state-title">{title}</h3>}
      {description && <p className="empty-state-description">{description}</p>}
      {actionLabel && onAction && (
        <Button 
          variant="primary" 
          size="medium" 
          onClick={onAction}
          className="empty-state-action"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'search', 'error', 'success']),
  className: PropTypes.string,
};

EmptyState.defaultProps = {
  variant: 'default',
};

export default EmptyState;
