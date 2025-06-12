import React from 'react';

const CustomButton = ({
  text,
  type = 'button',
  onClick,
  className = '',
  disabled = false,
  ...props
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 ${className}`}
    {...props}
  >
    {text}
  </button>
);

export default CustomButton;