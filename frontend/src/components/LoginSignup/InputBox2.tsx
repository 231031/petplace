import React from "react";

interface InputBoxProps {
    placeholder?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string; // รองรับการส่ง input type เช่น text, password, email
    name?: string; // ใช้สำหรับการอ้างอิง key ของฟอร์ม
}

const InputBox2: React.FC<InputBoxProps> = ({ placeholder = "Enter", value, onChange, type = "text", name }) => {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-52 h-12 p-4 text-sm text-yellow rounded-lg bg-white 
                       placeholder:text-yellow border-2 border-bg hover:border-yellow
                       focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow"
            placeholder={placeholder}
            required
        />
    );
};

export default InputBox2;
