const dbManager = require("./DatabaseManager");
const tokenManager = require("./TokenManager");
const bcrypt = require("bcrypt");

function CreatePerson(req, res) {
  const { Username, Name, Surname, Email, InvitingId, PhoneNumber } = req.body;
  const requiredFields = [
    "Username",
    "Name",
    "Surname",
    "Email",
    "InvitingId",
    "PhoneNumber",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).send(`${field} boş bırakılamaz`);
    }
  }

  dbManager.checkDuplicate(Username, Email, PhoneNumber, (err, duplicate) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Veritabanı hatası");
    }

    if (duplicate.username) {
      return res.status(400).send("Bu kullanıcı adı zaten kullanımda");
    } else if (duplicate.email) {
      return res.status(400).send("Bu e-posta zaten kullanımda");
    } else if (duplicate.phoneNumber) {
      return res.status(400).send("Bu telefon numarası zaten kullanımda");
    } else {
      bcrypt.hash(Username, 12, function (err, hash) {
        // şifre olarak değiştirilicek
        if (err) {
          console.error("Hashing error:", err);
          return res.status(500).send("Hashleme hatası");
        }
        dbManager.addPerson(
          Username,
          Name,
          Surname,
          Email,
          "",
          InvitingId,
          PhoneNumber,
          hash
        );

        res.json({ accestoken: tokenManager.createToken({ Username, Email }) });
      });
    }
  });
}

module.exports = CreatePerson;
