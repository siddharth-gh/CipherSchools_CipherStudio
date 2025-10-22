// src/api/fileApi.js
const BASE_URL = "http://localhost:5000";

// 🔹 Get all files/folders in a folder
export const fetchFolderContents = async (parentId = null, projectId) => {
    try {
        const url = `${BASE_URL}/api/folders/${parentId ?? "null"}?projectId=${projectId}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch folder contents");
        return await res.json();
    } catch (err) {
        console.error("Error fetching folder contents:", err);
        return { items: [] };
    }
};

// 🔹 Get file content from backend
export const fetchFileContent = async (fileId) => {
    try {
        const res = await fetch(`${BASE_URL}/api/files/${fileId}`);
        if (!res.ok) throw new Error("Failed to fetch file content");
        return await res.json();
    } catch (err) {
        console.error("Error fetching file content:", err);
        return { content: "" };
    }
};

export const getFile = async (fileId) => {
    try {
        const res = await fetch(`http://localhost:5000/api/files/${fileId}`);
        return await res.json();
    } catch (err) {
        console.error("❌ Error fetching file:", err);
        return { message: "Error fetching file" };
    }
};


export const createFile = async (fileData) => {
    try {
        const res = await fetch("http://localhost:5000/api/files", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fileData),
        });
        return await res.json();
    } catch (err) {
        console.error("Error creating file:", err);
        return { message: "Error creating file" };
    }
};

