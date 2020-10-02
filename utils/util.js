const crypto = require("crypto");
var jwt = require("jsonwebtoken");
var moment = require("moment");

// TODO: take const data to config
const API_KEY = "a18ff78e7a9e44f38de372e093d87ca1";
const API_SECRET = "9623ac03057e433f95d86cf4f3bef5cc";
const TOKEN_EXPIRE = 60 * 1000; //token expire time in seconds
const ENCODE_ALG = "HS256";

var setToken = () => {
  var tokenId = crypto.randomBytes(32).toString("base64");
  var issuedAt = moment().unix() - 10000;
  var notBefore = issuedAt;
  var expire = notBefore + TOKEN_EXPIRE;

  var payload = {
    iat: issuedAt, // Issued at: time when the token was generated
    jti: tokenId, // Json Token Id: an unique identifier for the token
    iss: API_KEY, // Issuer
    nbf: notBefore, // Not before
    exp: expire, // Expire
  };

  var token = jwt.sign(payload, API_SECRET, { algorithm: ENCODE_ALG });

  return token;
};

var getToken = (token) => {
  try {
    token = jwt.verify(token, API_SECRET, { algorithm: ENCODE_ALG });
  } catch (err) {
    log.error(err);
  }
  return token;
};

var geerongEncrypt = (text, key) => {
  var prefix = "Encrypt";
  var cipher = crypto.createCipheriv("aes-128-ecb", key, "");
  var encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  encrypted = `${prefix}${encrypted}`;
  return encrypted;
};

var geerongDecrypt = (encryptedData, key) => {
  try {
    var _encryptedData = encryptedData.substring(7); // remove prefix 'Encrypt'
    var decipher = crypto.createDecipheriv("aes-128-ecb", key, "");
    var decrypted = decipher.update(_encryptedData, "base64", "utf8");
    decrypted += decipher.final("utf8");
  } catch (e) {
    log.error("Data cannot decrypt");
    // throw { Message: 'Err: Data cannot decrypt' };
    throw `Error: cannot decrypt with "${encryptedData}"`;
  }

  return decrypted;
};

var createRSASignature = (requestText, privateKey) => {
  var sign = crypto.createSign("RSA-SHA1");
  sign.update(requestText);
  sign.end();
  var signature = sign.sign(privateKey, "base64");
  return signature;
};

var baokimVerifySignature = (responseText, signature, publicKey) => {
  const verify = crypto.createVerify("RSA-SHA1");
  verify.update(responseText);
  verify.end();
  return verify.verify(publicKey, Buffer.from(signature, "base64"));
};

module.exports = {
  setToken: setToken,
  getToken: getToken,
  geerongEncrypt: geerongEncrypt,
  geerongDecrypt: geerongDecrypt,
  baokimVerifySignature: baokimVerifySignature,
  createRSASignature: createRSASignature,
};
