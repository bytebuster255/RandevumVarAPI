const mail = require("../OtpManager/OtpCodeManager");

async function OtpVerify(req, res) {
  const { Email, OtpCode } = req.body;
  const requiredFields = ["Email", "OtpCode"];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).send(`${field} boş bıraklıamaz`);
    }
  }

  if (OtpCode.length != 6) {
    res.send("lütfen geçerli bir kod giriniz");
    return;
  }

  const foundEmail = mail.otpCodes.find((item) => item.email === Email);
  if (foundEmail) {
    if (foundEmail.otpCode.code == OtpCode) {
      if (mail.isVerificationCodeValid(foundEmail)) {
        const foundEmailIndex = mail.otpCodes.findIndex(
          (item) => item.email === foundEmail
        );
        mail.otpCodes.splice(foundEmailIndex, 1);
        res.send("E posta doğrulanmıştır"); // burada databaseden girip onaylanıcak
        return;
      } else {
        res.send("Doğrulama kodunun süresi geçmiştir");
        return;
      }
    } else {
      res.send("Doğrulama kodu hatalı");
      return;
    }
  } else {
    res.send("Bu e posta adresine ait bir otp kodu bulunmamaktadır");
    return;
  }
}

module.exports = OtpVerify;
