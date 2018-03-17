/**
 * Created by intellicar-rinas on 16/2/18.
 */


let compression = require('compression');
let express     = require('express');
let bodyParser  = require('body-parser');
let morgan      = require('morgan');
let jwt         = require('jsonwebtoken');
let utils = require('./app/common/utils.js');
let appconfig = require('./app/config/appconfig.js');
let commonAPIs = require('./app/commonAPIs/commonAPIs');

let app = express();

let http = require('http').Server(app);
let io = require('socket.io')(http);

let mqtt = require('mqtt');
let mqttclient = mqtt.connect('mqtt://localhost');
let mqttconnected = false;



/*
*
*
* */


app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

mqttclient.on('connect', function () {
    console.log('mqtt connected');
    mqttconnected = true;
});

mqttclient.subscribe('/paho/temperature/#');

mqttclient.on('message', function(topic, message) {
    onMQTT(message, topic);
});

io.on('connection', function(socket){
    socket.on('msg1', function(msg){
        console.log('Message from Socket Client', msg)
        sendToMQTT(msg);
    });
    console.log('a user connected');
    io.emit('msg', {type:'MESSAGE_FROM_SERVER', data:'Connected to Socket.io Successfully'})
});


/*
*
*
*
* */

const processMQTT =msg=> {
};

const onMQTT =(message, topic) => {
    let msgjson = message ? message.toString() : 'No Data';
    try {
        msgjson= JSON.parse(message.toString());
    } catch(e) {}
    io.emit('msg', {type:'MESSAGE_FROM_AR', data:msgjson});
    console.log('From MQTT => ', msgjson);
    processMQTT(msgjson);
};

const sendToMQTT =msg=> {
    console.log('Sending to MQTT =======>', msg);
    mqttclient.publish('/paho/t2', msg);
};

const getAssetTypes =()=> {
    commonAPIs.getssettypes({}, status=>{
        if(status.err) {
            setTimeout(getAssetTypes, 2000);
        } else {
            assettypeMap = status.data;
        }
    });
};

const checkStatus =()=> {
    commonAPIs.checkstatus({}, data=> {
        for(let assettypeid in data.data) {
            let cmd=null;
            // let assettypeid = data.data[idx].assettypeid;
            switch (assettypeid) {
                case '1':
                    cmd = data.data[assettypeid] ? commandMap.MOTOR.ON : commandMap.MOTOR.OFF;
                    break;

                case '2':
                    cmd = data.data[assettypeid] ? commandMap.TUBELIGHT.ON : commandMap.TUBELIGHT.OFF;
                    break;
            }
            if(cmd !== null) {
                sendToMQTT(cmd)
            }
        }
    });
};

/*
*
*
*
* */

let commandMap = {
    MOTOR: { ON:'a', OFF: 'b' },
    TUBELIGHT: { ON:'c', OFF: 'd' },
    COMMON: { REQSTATUS: 'e'}
};

let assettypeMap = null;

http.listen(appconfig.wsport, function(){
     console.log('Client Connected to Socket IO', appconfig.wsport);
    // io.emit('msg', 'connected')
    setInterval(()=>{
        checkStatus();
        sendToMQTT(commandMap.COMMON.REQSTATUS);
    }, 10000);
});

app.post('/', function (req, res) {
    utils.succReply('','test success',res);
});



