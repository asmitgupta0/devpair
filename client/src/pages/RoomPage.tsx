import { useParams } from "react-router";
import Editor from "../components/Editor";
import { useState } from "react";
export default function RoomPage() {
  const { roomId } = useParams();
  const [code, setCode] = useState("// type your code here");
  console.log(code);
  function handleCodeChange(value: string | undefined) {
    setCode(value ?? "");
  }
  return (
    <>
      <h3>RoomPage</h3>
      <h4>RoomID = {roomId}</h4>
      <Editor code={code} onCodeChange={handleCodeChange} />
    </>
  );
}
