import React, {useRef, useState} from "react"

const FilesInput = () => {
    const inputRef = useRef();

    const [selectedFiles, setSelectedFile] = useState(null);

    return (
        <div>
            <input type="file"   style={{display: "none"}}/>
            <button className=" w-full h-20 rounded-lg bg-white text-yellow">
                <p>Upload file</p>
            </button>
        </div>
    );
};

export default FilesInput;