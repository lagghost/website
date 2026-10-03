import express from "express";
import http from "http";
import { Server } from "socket.io";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "messages.json");

function loadMessages() {
  try { return JSON.parse(fs.readFileSync(dataFile, "utf8")); }
  catch { return []; }
}
function saveMessages(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), "utf8");
}

let messages = loadMessages();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", socket => {
  socket.on("user:message", ({ body }) => {
    if (typeof body !== "string") return;
    body = body.trim().slice(0, 2000);
    if (!body) return;

    const message = {
      id: Date.now() + Math.random(),
      sender: "user",
      body,
      createdAt: new Date().toISOString()
    };

    messages.push(message);
    saveMessages(messages);
    io.emit("chat:message", message);
  });

  socket.on("host:message", ({ body }) => {
    if (typeof body !== "string") return;
    body = body.trim().slice(0, 2000);
    if (!body) return;

    const message = {
      id: Date.now() + Math.random(),
      sender: "host",
      body,
      createdAt: new Date().toISOString()
    };

    messages.push(message);
    saveMessages(messages);
    io.emit("chat:message", message);
  });

  socket.on("host:history", () => {
    socket.emit("host:history", messages);
  });

  socket.on("user:panic", () => {
    io.emit("host:panic", {
      message: "The user pressed the clear button.",
      createdAt: new Date().toISOString()
    });
  });
});

app.get("/health", (_, res) => res.json({ ok: true }));

const port = Number(process.env.PORT || 3000);
server.listen(port, () => {
  console.log(`ChatGPT v2612 running on http://localhost:${port}`);
});
