import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const router = express.Router();
const secret = process.env.JWT_SECRET;

if (secret === undefined) {
  throw new Error("JWT_SECRET is not defined");
}

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

router.post("/login", async (req, res) => {
  console.log("received user: ", req.body);

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(401)
      .json({ authenticated: false, err: "Invalid username or password" });

  console.log("matched user: ", user.username);

  const enteredPwd = req.body.password;
  const pwdHash = user.passwordHash;

  if (!(await bcrypt.compare(enteredPwd, pwdHash)))
    return res
      .status(401)
      .json({ authenticated: false, err: "Invalid username or password" });

  const token = jwt.sign({ userId: user._id.toString() }, secret, {
    expiresIn: "36h",
  });
  console.log("gen token: ", token);

  res.cookie("authToken", token, {
    httpOnly: true,
  });

  return res.status(200).json({
    authenticated: true,
    message: "logged in successfully!",
    username: user.username,
    email: user.email,
  });
});

export default router;
