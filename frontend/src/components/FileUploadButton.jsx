import { UploadCloud } from "lucide-react";
import axios from "axios";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

const FileUploadButton = ({ room, userId, userName}) => {
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

   const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        console.log("FileUploadButton userId:", userId, "userName:", userName);
        // Set preview
        setSelectedFile(file);
        setPreviewURL(URL.createObjectURL(file));
    
        const formData = new FormData();
        formData.append("file", file);
        formData.append("room", room);
        formData.append("sender", userId);
     formData.append("senderName", userName);
     
    
        try {
          await axios.post("http://localhost:8080/api/chat/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          // toast.success("file sended")
          e.target.value = null;
        } catch (err) {
          console.error("File upload error:", err);
        }
  };
  
  const renderPreview = () => {
    if (!selectedFile) return null;

    const fileType = selectedFile.type;

    if (fileType.startsWith("image/")) {
      return (
        <img
          src={previewURL}
          alt="Preview"
          className="mt-2 w-40 h-auto rounded border"
        />
      );
    } else if (fileType === "application/pdf") {
      return (
        <iframe
          src={previewURL}
          title="PDF Preview"
          className="mt-2 w-40 h-48 rounded border"
        />
      );
    } else {
      return (
        <p className="mt-2 text-sm text-gray-500">Preview not supported.</p>
      );
    }
  };

  return (
    <div>
      {/* Upload icon */}
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="p-2 rounded-full hover:bg-violet-100"
        title="Upload Image/Document"
      >
        <UploadCloud className="w-6 h-6 text-violet-600" />
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*,application/pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Preview Section */}
      {renderPreview()}
    </div>
  );
};

export default FileUploadButton;
