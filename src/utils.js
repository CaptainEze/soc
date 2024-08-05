const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {JWT_TOKEN, saltRounds} = require('../config/tokens');

class Utils {
    serverError = (res) =>{
        res.status(500).json({
            status:99,
            message:'Server error. Try again!'
        });
    }
    getContentType = (req) => {
        if (req && req.headers && req.headers['content-type']) {
            return req.headers['content-type'];
        }
        return null;
    }
    matchContentType = (req,arr) => {
        let contentType = this.getContentType(req);
        let contentMatched = false;
        for(let e of arr){
            if(RegExp(`^${e}`).test(contentType)){
                contentMatched = true;
                break;
            }
        }
        return contentMatched;
    }
    generateOtp = () => crypto.randomInt(100000,999999).toString();
    signJWT = (payload,time) => jwt.sign(payload,JWT_TOKEN,{expiresIn:time});
    decryptJWT = (token) =>{
        try{
            let decoded = jwt.verify(token,JWT_TOKEN);
            return decoded;
        } catch (err) {
            if(err.name === 'TokenExpiredError') return err.name;
            return null
        }
    }
    hash = (str) => bcrypt.hash(str,saltRounds);
    compare = (str,token) => bcrypt.compare(str,token);
    randomPassKey = () =>{
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let pas = "";
        for (let i = 0; i < 12; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            pas += charset[randomIndex];
        }
        return pas;
    }
}

module.exports = new Utils();