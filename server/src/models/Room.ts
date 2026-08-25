import mongoose, { model, Schema } from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
  },
  { timestamps: true },
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
