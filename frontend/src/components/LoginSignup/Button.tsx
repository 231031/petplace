// components/LoginButton.tsx
import React from 'react';

interface ButtonProps {
  label?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ label = '',onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-onstep h-10 w-32 hover:bg-nextstep text-white py-2 px-4 rounded-full 
                focus:outline-none focus:shadow-outline"
    >
      {label}
    </button>
  );
};

export default Button;
