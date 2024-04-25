// Öncelikle mysql modülünü yükleyin
const mysql = require('mysql');

// Veritabanı bağlantı ayarları
const dbConfig = {
  host: 'localhost',
  user: 'root', // MySQL kullanıcı adınız
  password: '', // MySQL şifreniz
  database: 'websitedata'
};

// Veritabanı bağlantısını oluşturun
const connection = mysql.createConnection(dbConfig);

// Veritabanı bağlantısını başlatın
connection.connect((err) => {
  if (err) {
    console.error('Veritabanı bağlantısı başarısız oldu: ' + err.stack);
    return;
  }

  console.log('Veritabanı bağlantısı başarıyla sağlandı');
});

// Veri ekleyen fonksiyon
// Veri ekleyen ve çakışmayı kontrol eden fonksiyon
function ekleVeri(username, name, surname, email, referanceNumber, invitingId, phoneNumber, hashedToken) {
  // Veritabanında aynı Username, Email veya PhoneNumber'a sahip bir kayıt var mı kontrol et

 
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



// Modül fonksiyonunu dışa aktarın
module.exports = {
  addPerson: ekleVeri,
  checkDuplicate : checkDuplicate
};
