import { useNavigate } from "react-router";

function HomePage() {
  const navigate = useNavigate();

  function handleCreateRoom() {
    const roomId = crypto.randomUUID();
    console.log("room id: ", roomId);
    navigate(`/room/${roomId}`);
  }
  return (
    <>
      <div>
        <h1>DevPair</h1>
        <h3>HomePage</h3>
        <p>Practice interviews together in real time.</p>
        <button type="button" onClick={handleCreateRoom}>
          Create Room
        </button>
      </div>
    </>
  );
}

export default HomePage;
