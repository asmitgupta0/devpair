import { useParams } from "react-router";
import Editor from "../components/Editor";
export default function RoomPage() {
  const { roomId } = useParams();
  return (
    <>
      <h3>RoomPage</h3>
      <h4>RoomID = {roomId}</h4>
      <Editor />
    </>
  );
}
