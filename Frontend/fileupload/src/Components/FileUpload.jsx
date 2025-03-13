import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
  
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setLoading(true);
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);

  
    try {
      await axios.post("http://localhost:5298/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("File uploaded successfully!");
      setFile(null);
      setDescription("");
     
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Upload File</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-100 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition">
            <svg
              className="w-10 h-10 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16v-4m0 0V8m0 4h10m-4 4l4-4m0 0l-4-4m4 4H7"
              ></path>
            </svg>
            <span className="text-gray-600">Click to upload a file</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        </div>

        {file && (
          <p className="text-sm text-green-600 font-semibold">
            Selected: {file.name}
          </p>
        )}

        <label className="block">
          <span className="text-gray-700">Description:</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 mt-1 border rounded-lg focus:ring focus:ring-blue-200"
            placeholder="Enter file description"
          />
        </label>

        

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
