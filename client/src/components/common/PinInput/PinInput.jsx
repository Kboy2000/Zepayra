import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './PinInput.css';

const PinInput = ({ length = 4, onComplete, onChange, error, disabled = false }) => {
  const [pins, setPins] = useState(Array(length).fill(''));
  const [showPin, setShowPin] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newPins = [...pins];
    newPins[index] = value;
    setPins(newPins);

    // Call onChange callback
    if (onChange) {
      onChange(newPins.join(''));
    }

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all pins are filled
    if (newPins.every(pin => pin !== '') && onComplete) {
      onComplete(newPins.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      if (pins[index]) {
        // Clear current input
        const newPins = [...pins];
        newPins[index] = '';
        setPins(newPins);
        
        if (onChange) {
          onChange(newPins.join(''));
        }
      } else if (index > 0) {
        // Move to previous input and clear it
        const newPins = [...pins];
        newPins[index - 1] = '';
        setPins(newPins);
        inputRefs.current[index - 1]?.focus();
        
        if (onChange) {
          onChange(newPins.join(''));
        }
      }
    }

    // Handle left arrow
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle right arrow
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newPins = [...pins];
    pastedData.split('').forEach((char, index) => {
      if (index < length) {
        newPins[index] = char;
      }
    });
    setPins(newPins);

    if (onChange) {
      onChange(newPins.join(''));
    }

    // Focus last filled input or next empty
    const lastFilledIndex = Math.min(pastedData.length, length) - 1;
    inputRefs.current[lastFilledIndex]?.focus();

    // Call onComplete if all filled
    if (newPins.every(pin => pin !== '') && onComplete) {
      onComplete(newPins.join(''));
    }
  };

  const clearPin = () => {
    setPins(Array(length).fill(''));
    inputRefs.current[0]?.focus();
    if (onChange) {
      onChange('');
    }
  };

  return (
    <div className="pin-input-container">
      <div className={`pin-input-wrapper ${error ? 'error' : ''}`}>
        {pins.map((pin, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type={showPin ? 'text' : 'password'}
            inputMode="numeric"
            maxLength={1}
            value={pin}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className="pin-input-box"
            autoComplete="off"
          />
        ))}
      </div>

      <div className="pin-input-actions">
        <button
          type="button"
          className="pin-toggle-button"
          onClick={() => setShowPin(!showPin)}
        >
          {showPin ? '🙈 Hide PIN' : '👁️ Show PIN'}
        </button>
        
        <button
          type="button"
          className="pin-clear-button"
          onClick={clearPin}
          disabled={disabled}
        >
          Clear
        </button>
      </div>

      {error && <p className="pin-error-message">{error}</p>}
    </div>
  );
};

PinInput.propTypes = {
  length: PropTypes.number,
  onComplete: PropTypes.func,
  onChange: PropTypes.func,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};

export default PinInput;
