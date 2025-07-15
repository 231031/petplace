import { PUBLIC_API_KEY } from "@/config/config";
import { UploadRes } from "@/types/response";
import { UploadButton } from "@bytescale/upload-widget-react";

interface ImageUploadProps {
  limit: number;
  onComplete?: (files: UploadRes[]) => void;
}

function UploadImage({ limit, onComplete }: ImageUploadProps) {
  const options = {
    apiKey: PUBLIC_API_KEY,
    maxFileCount: limit, // check #image in image array and limit 10
    mimeTypes: ["image/*"],
  };

  const handleUploadComplete = (
    uploadedFiles: { filePath: string; accountId: string }[]
  ) => {
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
    <div className="h-full">
      {/* <h3>UploadImage</h3> */}
      <UploadButton options={options} onComplete={handleUploadComplete}>
        {({ onClick }) => (
          <button
            onClick={onClick}
            className="bg-bgLogin hover:bg-gray-500 text-black h-full w-full rounded-lg"
          >
            V
          </button>
        )}
      </UploadButton>
    </div>
  );
}

export default UploadImage;
