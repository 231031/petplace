import { UploadRes } from "@/types/response";
import { UploadButton } from "@bytescale/upload-widget-react";

interface ImageUploadProps {
    limit: number;
    onComplete?: (files: UploadRes[]) => void;
}

function UploadImage({ limit, onComplete }: ImageUploadProps) {

    const apiKey = import.meta.env.VITE_PUBLIC_API_KEY;
    const options = {
        apiKey: apiKey,
        maxFileCount: limit, // check #image in image array and limit 10
        mimeTypes: ["image/*"],
    };

        const handleUploadComplete = (uploadedFiles: { filePath: string; accountId: string }[]) => {
            const baseUrl = "https://upcdn.io";
            const filesWithUrls = uploadedFiles.map((file) => ({
                ...file,
                fileUrl: `${baseUrl}/${file.accountId}/raw${file.filePath}`,
            }));
            
            if (onComplete) {
                onComplete(filesWithUrls);
            }
    };

    return (
        <div className="">
            <UploadButton options={options} onComplete={handleUploadComplete}>
                {({ onClick }) => (
                    <button onClick={onClick} className="bg-navbar text-white px-4 py-2 rounded">
                        Upload a file...
                    </button>
                )}
            </UploadButton>
        </div>
    );
}

export default UploadImage;