import MonacoEditor from "@monaco-editor/react";
type EditorProps = {
  code: string;
  onCodeChange: (value: string | undefined) => void;
};
export default function Editor({ code, onCodeChange }: EditorProps) {
  return (
    <MonacoEditor
      height="90vh"
      defaultLanguage="javascript"
      theme="vs-dark"
      value={code}
      onChange={onCodeChange}
    />
  );
}
