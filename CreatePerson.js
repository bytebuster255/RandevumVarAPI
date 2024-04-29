const dbManager = require("./DatabaseManager");
const tokenManager = require("./TokenManager");
const bcrypt = require("bcrypt");

async function CreatePerson(req, res) {
  const { Username, Name, Surname, Email, InvitingId, PhoneNumber, Password } =
    req.body;
  const requiredFields = [
    "Username",
    "Name",
    "Surname",
    "Email",
    "InvitingId",
    "PhoneNumber",
    "Password",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).send(`${field} boş bırakılamaz`);
    }
  }

  dbManager.checkDuplicate(
    Username,
    Email,
    PhoneNumber,
    async (err, duplicate) => {
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
        try {
          const salt = await bcrypt.genSalt(14);
          console.log("Salt: ", salt);
          const hash = await bcrypt.hash(Password, salt);
          console.log("Hash: ", hash);
          dbManager.addPerson(
            Username,
            Name,
            Surname,
            Email,
            "",
            InvitingId,
            PhoneNumber,
            hash,
            (err, Id) => {
              console.log(Id);
              return res
                .status(200)
                .json({
                  token: tokenManager.createToken({
                    userId: Id,
                    userName: Username,
                  }),
                });
            }
          );

          // Yanıtı gönder
        } catch (error) {
          console.error(error.message);
          // Hata durumunda uygun bir yanıt gönder
          res.status(500).send("Bir hata oluştu");
        }
      }
    }
  );
}

module.exports = CreatePerson;
