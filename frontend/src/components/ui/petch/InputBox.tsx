import React from "react";

interface InputBoxProps {
    placeholder?: string;
}

const InputBox: React.FC<InputBoxProps> = ({ placeholder = "Enter " }) => {
    return (
      <input
        type="text"
        className=" w-80 h-12 p-4 text-sm text-yellow rounded-lg bg-white 
                    placeholder:text-yellow border border-2 border-bg hover:border-yellow
                    focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow "
        placeholder={placeholder}
        required
      />
    );
};
  
export default InputBox;