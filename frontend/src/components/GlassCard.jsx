import React from 'react';

const GlassCard = ({ children, className = '', hoverable = true, ...props }) => {
  return (
    <div
      className={`glass-card rounded-2xl p-glass-padding ${hoverable ? 'transition-all' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
