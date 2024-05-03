const express = require("express");
const createPerson = require("./CreatePerson");
const bodyParser = require("body-parser");
const cors = require("cors");
const Loginperson = require("./LoginPerson");

const app = express();

function customJsonMiddleware(req, res, next) {
  bodyParser.json()(req, res, (err) => {
    if (err) {
      return res.status(400).send("Gelen veri JSON formatında değil");
    }
    next();
  });
}

app.use(customJsonMiddleware);
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("X-Powered-By", "ByteBuster");
  next();
});

app.post("/createPerson", createPerson);
app.post("/loginPerson", Loginperson);

app.listen(3001, () => {
  console.log("Sunucu çalışıyor...");
});
