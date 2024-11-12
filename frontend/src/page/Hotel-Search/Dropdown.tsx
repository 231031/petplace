import { useState } from "react";

const Dropdown = ({ options, onOptionClick }: { options: string[], onOptionClick: (option:string)=>void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(true)}
        className="rounded text-white px-2 py-1 bg-gray-400 hover:bg-gray-500"
      >
      <div className="mr-1">Dropdown</div>
      </button>
      {isExpanded && (
        <div className="bg-white border absolute">
          <ul>
            {options.map((option) => (
              <li 
              onClick = {() => {
                setIsExpanded(false);
                onOptionClick(option)}
              }
              className="hover:bg-blue-300" 
              key={option}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
