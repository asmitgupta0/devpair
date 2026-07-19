import { useParams } from "react-router";
export default function RoomPage() {
  const { roomId } = useParams();
  return (
    <>
      <h3>RoomPage</h3>
      <h4>RoomID = {roomId}</h4>
    </>
  );
}
