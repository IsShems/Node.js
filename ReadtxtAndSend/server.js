const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs").promises;

const app = express();
const HOST = 5000;
app.use(cors());
app.use(cookieParser());
const getText = async () => {
  try {
    const data = await fs.readFile("./files/file.txt");
    return data.toString();
  } catch (error) {
    console.error("Error reading file:", error);
    return "";
  }
};

app.get("/setCookie", async (req, res) => {
  try {
    let text = await getText();
    res.cookie("fileText", text, { httpOnly: true });
    res.send("Cookie set succesfully");
  } catch (error) {
    res.status(500).send("Error occured while setting cookie");
  }
});

app.listen(HOST, () => {
  console.log(`${HOST} works`);
});
