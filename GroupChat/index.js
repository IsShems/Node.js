const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(bodyParser());

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "root",
  port: 5432,
});

app.post("/chat", (req, res) => {
  console.log(req.body);
  let groupName = req.body.groupName.toLowerCase();

  pool.query(
    `CREATE TABLE IF NOT EXISTS ${groupName} (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        fromUser VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `,
    (err, res) => {
      if (err) {
        throw err;
      }
      console.log(res.rows);
    }
  );

  res.send("ok");
});

io.on("connection", (socket) => {
  console.log("Пользователь подключился");

  socket.on("join group", (groupName) => {
    socket.join(groupName);
    console.log(`Пользователь присоединился к группе: ${groupName}`);
  });

  socket.on("chat message", (data) => {
    console.log("Сообщение: " + data.message);
    let message = data.message;
    let fromUser = data.fromUser;
    let groupName = data.groupName;

    pool.query(
      `INSERT INTO ${groupName} (message, fromUser) VALUES ($1, $2) RETURNING *`,
      [message, fromUser],
      (err, result) => {
        if (err) {
          throw err;
        }
        console.log(result.rows);
        io.to(groupName).emit("chat message", {
          message: message,
          fromUser: fromUser,
        });
      }
    );
  });

  socket.on("disconnect", () => {
    console.log("Пользователь отключился");
  });
});

server.listen(3000, () => {
  console.log("Сервер запущен на порту 3000");
});
