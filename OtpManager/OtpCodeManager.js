const DatabaseManager = require("../DatabaseManager");
const nodemailer = require("nodemailer");
require("dotenv").config();

const otpCodes = [];

const transporter = nodemailer.createTransport({
  host: process.env.host, // E-posta sunucunuzun adresi
  port: 465, // Genellikle 587 veya 465 portları kullanılır
  secure: true, // SSL kullanılıyor
  auth: {
    user: process.env.email, // E-posta adresiniz
    pass: process.env.pass, // E-posta adresinizin şifresi
  },
});

function generateVerificationCode() {
  let code = "";
  const characters = "0123456789";
  const codeLength = 6;

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return {
    code: code,
    createdAt: new Date(),
  };
}

function RemoveOTP(email, mail) {
  const foundEmailIndex = otpCodes.findIndex((item) => item.email === email);
  if (foundEmailIndex !== -1) {
    otpCodes.splice(foundEmailIndex, 1);
    return "E-posta başarıyla silindi";
  } else {
    return "E-posta bulunamadı";
  }
}

function isVerificationCodeValid(verificationObject) {
  const createdAt = verificationObject.otpCode.createdAt;
  const currentTime = new Date();
  const elapsedTimeMinutes = (currentTime - createdAt) / (1000 * 60); // Geçen süreyi dakika cinsinden hesapla
  console.log(elapsedTimeMinutes);
  return elapsedTimeMinutes <= 1;
}

module.exports = {
  otpCodes,
  generateVerificationCode,
  RemoveOTP,
  transporter,
  isVerificationCodeValid,
};
