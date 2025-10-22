import React, { useEffect, useState } from "react";
import FolderItem from "./FolderItem";
import { fetchUserProjects } from "../api/projectApi";
import { fetchFolderContents } from "../api/fileApi";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ onSelectFile, onSelectProject }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [rootItems, setRootItems] = useState([]);

  // 🔹 Load user's projects on mount
  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchUserProjects(user._id);
      setProjects(data.projects || []);
    };
    if (user) loadProjects();
  }, [user]);

  // 🔹 Load folder structure when project changes
  useEffect(() => {
    const loadStructure = async () => {
      if (!activeProject) return;
      const data = await fetchFolderContents(null, activeProject._id);
      setRootItems(data.items || []);
      onSelectProject(activeProject);
    };
    loadStructure();
  }, [activeProject]);

  const handleNewProject = async () => {
    const name = prompt("Enter new project name:");
    if (!name) return;

    const res = await fetch("http://localhost:5000/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, userId: user._id }),
    });
    const data = await res.json();

    if (res.ok) {
      alert(`✅ Project "${name}" created!`);
      setProjects((prev) => [data.project, ...prev]);
      setActiveProject(data.project); // 👈 auto-load its folders
    } else {
      alert(data.message || "Error creating project");
    }
  };

  return (
    <div className="w-64 h-screen bg-[#121212] border-r border-gray-800 p-3 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-gray-300 text-sm font-semibold">Projects</h2>
        <button
          onClick={handleNewProject}
          className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1 rounded"
        >
          + New
        </button>
      </div>

      {/* 🔹 Project list */}
      <div className="mb-4">
        {projects.length > 0 ? (
          projects.map((p) => (
            <div
              key={p._id}
              onClick={() => setActiveProject(p)}
              className={`cursor-pointer text-sm px-2 py-1 rounded mb-1 ${
                activeProject?._id === p._id
                  ? "bg-blue-700 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {p.name}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No projects yet.</p>
        )}
      </div>

      {/* 🔹 Folder Structure */}
      {activeProject && (
        <>
          <h3 className="text-gray-400 text-xs uppercase mb-2 px-2">
            Files in {activeProject.name}
          </h3>
          {rootItems.map((item) => (
            <FolderItem
              key={item._id}
              item={item}
              projectId={activeProject._id}
              onSelectFile={onSelectFile}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Sidebar;
