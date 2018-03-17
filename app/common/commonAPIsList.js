/**
 * Created by intellicar-rinas on 12/2/18.
 */
module.exports = function(app, console){
    let APIList = require('./APIList.js');
    let utils = require('../common/utils.js');

    app.post('/api/apilist/getlist', function(req, res){
        const callback =status=> {
            if(status.err) {
                utils.failReply(status.err, "LIST FETCHED FAILED", res);
            } else {
                utils.succReply(status.data, "LIST FETCH SUCCESSFULLY", res);
            }
        };
        APIList.getList(callback);
    });

    app.post('/api/apilist/create', function(req, res){
        const callback =status=> {
            if(status.err) {
                utils.failReply(status.err, "FAILED TO CREATE API", res);
            } else {
                utils.succReply(status.data, "SUCCESSFULLY CREATE API", res);
            }
        };
        APIList.create(req.body, callback);
    });

    app.post('/api/apilist/update', function(req, res){
        const callback =status=> {
            if(status.err) {
                utils.failReply(status.err, "FAILED TO UPDATE API", res);
            } else {
                utils.succReply(status.data, "SUCCESSFULLY UPDATED API", res);
            }
        };
        APIList.update(req.body, callback);
    });

    app.post('/api/apilist/delete', function(req, res){
        const callback =status=> {
            if(status.err) {
                utils.failReply(status.err, "FAILED TO UPDATE API", res);
            } else {
                utils.succReply(status.data, "SUCCESSFULLY UPDATED API", res);
            }
        };
        APIList.delete(req.body, callback);
    });

};