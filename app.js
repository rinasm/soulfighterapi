let compression = require('compression');
let express     = require('express');
let bodyParser  = require('body-parser');
let morgan      = require('morgan');
let jwt    = require('jsonwebtoken');
let http = require('http');


let appconfig = require('./app/config/appconfig.js');
let jwtconfig = require('./app/config/jwtconfig.js');
let mysqlconfig = require('./app/config/mysqlconfig.js');

let app = express();
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/userdocs', express.static(appconfig.userdoc_basedir));

// require('./app/login/loginRoutes.js')(app, console);
require('./app/APIList/APIListRoutes')(app, console);
require('./app/commonAPIs/commonAPIsRoutes')(app, console);

let server = http.Server(app);

server.listen(appconfig.apiport, function(){
    console.log('Platform REST API server listening at :' + appconfig.apiport);
});