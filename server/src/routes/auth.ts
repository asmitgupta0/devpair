import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

function hasRequiredFields(body) {
  if (!body.username || !body.email || !body.password) return false;
  return true;
}
async function isUnique(body) {
  const user = await User.findOne({
    $or: [{ username: body.username }, { email: body.email }],
  });
  if (!user) return true;
  return false;
}

async function saveUser(body, hashedPwd) {
  return User.create({
    username: body.username,
    email: body.email,
    passwordHash: hashedPwd,
  });
}

router.post("/register", async (req, res) => {
  console.log("received user: ", req.body);
  if (!hasRequiredFields(req.body))
    return res.status(400).json({ error: "required fields cannot be empty!" });
  if (!(await isUnique(req.body)))
    return res
      .status(400)
      .json({ error: "user with this email or username already exists" });

  const hashedPwd = await bcrypt.hash(req.body.password, 10);
  const newUser = await saveUser(req.body, hashedPwd);
  return res.status(201).json({
    success: "user created successfully!",
    username: newUser.username,
    email: newUser.email,
  });
});

export default router;
