import express from "express";
import Room from "../models/Room.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const roomId = crypto.randomUUID();
  const newRoom = await new Room({
    roomId,
    code: "// type your code here",
    language: "javascript",
  }).save();
  console.log("New room doc created: ", newRoom);
  res.status(201).json({ roomId });
});

router.get("/:roomId", async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findOne({ roomId });
    if (!room) {
      console.log("room not found!");
      return res.status(404).json({ message: "No valid room found!" });
    } else {
      console.log("room found:", room);
      return res.status(200).json(room);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
