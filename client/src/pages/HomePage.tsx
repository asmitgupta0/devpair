import { useNavigate } from "react-router";
import { useState } from "react";

type HomePageProps = {
  handleLogout: () => Promise<void>;
};

function HomePage({ handleLogout }: HomePageProps) {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  async function handleCreateRoom(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData.entries());
    console.log("selected lang: ", JSON.stringify(formJson.selectedLanguage));
    const res = await fetch("http://localhost:5000/rooms", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: formJson.selectedLanguage,
      }),
    });

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
        <form onSubmit={handleCreateRoom}>
          <label>
            Select room language:
            <select name="selectedLanguage">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </label>
          <button type="submit">Create Room</button>
        </form>

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
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default HomePage;
