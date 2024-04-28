
const express = require('express');
const createPerson = require('./CreatePerson');
const bodyParser = require('body-parser');
//const sendEmail = require('./EmailManager/Manager.js');
const cors = require('cors');
const Loginperson = require('./LoginPerson');

const app = express();
app.use(bodyParser.json()); // JSON formatındaki gövdeleri işlemek için
app.use(cors());
// X-Powered-By başlığını değiştir
app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'ByteBuster');
    next();
  });
  


// Güncelleme rotası
app.post('/createPerson', createPerson);
app.post('/loginPerson', Loginperson);



// Sunucuyu dinle
app.listen(3001, () => {
    console.log('Sunucu çalışıyor...');
    
});
