const DatabaseManager = require("../DatabaseManager");
const dbManager = require("../DatabaseManager");
const tokenManager = require("../TokenManager");
const bcrypt = require("bcrypt");

async function Loginperson(req, res) {
  const { Username, Password } = req.body;
  const requiredFields = ["Username", "Password"];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).send(`${field} boş bıraklıamaz`);
    }
  }

  DatabaseManager.GetUserByUsername(Username, (error, user) => {
    console.table(user);
    if (error) {
      return res.status(500).send("Bir hata oluştu");
    }

    if (!user) {
      return res.status(404).send("Kullanıcı bulunamadı");
    }

    const matchCorrect = bcrypt.compareSync(Password, user.HashedToken);

    if (matchCorrect) {
      return res.status(200).json({
        token: tokenManager.createToken({
          userId: user.Id,
          userName: user.Username,
          userEmail: user.userEmail,
          role : user.role
        }),
      });
    } else {
      return res.status(200).send("pass incorrect");
    }
  });
}

module.exports = Loginperson;
