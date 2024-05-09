const express = require("express");
const createPerson = require("./Api/CreatePerson");
const bodyParser = require("body-parser");
const cors = require("cors");
const Loginperson = require("./Api/LoginPerson");
const NotApproved = require("./Api/NotApproved");
const OtpCode = require("./Api/OtpCodeSender");
const OtpVerify = require("./Api/OtpVerify");
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
app.post("/notapproved", NotApproved);
app.post("/sendotp", OtpCode);
app.post("/verifyotp", OtpVerify);

app.listen(3001, () => {
  console.log("Sunucu çalışıyor...");
});
