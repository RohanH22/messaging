var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http')
var server = http.createServer(app);
var io = require('socket.io')(server)
// const http = require('http').createServer(app);
// const io = require('socket.io')(http);

var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//DataBase Url 
var dbUrl = 'mongodb+srv://rohanhunakuppi:HN9T6qcBQqv17veo@learning-node.4vlvfa8.mongodb.net/test'
var Message = mongoose.model('Message', {
    name: String,
    message: String
})

// var messages = [
//     {
//         name:'',
//         message: ''
//     }
// ]
app.get('/messages', (req, res) => {
    Message.find({}).then((messages) => {
        res.send(messages)
    }).catch((err) => {
        console.error(err);
        res.sendStatus(500);
    })
    // res.send(messages)
})
app.post('/messages', (req, res) => {
    // console.log(req.body);
    var message = new Message(req.body)
    message.save()
        .then(() => {
            //   messages.push(req.body);
            io.emit('message', req.body);
            res.sendStatus(200);
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});

io.on('connection', (socket) => {
    console.log('connected');
})
//DataBase connection 
mongoose.connect(dbUrl)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB!');
});

var server = server.listen(3000, () => {
    console.log('server is on port', server.address().port);
})
