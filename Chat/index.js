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
  let user1 = req.body.userFirst.toLowerCase();
  let user2 = req.body.userSecond.toLowerCase();

  pool.query(
    `CREATE TABLE IF NOT EXISTS ${user1}and${user2} (
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

  io.on("connection", (socket) => {
    console.log("Пользователь подключился");

    console.log(req.body, 2);
    pool.query(`SELECT * FROM ${user1}and${user2}`, (err, res) => {
      if (err) {
        throw err;
      }
      console.log(res.rows);
      socket.emit("chat history", res.rows);
    });

    socket.on("chat message", (msg) => {
      console.log("Сообщение: " + msg);
      let mess = JSON.parse(msg);
      pool.query(
        `INSERT INTO ${user1}and${user2} (message, fromUser) VALUES ($1, $2) RETURNING *`,
        [mess.message, mess.fromuser]
      );

      io.emit("chat message", {
        message: mess.message,
        fromuser: mess.fromuser,
      });
    });

    socket.on("disconnect", () => {
      console.log("Пользователь отключился");
    });
  });
  res.send("ok");
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(3000, () => {
  console.log("Сервер запущен на порту 3000");
});
