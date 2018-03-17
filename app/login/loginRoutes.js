module.exports = function(app, console){
    let login = require('./login.js');
    let utils = require('../common/utils.js');

    app.post('/gettoken', function(req, res){
        console.log("req ", JSON.stringify(req.body));
        if (req.body.user)
            login.getUserWithToken(req.body.user, utils.generalCallback(res));
        else
            utils.failReply({"udfe":"USERDETAILS_INVALID"}, "Please provide user details", res);
    });

    app.post('/verifytoken', login.verifyToken, function(req, res){
        utils.succReply(req.tokend, "Token valid", res);
    });

    console.log("Installing TOKEN Routes");
};
/**
 * Created by intellicar-rinas on 2/2/18.
 */
