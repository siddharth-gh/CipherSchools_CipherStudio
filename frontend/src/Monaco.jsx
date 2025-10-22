import Editor from "@monaco-editor/react";

export default function Monaco() {
  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// Start typing JS here..."
      theme="vs-dark"
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true,
      }}
    />
  );
}
