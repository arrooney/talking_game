
class Server {
    constructor() {
        this.express = require('express');
        this.redis = require('redis');
        this.client = this.redis.createClient(); //creates a new client
        this.app = this.express();
        this.server = require('http').Server(this.app);
        this.io = require('socket.io').listen(this.server);
        this.app.use('/node_modules', this.express.static(__dirname + '/node_modules'));
        this.app.use('/static', this.express.static(__dirname + '/static'));
        this.app.get('/', (req, res) => {
            res.sendFile(__dirname+'/index.html');
        });

        this.server.listen(8081, () => { // Listens to port 80
            console.log('Listening on ' + this.server.address().port);
        });
        this.client.on('connect', function() {
            console.log('connected');
        });
        this.setup();
    }

    setup() {
        this.io.on("connection", (socket) => {
            this.socket = socket;
            this.centralServer();
        });
    }
    
    centralServer() {
        /*  RX EVENTS  */
        
        this.socket.on("newRoomRequest", (data, callback) => {
            this.Room = data;
            this.newRoom(callback);
        });

        this.socket.on("joinRoomRequest", (data, callback) => {
            this.Room = data;
            this.joinRoom(callback);
        });
    }

    joinRoom(callback) {
        this.client.hgetall(this.Room.name, function(err, resp) {
            if (resp === null) {
                console.log("did not exist");
                callback(false, null, "could not join room");
            } else {
                callback(true, resp, "joined room");
            }
        });
    }

    newRoom(callback) {
        this.client.exists(this.Room.name, function(err, reply) {
            if (reply === 1) {
                console.log('exists');
                callback(false, "room exists");
                return;
            } else {
                console.log('doesn\'t exist');
                this.client.hset(this.Room.name, "owner", this.socket.id);
                this.client.hset(this.Room.name, "suggestions", this.Room.suggestions);
                callback(true, "room has been created");
            }
        }.bind(this));
    }
}

let main = () => {
    let server = new Server();
};

main();
