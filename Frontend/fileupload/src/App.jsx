import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FileList from "./Components/FileList";
import FileUpload from "./Components/FileUpload";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container  mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">File Management System</h1>
        <FileUpload />
        
        {/* "Show Files" Section */}
        <div className="flex justify-between items-center mb-4">
          
          <Link to="/allfiles">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              Go to all files
            </button>
          </Link>
        </div>

        
      </div>
    </div>
  );
}

function AllFilesPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-2xl font-bold">All Files Page</h1>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/allfiles" element={<FileList />} />
      </Routes>
    </Router>
  );
}

export default App;
