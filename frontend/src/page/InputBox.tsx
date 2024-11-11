import React from "react";

interface InputBoxProps {
    placeholder?: string;
}

const InputBox: React.FC<InputBoxProps> = ({ placeholder = "Enter " }) => {
    return (
      <input
        type="search"
        className=" w-80 h-12 p-4 text-sm text-yellow rounded-lg bg-white 
                    placeholder:text-yellow border border-2 hover:border-yellow
                    focus:outline-none focus:border-yellow"
        placeholder={placeholder}
        required
      />
    );
};
  
export default InputBox;