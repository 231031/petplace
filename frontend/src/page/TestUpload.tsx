import UploadImage from "@/components/UploadImage";

function TestUpload() {

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <h3>TestUpload</h3>
            <UploadImage limit={2} />
        </div>
    );
}

export default TestUpload;