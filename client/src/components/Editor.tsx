import MonacoEditor from "@monaco-editor/react";
type EditorProps = {
  code: string;
  onCodeChange: (value: string | undefined) => void;
  language: string;
};
export default function Editor({ code, onCodeChange, language }: EditorProps) {
  console.log("Editor received language:", language);
  return (
    <MonacoEditor
      height="90vh"
      language={language}
      theme="vs-dark"
      value={code}
      onChange={onCodeChange}
    />
  );
}
