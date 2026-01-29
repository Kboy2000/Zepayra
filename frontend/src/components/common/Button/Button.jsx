import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const getClassName = () => {
    let classes = ['btn', `btn-${variant}`, `btn-${size}`];
    
    if (fullWidth) classes.push('btn-full-width');
    if (disabled || loading) classes.push('btn-disabled');
    if (loading) classes.push('btn-loading');
    
    return classes.join(' ');
  };

  return (
    <button
      type={type}
      className={getClassName()}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner"></span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
