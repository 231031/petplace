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
    maxFileCount: limit,
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
    <div>
      <UploadButton options={options} onComplete={handleUploadComplete}>
        {({ onClick }) => (
          <button
            onClick={onClick}
            className="relative bg-white text-white w-32 h-32 rounded-full flex justify-center items-center"
          >
            {/* ใส่รูปภาพ */}
            <img
              src="/images/upload.png" // เส้นทางรูปภาพ (ใส่ตามที่ตั้งไว้ในโปรเจกต์)
              alt="Upload"
              className="h-12 w-12"
            />
            {/* เพิ่มข้อความ (ถ้าต้องการ) */}
            <span className="absolute bottom-4 text-sm text-white">
              Click to upload
            </span>
          </button>
        )}
      </UploadButton>
    </div>
  );
}

export default UploadImage;
