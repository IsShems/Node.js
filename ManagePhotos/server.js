const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Настройка CORS
app.use(cors());

// Создание хранилища для multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Маршрут для загрузки файлов
app.post("/upload", upload.array("photos", 10), (req, res) => {
  res.json({ message: "Files uploaded successfully!", files: req.files });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
