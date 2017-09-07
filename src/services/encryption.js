const config = require("config")
const crypto = require("crypto"),
  algorithm = "aes256",
  password = config.secret

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,"utf8","hex")
  crypted += cipher.final("hex")
  return crypted
}

function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,"hex","utf8")
  dec += decipher.final("utf8")
  return dec
}

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
}
