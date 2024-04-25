// delete.js
const dbManager = require('./DatabaseManager');
const tokenManager = require("./TokenManager");


function CreatePerson(req, res) {
    // İstekteki verileri işleyin veya başka bir işlem yapın

    const { Username, Name, Surname, Email, InvitingId, PhoneNumber } = req.body;
    const requiredFields = ['Username', 'Name', 'Surname', 'Email', 'InvitingId', 'PhoneNumber'];
    
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).send(`${field} boş bırakılamaz`);
        }
    }
    
    // Gerekli alanlar sağlandığında devam edin...

    // Veritabanında hangi alanın (Username, Email veya PhoneNumber) kullanımda olduğunu kontrol et
    dbManager.checkDuplicate(Username, Email, PhoneNumber, (err, duplicate) => {
        if (err) {
            console.error("Veritabanı hatası:", err);
            return res.status(500).send("Veritabanı hatası");
        }
        
        if (duplicate.username) {
            return res.status(400).send("Bu kullanıcı adı zaten kullanımda");
        } else if (duplicate.email) {
            return res.status(400).send("Bu e-posta zaten kullanımda");
        } else if (duplicate.phoneNumber) {
            return res.status(400).send("Bu telefon numarası zaten kullanımda");
        } else {
            // Veritabanına ekleme işlemini gerçekleştir
            dbManager.addPerson(Username, Name, Surname, Email, '', InvitingId, PhoneNumber, '');








          //  const token = 
            res.json({token : tokenManager.createToken({Username, Email})});
        }
    });
}


module.exports = CreatePerson;
    