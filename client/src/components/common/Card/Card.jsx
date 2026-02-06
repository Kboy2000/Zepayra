import './Card.css';

const Card = ({ 
  children, 
  glass = false,
  padding = 'medium',
  hover = false,
  className = '',
  onClick,
  ...props 
}) => {
  const getClassName = () => {
    let classes = ['card', `card-padding-${padding}`];
    
    if (glass) classes.push('card-glass');
    if (hover) classes.push('card-hover');
    if (onClick) classes.push('card-clickable');
    if (className) classes.push(className);
    
    return classes.join(' ');
  };

  return (
    <div 
      className={getClassName()} 
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
