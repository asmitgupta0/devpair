import express from "express";
import Room from "../models/Room.js";

const router = express.Router();

const starterTemplates = new Map<string, string>([
  [
    "javascript",
    `function solve() {
  // Write your solution here
}

solve();
`,
  ],
  [
    "python",
    `def solve():
    # Write your solution here
    pass

if __name__ == "__main__":
    solve()
`,
  ],
  [
    "cpp",
    `#include <bits/stdc++.h>
using namespace std;

void solve() {
    // Write your solution here
}

int main() {
    solve();
    return 0;
}
`,
  ],
  [
    "java",
    `import java.io.*;
import java.util.*;

public class Main {
    static void solve() {
        // Write your solution here
    }

    public static void main(String[] args) {
        solve();
    }
}
`,
  ],
]);

router.post("/", async (req, res) => {
  console.log("recieved lang: ", req.body.language);
  const roomId = crypto.randomUUID();
  const newRoom = await new Room({
    roomId,
    code: starterTemplates.get(req.body.language) ?? "//type your code here",
    language: req.body.language,
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
