import { useState } from 'react';
import './Input.css';

const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled = false,
  required = false,
  name,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPasswordType = type === 'password';
  const inputType = isPasswordType && showPassword ? 'text' : type;

  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label" htmlFor={name}>
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <div className={`input-container ${isFocused ? 'input-focused' : ''} ${error ? 'input-error' : ''}`}>
        {icon && <span className="input-icon">{icon}</span>}
        
        <input
          id={name}
          name={name}
          type={inputType}
          className="input-field"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          {...props}
        />
        
        {isPasswordType && (
          <button
            type="button"
            className="input-toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
      </div>
      
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Input;
