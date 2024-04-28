const { User } = require("discord.js");
const DatabaseManager = require("./DatabaseManager");
const dbManager = require("./DatabaseManager");
const tokenManager = require("./TokenManager");
const bcrypt = require("bcrypt");

async function Loginperson(req, res) {
  const { LoginToken, Username } = req.body;
  const requiredFields = ["LoginToken", "Username"];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).send(`${field} boş bıraklıamaz`);
    }
  }

  DatabaseManager.GetUserByUsername(Username, (error, user) => {
    if (error) {
      return res.status(500).send("Bir hata oluştu");
    }

    if (!user) {
      return res.status(404).send("Kullanıcı bulunamadı");
    }

    const matchCorrect = bcrypt.compareSync(LoginToken, user.HashedToken);

    if (matchCorrect) {
      return res.status(200).json(user);
    } else {
      return res.status(200).send("pass incorrect");
    }
  });
}

module.exports = Loginperson;
