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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://easare.onrender.com/api/files/upload", // Correct the URL to match your backend endpoint
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );

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
      } else {
        // Trigger error toast if there's any issue in the response
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("File upload failed!");
      console.error(error);
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
        <button onClick={handleUpload} className="upload-button">
          Upload
        </button>
      </div>

      {/* Conditionally render the Cloudinary link after successful upload */}
      {cookies.uploadStatus === "success" && cookies.fileUrl && (
        <div className="file-url-container">
          <h3>Your file has been uploaded successfully!</h3>

          {/* Buttons to open file and copy link side by side */}
          <div className="button-container">
            {/* Button to open file in a new tab */}
            <button onClick={handleOpenFile} className="open-file-button">
              Open File in New Tab
            </button>

            {/* Button to copy file URL */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(cookies.fileUrl);
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
