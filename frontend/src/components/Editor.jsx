import React, { useEffect, useState } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";

export default function Editor({ file }) {
  const [files, setFiles] = useState({});
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("Saved");

  // 🧩 Whenever a file changes
  useEffect(() => {
    if (file && file.name && file.content !== undefined) {
      const ext = file.name.split(".").pop();
      let path = `/src/${file.name}`;

      // Place HTML files correctly
      if (ext === "html") path = `/public/${file.name}`;

      // 🧠 Define a minimal React project structure
      const baseFiles = {
        "/src/App.js": {
          code:
            ext === "js" || ext === "jsx"
              ? file.content
              : `export default function App() { return <h1>Hello ${file.name}</h1>; }`,
        },
        "/src/index.js": {
          code: `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);`,
        },
        "/public/index.html": { code: `<div id="root"></div>` },
      };

      // 🧩 If current file is NOT App.js, include it too
      if (path !== "/src/App.js" && !path.includes("html")) {
        baseFiles[path] = { code: file.content, active: true };
      }

      setFiles(baseFiles);
      setCode(file.content);
      setStatus("Loaded ✓");
    }
  }, [file]);

  // 💾 Save to backend
  const saveFileChanges = async (
    fileId,
    content,
    language,
    mimeType = "text/plain"
  ) => {
    try {
      setSaving(true);
      const res = await fetch(`http://localhost:5000/api/files/${fileId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, language, mimeType }),
      });
      const data = await res.json();
      if (res.ok) setStatus("Saved ✓");
      else {
        setStatus("Error saving");
        console.error("❌ Error:", data.message);
      }
    } catch (err) {
      console.error("❌ Save failed:", err);
      setStatus("Error");
    } finally {
      setSaving(false);
    }
  };

  // 🧠 Track code typing
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setStatus("Unsaved...");
  };

  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a file from the sidebar to open it.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] text-white">
      {/* 🧭 Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
        <h3 className="text-sm text-gray-300">{file.name}</h3>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs ${
              status.includes("Error")
                ? "text-red-400"
                : status.includes("Unsaved")
                ? "text-yellow-400"
                : "text-green-400"
            }`}
          >
            {status}
          </span>
          <button
            onClick={() => {
              if (!file?._id) {
                alert("⚠️ File ID missing — cannot save!");
                return;
              }
              saveFileChanges(file._id, code, file.language);
            }}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm rounded"
          >
            {saving ? "Saving..." : "💾 Save"}
          </button>
        </div>
      </div>

      {/* 🧱 Sandpack */}
      <div className="flex-1">
        <Sandpack
          theme="dark"
          files={files}
          template="react"
          options={{
            showTabs: true,
            showLineNumbers: true,
            resizablePanels: true,
            showNavigator: false,
            editorHeight: "80vh",
          }}
          onChange={handleCodeChange}
        />
      </div>
    </div>
  );
}
