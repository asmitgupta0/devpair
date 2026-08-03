import { useNavigate } from "react-router";
import { useState } from "react";

function HomePage() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  function handleCreateRoom() {
    const newRoomId = crypto.randomUUID();
    navigate(`/room/${newRoomId}`);
  }

  function handleJoinRoom(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (roomId.trim() === "") return;
    navigate(`/room/${roomId}`);
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
