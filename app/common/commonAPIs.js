/**
 * Created by intellicar-rinas on 12/2/18.
 */
let mysql = require('../config/mysqlconfig.js');
let jwt = require('jsonwebtoken');
let jwtconfig = require('../config/jwtconfig.js');
let utils = require('../common/utils.js');

let getList = function(callback) {

    let status = {};

    const handleFailure =err=> {
        status.err = err;
        callback(status);
    };

    const handleSuccess =results=> {
        status.err = null;
        status.data = results;
        callback(status);
    };

    mysql.getmysqlconnandrun(()=>{
        status.err = true;
    }, mysql.queryErrSucc('select * from apilist', [], handleFailure, handleSuccess));
};

let create = function(body, callback) {

    let status = {};
    let name = body.name;
    let description = body.description;
    let meta = '';
    let createdat = Date.now();
    let updatedat = Date.now();
    let createdby = body.userid;

    try {
        meta = JSON.stringify(body.meta || {});
    } catch (e) {}

    let args = [name, description, meta, createdat, updatedat, createdby];
    for(let idx in args) {
        if(args[idx] == null || args[idx] == undefined) {
            status.err = true;
            callback(status);
            return;
        }
    }

    const handleFailure =err=> {
        status.err = err;
        callback(status);
    };

    const handleSuccess =results=> {
        status.err = null;
        status.data = results;
        callback(status);
    };

    mysql.getmysqlconnandrun(()=>{
        status.err = true;
    }, mysql.queryErrSucc('insert into apilist (name, description, meta, createdat, updatedat, createdby) values(?,?,?,?,?,?)',
        args, handleFailure, handleSuccess));
};

let update = function(body, callback) {

    let status = {};
    let name = body.name;
    let description = body.description;
    let meta = '';
    let updatedat = Date.now();
    let itemid = body.itemid;

    try {
        meta = JSON.stringify(body.meta || {});
    } catch (e) {}

    let args = [name, description, meta, updatedat, itemid];
    for(let idx in args) {
        if(args[idx] == null || args[idx] == undefined) {
            status.err = true;
            callback(status);
            return;
        }
    }

    const handleFailure =err=> {
        status.err = err;
        callback(status);
    };

    const handleSuccess =results=> {
        status.err = null;
        status.data = results;
        callback(status);
    };

    mysql.getmysqlconnandrun(()=>{
        status.err = true;
    }, mysql.queryErrSucc('update apilist set name = ?, description = ?, meta = ?, updatedat = ? where id=?',
        args, handleFailure, handleSuccess));
};


let deleteItem = function(body, callback) {

    let status = {};
    let itemid = body.itemid;

    let args = [itemid];
    for(let idx in args) {
        if(args[idx] == null || args[idx] == undefined) {
            status.err = true;
            callback(status);
            return;
        }
    }

    const handleFailure =err=> {
        status.err = err;
        callback(status);
    };

    const handleSuccess =results=> {
        status.err = null;
        status.data = results;
        callback(status);
    };

    mysql.getmysqlconnandrun(()=>{
        status.err = true;
    }, mysql.queryErrSucc('delete from apilist where id=?',
        args, handleFailure, handleSuccess));
};

// let getUser = function(userjson, callback){
//
//     if ('username' in userjson && 'password' in userjson){
//         //let getUserQuery = "select * from users";
//         //let getUserQuery = "select prefdata from users, userinfo where users.id = userinfo.id and userinfo.preftag = ? and users.name = ?;";
//         let getUserQuery = "select users.id id, prefdata from users, userinfo where users.id = userinfo.id and userinfo.preftag = ? and users.name = ?";
//         mysql.getmysqlconnandrun(callback, mysql.queryErrSucc(getUserQuery, ['LOGIN_SETTINGS', userjson.username], function(err){
//             callback(err, null, "Error while Querying");
//         }, function(userres){
//             console.log('results ', JSON.stringify(userres));
//             if (userres != null && userres.length == 1 && 'prefdata' in userres[0]){
//                 let i = 0;
//                 let usermeta = JSON.parse(userres[i].prefdata);
//
//                 if ("password" in usermeta && validPassword(userjson.password, usermeta.password)){
//                     return callback(null, {"userid":userres[i].id, "username":userjson.username}, "User validated");
//                 }else{
//                     return callback({"msg":"Password not valid"}, null, "Invalid Password");
//                 }
//             }else {
//                 return callback({"msg": "Username not valid"}, null, "Invalid user");
//             }
//         }));
//     }else
//         return callback({"msg":"Username and password is required for local login"}, null, "Username not in request");
// };

exports.getList = getList;
exports.create = create;
exports.update = update;
exports.delete = deleteItem;
