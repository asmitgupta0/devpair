import MonacoEditor from "@monaco-editor/react";
export default function Editor() {
  return (
    <MonacoEditor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// type your code here"
      theme="vs-dark"
    />
  );
}
