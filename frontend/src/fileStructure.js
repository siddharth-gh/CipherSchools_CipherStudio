// src/data/fileStructure.js

// Default folder + file structure for the IDE
export const defaultStructure = {
    name: "root",
    type: "folder",
    children: [
        {
            name: "src",
            type: "folder",
            children: [
                { name: "App.js", type: "file" },
                { name: "index.js", type: "file" },
            ],
        },
        {
            name: "public",
            type: "folder",
            children: [{ name: "index.html", type: "file" }],
        },
    ],
};

// You can also export an example files object for Sandpack
export const defaultFiles = {
    "/src/App.js": {
        code: `export default function App() {
  return <h1>Hello CipherStudio ⚡</h1>;
}`,
    },
    "/src/index.js": {
        code: `import ReactDOM from "react-dom/client";
import App from "./App";
ReactDOM.createRoot(document.getElementById("root")).render(<App />);`,
    },
    "/public/index.html": {
        code: `<div id="root"></div>`,
    },
};
