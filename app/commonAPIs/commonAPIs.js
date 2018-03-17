/**
 * Created by intellicar-rinas on 12/2/18.
 */

let mysql = require('../config/mysqlconfig.js');
let jwt = require('jsonwebtoken');
let jwtconfig = require('../config/jwtconfig.js');
let utils = require('../common/utils.js');
let moment = require('moment');

let getssettypes = function(body, callback) {

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
    }, mysql.queryErrSucc('select * from assettype', [], handleFailure, handleSuccess));
};

let getstatus = function(body, callback) {

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
    }, mysql.queryErrSucc('select assettypeid,status from assetconfig', [], handleFailure, handleSuccess));
};

let getconfig = function(body, callback) {

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
    }, mysql.queryErrSucc('select * from assetconfig', [], handleFailure, handleSuccess));
};

let getTimeMap = {
    0:1000 * 60 * 60,
    1:1000 * 60,
    2:1000,
};

let getTimeLimit =arr=> {
    let time = 0;
    for(let idx=0; idx<3; idx++) {
        time += (parseInt(arr[idx]) || 0) * getTimeMap[idx];
    }
    return time;
};

let checkstatus = function(body, callback) {
    getconfig(body, status=> {
       if(status.err) {
           callback(status);
       } else {
           let config = status.data;
           let res = {};
           let now = Date.now() + (1000 * 60* 30) + ( 1000 * 60 * 60 * 5);
           for(let idx in config) {
                let confJSON = null;

                try {
                    confJSON = JSON.parse(config[idx].config);
                } catch (e) {}

                if(!confJSON)
                    continue;

                let starttime;
                let endtime;
                let today = moment(Date.now()).startOf('day');
                let status = null;

                for(let jdx in confJSON.timer) {
                    starttime = today + getTimeLimit(confJSON.timer[jdx].from);
                    endtime = today + getTimeLimit(confJSON.timer[jdx].to);
                    if(now >= starttime && now <= endtime) {
                        status = confJSON.timer[jdx].value;
                    }
                }

                if(status === null) {
                    status = confJSON.default;
                }
                res[config[idx].assettypeid] = status;
           }


           if(Object.keys(res).length === 0) {
               status.err = null;
               status.data = [];
               callback(status);
               return;
           }

           let succQueryCount = 0;

           const handleFailure =resp=> {
               status.err = true;
               callback(status);
           };

           const handleSuccess =resp=> {
                if(status.err) return;

                succQueryCount++;
                console.log(succQueryCount);
                if(Object.keys(res).length === succQueryCount) {
                    status.data = res;
                    callback(status);
                }
           };

           for(let assettypeid in res) {
               mysql.getmysqlconnandrun(() => {
                   status.err = true;
               }, mysql.queryErrSucc('update assetconfig set status=? where assettypeid=?', [res[assettypeid], assettypeid],
                   handleFailure, handleSuccess));
           }
       }
    });
};

let updateconfig = function(body, callback) {

    let status = {};
    let config = null;

    try {
        config = JSON.stringify(body.config);
    } catch (e) {}

    if(config === null) {
        status.err = true;
        callback(status);
        return;
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
    }, mysql.queryErrSucc('update assetconfig set config = ?, updatedat = ? where assettypeid=?', [config, Date.now(), body.assettypeid],
        handleFailure, handleSuccess));
};

exports.getconfig = getconfig;
exports.checkstatus = checkstatus;
exports.updateconfig = updateconfig;
exports.getstatus = getstatus;
exports.getssettypes = getssettypes;
