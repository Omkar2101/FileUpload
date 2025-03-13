import React, { useEffect, useState } from "react";
import axios from "axios";

const FileDetails = ({ fileId, onClose }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5298/api/files/details/${fileId}`);
        setFile(res.data);
        setDescription(res.data.metadata?.description || "");
        
      } catch (err) {
        setError("Failed to load file details.",err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFileDetails();
  }, [fileId]);
  

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5298/api/files/${fileId}/update-details`, {
        description,
       
      });
      alert("File details updated successfully!");
      onClose();
    } catch (err) {
      alert("Error updating file details.",err);
    }
  };

  if (loading) return <p>Loading file details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">File Details</h2>
        <p className="mb-2"><strong>File Name:</strong> {file.fileName}</p>
        <p className="mb-2"><strong>Uploaded At:</strong> {new Date(file.uploadDate).toLocaleString()}</p>

        <label className="block font-semibold mb-2">
          Description:
          <p>{description}</p>
        </label>

        

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileDetails;
