/**
 * Created by intellicar-rinas on 12/2/18.
 */
module.exports = function(app, console){
    let commonAPIs = require('./commonAPIs.js');
    let utils = require('../common/utils.js');

    app.post('/api/asset/updateconfig', function(req, res){
        const callback =status=> {
            if(status.err) {
                utils.failReply(status.err, "CONFIG UPDATION FAILED", res);
            } else {
                utils.succReply(status.data, "CONFIG UPDATED SUCCESSFULLY", res);
            }
        };
        commonAPIs.updateconfig(req.body, callback);
    });

    app.post('/api/asset/getconfig', function(req, res){
        const callback =status=> {
            if(status.err) {
                utils.failReply(status.err, "CONFIG LIST FETCH FAILED", res);
            } else {
                utils.succReply(status.data, "CONFIG LIST FETCHED SUCCESSFULLY", res);
            }
        };
        commonAPIs.getconfig(req.body, callback);
    });

    app.post('/api/asset/checkstatus', function(req, res){
        const callback =status=> {
            if(status.err) {
                utils.failReply(status.err, "CONFIG LIST FETCH FAILED", res);
            } else {
                utils.succReply(status.data, "CONFIG LIST FETCHED SUCCESSFULLY", res);
            }
        };
        commonAPIs.checkstatus(req.body, callback);
    });
};