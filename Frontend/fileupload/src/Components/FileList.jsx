import React, { useEffect, useState } from "react";
import axios from "axios";
import FileDetails from "./FileDetails";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch files from the backend
  useEffect(() => {
    axios.get("http://localhost:5298/api/files").then((res) => setFiles(res.data));
  }, []);

  // Close the file details modal
  const closeDetails = () => setSelectedFile(null);

  // Handle file deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5298/api/files/${id}`);
      setFiles(files.filter((file) => file.id !== id)); // Remove the deleted file from the state
      alert("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("An error occurred while deleting the file.");
    }
  };

  // Helper function to determine file preview
  const getFilePreview = (file) => {
    const extension = file.fileName.split(".").pop().toLowerCase();
    const fileUrl = `http://localhost:5298/api/files/${file.id}`;

    if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      return <img src={fileUrl} alt={file.fileName} className="w-full h-48 object-cover rounded-t-lg" />;
    } else if (extension === "pdf") {
      return <iframe src={fileUrl} title={file.fileName} className="w-full h-48 rounded-t-lg" />;
    } else {
      return (
        <div className="flex flex-col items-center justify-center w-full h-48 bg-gray-100 rounded-t-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <a href={fileUrl} download className="mt-2 text-blue-500 hover:underline">
            Download {file.fileName}
          </a>
        </div>
      );
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Uploaded Files</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <div key={file.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {getFilePreview(file)}

            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{file.fileName}</h3>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setSelectedFile(file)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  View Details
                </button>

                <button
                  onClick={() => handleDelete(file.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

   

      {selectedFile && <FileDetails fileId={selectedFile.id} onClose={closeDetails} />}
    </div>
  );
};

export default FileList;
