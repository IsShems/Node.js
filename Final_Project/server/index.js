const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const http = require("http");
const socketIO = require("socket.io");
const multer = require("multer");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
 
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

mongoose.connect("mongodb://localhost:27017/mydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDb");
}).catch(err => {
  console.error("Error while connecting to MongoDB", err);
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true }
});

const userModel = mongoose.model("User", userSchema);

const chatSchema = new mongoose.Schema({
  message: { type: String, required: true },
  fromuser: { type: String, required: true },
  photos: { type: mongoose.Schema.Types.Mixed },
  nameoffile: { type: String },
  voice: { type: String },
  created_at: { type: Date, default: Date.now }
});

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));
 
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
app.use(express.static(__dirname + "/public"));
 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload-folder/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
 
const upload = multer({
  storage: storage,
  limits: { fileSize: 200 * 1024 * 1024 } 
});
 
app.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email are already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ username, password: hashedPassword, email });
    await newUser.save();
    res.status(201).json({ message: "User has been created successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }

});


app.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User was not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, "jIVFkR0aHb1eaKDUQRTor", { expiresIn: "1h" });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});
 
app.post('/voice-add', upload.single('audio'), (req, res) => {
  res.json({ file: req.file });
});
 
app.post('/upload-media', upload.array('photos'), (req, res) => {
  let mediaArray = [];
  console.log(req.files);
  req.files.forEach((item) => {
    if (item.mimetype.split('/')[0] === 'video') {
      mediaArray.push({
        fileType: item.mimetype,
        fileName: item.originalname,
      });
    }
  });
  res.json(mediaArray);
});
 
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
 
app.get("/download", function (req, res) {
  let fileName = req.query.nameoffile;
  const file = `${__dirname}/public/upload-folder/${fileName}`;
  res.download(file);
});
 
const getChatModel = (user1, user2) => {
  const collectionName = `${user1}and${user2}`;
  return mongoose.model(collectionName, chatSchema, collectionName);
};
 
io.on("connection", (socket) => {
  socket.on("join chat", async (users) => {
    console.log('Connecting to chat:', users);
    let user1 = users.userfirst.toLowerCase();
    let user2 = users.usersecond.toLowerCase();
    const ChatModel = getChatModel(user1, user2);
 
    try {
      const tempMessage = new ChatModel({ message: "initial", fromuser: "system" });
      await tempMessage.save();
      console.log(`Collection ${user1}and${user2}  was created`);
      await ChatModel.deleteOne({ message: "initial" }); 
    } catch (err) {
      console.error('Error occured while creating collection:', err);
    }
   });
 
  socket.on("read chat", async (users) => {
    let user1 = users.userfirst.toLowerCase();
    let user2 = users.usersecond.toLowerCase();
    const ChatModel = getChatModel(user1, user2);
 
    try {
      const docs = await ChatModel.find({});
      socket.emit("chat history", docs);
    } catch (err) {
      console.error('Error while reading the chat:', err);
      socket.emit('chat history', []);
    }
  });
 
  socket.on("chat message", async (msg) => {
    console.log('Message recieved:', msg);
    let user1 = msg.userfirst.toLowerCase();
    let user2 = msg.usersecond.toLowerCase();
    const ChatModel = getChatModel(user1, user2);
 
    const newMessage = new ChatModel({
      message: msg.message,
      fromuser: msg.fromuser,
      photos: msg.photos,
      nameoffile: msg.file ? msg.file.nameoffile : null,
      voice: msg.voice ? msg.voice : null
    });
 
    try {
      const savedMessage = await newMessage.save();
      console.log('Message was sent:', savedMessage);
    } catch (err) {
      console.error('Error while sending message:', err);
    }
  });
 
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
 
server.listen(3000, () => {
  console.log("Server started on 3000");
});