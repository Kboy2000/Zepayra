import { motion } from 'framer-motion';
import './Card.css';

const Card = ({ 
  children, 
  glass = false,
  padding = 'medium',
  hover = false,
  className = '',
  onClick,
  animate = true,
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
    <motion.div 
      className={getClassName()} 
      onClick={onClick}
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={hover ? { translateY: -4, transition: { duration: 0.2 } } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
