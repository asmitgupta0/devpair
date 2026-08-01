import { useParams } from "react-router";
import Editor from "../components/Editor";
import { useState } from "react";
import { useRef } from "react";
export default function RoomPage() {
  const { roomId } = useParams();
  const [code, setCode] = useState("// type your code here");
  function handleCodeChange(value: string | undefined) {
    setCode(value ?? "");
  }
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<number | null>(null);
  async function copyRoomLink() {
    try {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      timerRef.current = setTimeout(() => {
        setIsCopied(false);
        timerRef.current = null;
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
  return (
    <>
      <h3>RoomPage</h3>
      <h4>RoomID = {roomId}</h4>
      <button onClick={copyRoomLink}>
        {!isCopied ? "Copy Link" : "copied!"}
      </button>
      <p>🔴 Connection: Not Connected</p>
      <Editor code={code} onCodeChange={handleCodeChange} />
    </>
  );
}
