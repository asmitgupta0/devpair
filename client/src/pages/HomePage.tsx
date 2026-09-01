import { useNavigate } from "react-router";
import { useState } from "react";

function HomePage() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  async function handleCreateRoom() {
    const res = await fetch("http://localhost:5000/rooms", { method: "POST" });

    const newRoomId = (await res.json()).roomId;
    navigate(`/room/${newRoomId}`);
  }

  async function handleJoinRoom(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (roomId.trim() === "") return;
    const res = await fetch(`http://localhost:5000/rooms/${roomId}`, {
      method: "GET",
    });
    if (!res.ok) {
      return;
    }
    const room = await res.json();
    navigate(`/room/${roomId}`, { state: room });
  }
  return (
    <div>
      <h1>DevPair</h1>
      <h3>HomePage</h3>
      <p>Practice interviews together in real time.</p>
      <section>
        <button type="button" onClick={handleCreateRoom}>
          Create Room
        </button>
        <form onSubmit={handleJoinRoom}>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
          />
          <button type="submit">Join Room</button>
        </form>
      </section>
    </div>
  );
}

export default HomePage;
