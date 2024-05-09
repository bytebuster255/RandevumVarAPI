const DatabaseManager = require("../DatabaseManager");
const OtpCodeManager = require("../OtpManager/OtpCodeManager");

async function OtpCodeSender(req, res) {
  const { Email } = req.body;
  const requiredFields = ["Email"];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).send(`${field} boş bıraklıamaz`);
    }
  }

  DatabaseManager.GetUserByEmail(Email, (error, user) => {
    if (error) {
      return res.status(500).send("Bir hata oluştu");
    }

    if (!user) {
      return res.status(404).send("Kullanıcı bulunamadı");
    }
  });

  const cleanedEmail = Email.replace(/\s/g, "");
  const firstEmail = cleanedEmail.split(",")[0];

  OtpCodeManager.RemoveOTP(firstEmail);
  const verificationCode = OtpCodeManager.generateVerificationCode();
  let htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
      <h2 style="color: #333; text-align: center;">RandevumVar</h2>
      <div style="background-color: #fff; padding: 20px; border-radius: 5px;">
          <h1 style="color: #007bff; text-align: center;">Merhaba,</h1>
          <p style="color: #333; text-align: center;">RandevumVar.com.tr üzerinde eşleşme sağlanmıştır. Aşağıda doğrulama kodu bulunmaktadır:</p>
          <div style="text-align: center; margin-top: 20px;">
              <span style="background-color: #007bff; color: #fff; padding: 10px 20px; font-size: 20px; border-radius: 5px;">${verificationCode.code}</span>
          </div>
          <p style="color: #333; text-align: center; margin-top: 20px;">Lütfen bu kodu kullanarak işlemi tamamlayınız.</p>
      </div>
  </div>
`;
  let mailOptions = {
    from: "noreply@randevumvar.com.tr", // Gönderici e-posta adresi
    to: firstEmail, // Alıcı e-posta adresi
    subject: "E-posta doğrulaması.", // E-posta konusu
    html: htmlContent, // E-posta içeriği (HTML)
  };
  const emailData = {
    email: firstEmail,
    otpCode: verificationCode,
  }; 
  OtpCodeManager.otpCodes.push(emailData);
  OtpCodeManager.transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("E-posta gönderilirken bir hata oluştu: ", error);
      res.send("bir hata oldu");
      return;
    }
    console.log("E-posta başarıyla gönderildi! ", info.response);
    res.send("tamamdır");
    return;
  });
}

module.exports = OtpCodeSender;
