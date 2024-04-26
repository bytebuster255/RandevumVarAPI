
const express = require('express');
const createPerson = require('./CreatePerson');
const bodyParser = require('body-parser');
//const sendEmail = require('./EmailManager/Manager.js');
const cors = require('cors');

const app = express();
app.use(bodyParser.json()); // JSON formatındaki gövdeleri işlemek için
app.use(cors());

// Güncelleme rotası
app.post('/createPerson', createPerson);


// Silme rotası

// Diğer rotaları buraya ekle...

// Sunucuyu dinle
app.listen(3001, () => {
    console.log('Sunucu çalışıyor...');
    
});
