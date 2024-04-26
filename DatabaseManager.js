const mysql = require('mysql');

const dbConfig = {
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'websitedata'
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Veritabanı bağlantısı başarısız oldu: ' + err.stack);
    return;
  }

  console.log('Veritabanı bağlantısı başarıyla sağlandı');
});

function ekleVeri(username, name, surname, email, referanceNumber, invitingId, phoneNumber, hashedToken) {

 
      const insertSql = `INSERT INTO accounts (Username, Name, Surname, Email, ReferanceNumber, InvitingId, PhoneNumber, HashedToken) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const insertValues = [username, name, surname, email, referanceNumber, invitingId, phoneNumber, hashedToken];

      connection.query(insertSql, insertValues, (err, result) => {
        if (err) throw err;
        console.log('Veri başarıyla eklendi');
      });
   
}


function checkDuplicate(username, email, phoneNumber, callback) {
  const query = `
      SELECT
          CASE WHEN EXISTS (SELECT 1 FROM accounts WHERE Username = ?) THEN 1 ELSE 0 END AS username,
          CASE WHEN EXISTS (SELECT 1 FROM accounts WHERE Email = ?) THEN 1 ELSE 0 END AS email,
          CASE WHEN EXISTS (SELECT 1 FROM accounts WHERE PhoneNumber = ?) THEN 1 ELSE 0 END AS phoneNumber
  `;

  connection.query(query, [username, email, phoneNumber], (err, results) => {
      if (err) {
          console.error("Veritabanı hatası:", err);
          return callback(err, null);
      }

      const duplicate = {
          username: results[0].username,
          email: results[0].email,
          phoneNumber: results[0].phoneNumber
      };

      callback(null, duplicate);
  });
}



module.exports = {
  addPerson: ekleVeri,
  checkDuplicate : checkDuplicate
};
