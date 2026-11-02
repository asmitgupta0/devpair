import { useNavigate } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router";

type HomePageProps = {
  handleLogout: () => Promise<void>;
  authenticated: boolean;
};

function HomePage({ handleLogout, authenticated }: HomePageProps) {
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

  type RoomSummary = {
    roomId: string;
    language: string;
  };

  const [myRooms, setMyRooms] = useState<RoomSummary[]>([]);
  async function getMyRooms() {
    const response = await fetch("http://localhost:5000/rooms/mine", {
      credentials: "include",
    });

    if (!response.ok) {
      console.log("Could not fetch rooms:", response.status);
      return;
    }

    const data = await response.json();
    setMyRooms(data.rooms);
  }

  useEffect(() => {
    if (authenticated) {
      getMyRooms();
    }
  }, [authenticated]);

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

      {authenticated && (
        <section>
          <h3>My Rooms</h3>

          {myRooms.length === 0 ? (
            <p>You haven't created any rooms yet.</p>
          ) : (
            myRooms.map((room) => (
              <div key={room.roomId}>
                <Link to={`/room/${room.roomId}`}>{room.roomId}</Link>
                <p>{room.language}</p>
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
}

export default HomePage;
