let mysql = require('../config/mysqlconfig.js');
let jwt = require('jsonwebtoken');
let jwtconfig = require('../config/jwtconfig.js');
let utils = require('../common/utils.js');
let bcrypt = require('bcrypt-nodejs');

let generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

let validPassword = function(password, passwordrecv) {
    console.log('validPassword');
    return bcrypt.compareSync(password, passwordrecv);
};

let getUser = function(userjson, callback){

    if ('username' in userjson && 'password' in userjson){
        //let getUserQuery = "select * from users";
        //let getUserQuery = "select prefdata from users, userinfo where users.id = userinfo.id and userinfo.preftag = ? and users.name = ?;";
        let getUserQuery = "select users.id id, prefdata from users, userinfo where users.id = userinfo.id and userinfo.preftag = ? and users.name = ?";
        mysql.getmysqlconnandrun(callback, mysql.queryErrSucc(getUserQuery, ['LOGIN_SETTINGS', userjson.username], function(err){
            callback(err, null, "Error while Querying");
        }, function(userres){
            console.log('results ', JSON.stringify(userres));
            if (userres != null && userres.length == 1 && 'prefdata' in userres[0]){
                let i = 0;
                let usermeta = JSON.parse(userres[i].prefdata);

                if ("password" in usermeta && validPassword(userjson.password, usermeta.password)){
                    return callback(null, {"userid":userres[i].id, "username":userjson.username}, "User validated");
                }else{
                    return callback({"msg":"Password not valid"}, null, "Invalid Password");
                }
            }else {
                return callback({"msg": "Username not valid"}, null, "Invalid user");
            }
        }));
    }else
        return callback({"msg":"Username and password is required for local login"}, null, "Username not in request");
};

let getToken = function (userjson, callback) {
    let result = {};
    result.userid = userjson.userid;
    result.username = userjson.username;

    let token = jwt.sign({"userinfo":result}, jwtconfig.secret, {"expiresIn":3600000});
    callback(null, {"token":token, "userinfo":userjson}, "Token successfully generated");
};

let getUserWithToken = function(userjson, callback){
    getUser(userjson, function(err, result, msg){
        if (err != null){
            callback(err, result, msg);
        }else{
            console.log("RESULTS ", result);
            let token = jwt.sign({"userinfo":result}, jwtconfig.secret, {"expiresIn":3600000});
            callback(null, {"token":token, "userinfo":result}, "Token successfully generated");
        }
    });
};

let decodeToken = function(token, callback){
    if (token){
        jwt.verify(token, jwtconfig.secret, function(err, decoded) {
            return callback(err, decoded);
        });
    }else{
        return callback({"msg":"Please give the token"}, null);
    }
};

let verifyToken = function(req, res, next){
    console.log(req.body);
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token){
        jwt.verify(token, jwtconfig.secret, function(err, decoded) {
            if (err) {
                return utils.authFailure('Failed to authenticate the token', res);
            }else{
                console.log("decoded successfully");
                console.log(decoded);
                req.tokend = decoded;
                next();
            }
        });
    }else{
        utils.authFailure("Token not found", res);
    }
};
exports.generateHash = generateHash;
exports.getUser = getUser;
exports.getUserWithToken = getUserWithToken;
exports.verifyToken = verifyToken;
exports.decodeToken = decodeToken;
exports.validPassword = validPassword;
exports.getToken = getToken;/**
 * Created by intellicar-rinas on 2/2/18.
 */
