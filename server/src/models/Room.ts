import mongoose, { Schema } from "mongoose";
import User from "./User.js";

const roomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
  },
  { timestamps: true },
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
