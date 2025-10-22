import React, { useState } from "react";
import { fetchFolderContents, createFile } from "../api/fileApi";

const FolderItem = ({ item, projectId, onSelectFile }) => {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState([]);

  const toggleExpand = async () => {
    if (!expanded) {
      // Only fetch when expanding
      const data = await fetchFolderContents(item._id, projectId);
      setChildren(data.items || []);
    }
    setExpanded(!expanded);
  };

  const handleAdd = async (type) => {
    const name = prompt(`Enter ${type} name:`);
    if (!name) return;

    try {
      const res = await createFile({
        projectId,
        parentId: item._id,
        name,
        type,
      });

      if (res.file) {
        setChildren((prev) => [...prev, res.file]);
        alert(`✅ ${type} "${name}" created successfully`);
      } else {
        alert(res.message || "Error creating item");
      }
    } catch (err) {
      console.error("Error creating item:", err);
      alert("Error creating item");
    }
  };

  return (
    <div className="ml-3 mb-1">
      {/* Folder Header */}
      <div
        className="flex items-center justify-between cursor-pointer hover:bg-gray-800 px-2 py-1 rounded"
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-1">
          <span>{expanded ? "📂" : "📁"}</span>
          <span className="text-gray-200 text-sm">{item.name}</span>
        </div>

        {/* Add buttons */}
        <div className="flex items-center gap-1 opacity-70 hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAdd("file");
            }}
            className="text-xs bg-blue-600 px-1 rounded hover:bg-blue-700"
          >
            +F
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAdd("folder");
            }}
            className="text-xs bg-green-600 px-1 rounded hover:bg-green-700"
          >
            +D
          </button>
        </div>
      </div>

      {/* Folder Children */}
      {expanded && (
        <div className="ml-4 mt-1">
          {children.length > 0 ? (
            children.map((child) =>
              child.type === "folder" ? (
                <FolderItem
                  key={child._id}
                  item={child}
                  projectId={projectId}
                  onSelectFile={onSelectFile}
                />
              ) : (
                <div
                  key={child._id}
                  className="cursor-pointer px-2 py-1 text-sm text-gray-400 hover:bg-gray-800 rounded"
                  onClick={() => onSelectFile(child)}
                >
                  📄 {child.name}
                </div>
              )
            )
          ) : (
            <p className="text-xs text-gray-600 ml-2">Empty folder</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FolderItem;
