import { UploadRes } from "@/types/response";
import { UploadButton } from "@bytescale/upload-widget-react";
import { useState } from "react";

interface imageLimit {
    limit: number;
}

function UploadImage({ limit }: imageLimit) {

    const apiKey = import.meta.env.VITE_PUBLIC_API_KEY;
    const options = {
        apiKey: apiKey,
        maxFileCount: limit, // check #image in image array and limit 10
        mimeTypes: ["image/*"],
    };

    // store fileUrl in image array of payload
    const [files, setFiles] = useState<UploadRes[]>([]);

    const handleUploadComplete = (uploadedFiles: { filePath: string; accountId: string }[]) => {
        const baseUrl = "https://upcdn.io"; // Bytescale's CDN base URL
        const filesWithUrls = uploadedFiles.map((file) => ({
            ...file,
            fileUrl: `${baseUrl}/${file.accountId}/raw${file.filePath}`,
        }));
        setFiles(filesWithUrls);
        console.log(files)
    };

    return (
        <div className="">
            {/* <h3>UploadImage</h3> */}
            <UploadButton options={options} onComplete={handleUploadComplete}>
                {({ onClick }) => (
                    <button onClick={onClick} className="bg-navbar text-white w-full h-12 rounded-lg">
                        Upload a file...
                    </button>
                )}
            </UploadButton>
            {/* {files.length > 0 && (
                <div className="mt-4">
                    <h4>Uploaded Files:</h4>
                    <ul>
                        {files.map((file, index) => (
                            <li key={index}>
                                <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                                    {file.fileUrl}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )} */}
        </div>
    );
}

export default UploadImage;