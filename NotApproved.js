const DatabaseManager = require("./DatabaseManager");
const TokenManager = require("./TokenManager");
const bcrypt = require("bcrypt");

async function NotApproved(req, res) {
  if (!req.headers.authorization) {
    return res.status(403).json({ error: "No credentials sent!" });
  }

  const decodedToken = TokenManager.verifyToken(req.headers.authorization);
  if (!decodedToken) {
    return res.status(401).json({ error: "Invalid token!" });
  }

  const UsernameByToken = TokenManager.verifyToken(req.headers.authorization);
  DatabaseManager.GetUserByUsername(UsernameByToken.userName, (error, user) => {
    if (!user) {
      res.status(405).send("Bad token");
    } else {
      if (user.role != -1) {
        res.status(405).send("Not allowed");
        return;
      }

      DatabaseManager.GetUsersByNotApproved((error, users) => {
        if (error) {
          return res.status(401).json({ error: "database error" });
        }
        res.status(200).json(users);
      });
    }
  });
}

module.exports = NotApproved;
