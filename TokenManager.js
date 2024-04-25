const jwt = require('jsonwebtoken');
const secretKey = 'gizliAnahtar';


function createToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}
function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        console.error('Token doğrulanamadı:', error);
        return null;
    }
}
module.exports = {
    createToken: createToken,
    verifyToken : verifyToken
  };
  