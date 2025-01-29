import { useState } from "react";
import { saveAs } from "file-saver";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";
import "react-toastify/dist/ReactToastify.css";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [cookies, setCookie] = useCookies(["uploadStatus", "fileUrl"]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file!");
      return;
    }

    setLoading(true);
    setLoadingMessage("🚀 Uploading files...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://easare.onrender.com/api/files/upload", // Replace with your backend API
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // Ensure cookies are sent with the request
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setLoadingMessage(`🚀 Uploading... ${percentCompleted}%`);
          },
        }
      );

      setLoadingMessage("🔗 Generating secure link...");

      // Check for success response from the server
      if (
        response.status === 200 &&
        response.data.message === "File uploaded successfully"
      ) {
        // Trigger the success toast
        toast.success("File uploaded successfully!");

        setFileUrl(response.data.fileUrl);
        // Assuming your server responds with the file URL in response.data.fileUrl
        setCookie("uploadStatus", "success", { path: "/" });
        setCookie("fileUrl", response.data.fileUrl, { path: "/" }); // Save the Cloudinary file URL
        setLoadingMessage("🔗 Generating secure link...");
      } else {
        // Trigger error toast if there's any issue in the response
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("File upload failed!");
      console.error(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setLoadingMessage("");
      }, 1500);
    }
  };

  const handleOpenFile = () => {
    window.open(cookies.fileUrl, "_blank");
  };

  return (
    <div className="upload-container">
      <h2>Upload Your File</h2>
      <div className="upload-input-container">
        <input type="file" onChange={handleFileChange} className="file-input" />
        <button
          onClick={handleUpload}
          className={`upload-button ${loading ? "disabled" : ""}`}
          disabled={loading}
        >
          {loading ? loadingMessage : "Upload"}
        </button>
      </div>

      {cookies.uploadStatus === "success" && cookies.fileUrl && (
        <div className="file-url-container">
          <h3>Your file has been uploaded successfully!</h3>

          <div className="button-container">
            <button onClick={handleOpenFile} className="open-file-button">
              Open File in New Tab
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${cookies.fileUrl}  
                  
                  This link will remain active for 24 hours. After that, the file will be automatically deleted, and the link will no longer be valid.`
                );
                toast.success("Link copied to clipboard!");
              }}
              className="copy-link-button"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default UploadForm;
