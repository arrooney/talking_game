
class Server {
    constructor() {
        this.express = require('express');
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
        this.setup();
    }
    
    setup() {
        this.io.on("connection", (socket) => {
            /*  RX EVENTS  */
            socket.on("test", (data) => {
                console.log(data);
            });
        });
    }
}

let main = () => {
    let server = new Server();
};

main();
