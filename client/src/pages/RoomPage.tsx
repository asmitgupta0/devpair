import { useParams } from "react-router";
import Editor from "../components/Editor";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router";
import socket from "../services/socket";

export default function RoomPage() {
  const location = useLocation();
  const { roomId } = useParams();
  const [code, setCode] = useState("// type your code here");
  const [lang, setLang] = useState<string | null>(null);

  function handleCodeChange(value: string | undefined) {
    const newCode = value ?? "";
    setCode(newCode);
    socket.emit("editor:change", newCode, roomId);
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

  async function handleJoinRoom() {
    let room = location.state;

    if (!room) {
      const res = await fetch(`http://localhost:5000/rooms/${roomId}`, {
        method: "GET",
      });
      if (!res.ok) {
        return;
      }
      room = await res.json();
    }

    setLang(room.language);
    setCode(room.code);
    socket.emit("room:join", roomId);
  }

  const [connectionStatus, setConnectionStatus] = useState(
    socket.connected ? "Connected! 🟢" : "Not Connected! 🔴",
  );

  useEffect(() => {
    if (socket.connected) {
      console.log("socket connected already!");
      setConnectionStatus("Connected! 🟢");
      handleJoinRoom();
    }

    const handleConnect = () => {
      console.log("socket connected now!");
      setConnectionStatus("Connected! 🟢");
      handleJoinRoom();
    };

    const handleDisconnect = () => {
      console.log("socket disconnected");
      setConnectionStatus("Not Connected! 🔴");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    const handleEditorChange = (recievedCode: string) => {
      setCode(recievedCode);
    };

    socket.on("editor:change", handleEditorChange);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("editor:change", handleEditorChange);
    };
  }, []);
  // if (!lang) return <p>Loading room...</p>;

  return (
    <>
      <h3>RoomPage</h3>
      <h4>RoomID = {roomId}</h4>
      <button onClick={copyRoomLink}>
        {!isCopied ? "Copy Link" : "copied!"}
      </button>
      <p>Connection: {connectionStatus}</p>
      <p>Language: {lang ?? "Loading..."}</p>
      <Editor
        code={code}
        onCodeChange={handleCodeChange}
        language={lang ?? "java"}
      />
    </>
  );
}
