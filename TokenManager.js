const jwt = require('jsonwebtoken');
const secretKey = 'gizliAnahtar';


function createToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: '1d' });
}
function verifyToken(token) {
    try {
        const decodedToken = jwt.verify(token, secretKey);
        return decodedToken;
    } catch (error) {
        return null;
    }
}

module.exports = {
    createToken: createToken,
    verifyToken : verifyToken
  };
  