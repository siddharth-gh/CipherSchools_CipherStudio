import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Editor from "../components/Editor";
import { getFile } from "../api/fileApi";

export default function Home() {
  const [activeFile, setActiveFile] = useState(null);
  const [activeProject, setActiveProject] = useState(null);

  const handleSelectFile = async (file) => {
    if (file.type !== "file") return;

    try {
      const data = await getFile(file._id);
      if (data && data.content !== undefined && data._id) {
        setActiveFile(data);
      } else {
        alert("Failed to load file content.");
      }
    } catch (err) {
      console.error("❌ Error loading file:", err);
    }
  };

  

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a] text-white">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onSelectFile={handleSelectFile}
          onSelectProject={setActiveProject}
        />
        <Editor file={activeFile} />
      </div>
    </div>
  );
}
