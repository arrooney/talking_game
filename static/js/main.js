var app = angular.module("app", ['btford.socket-io']);

app.controller('myGame', ['$scope', 'socketFactory', function($scope, socketFactory) {
    class Player {
        constructor() {
            this.dom          = $scope;
            this.dom.Room     = {};
            this.dom.greeting = "The talking game 📢";
            this.socket       = socketFactory();
            this.roomExists   = false;
            this.setup();
        }

        setup() {
            // this.socket.emit("test", "my data");
        }
        
        createGame() {
            this.dom.greeting = "Creating game...";
            this.socket.emit("newRoomRequest", this.dom.Room, (resp, msg) => {
                console.log(msg);
                if(resp) {
                    this.dom.greeting = "Game created 🙌\nRoom name is \'" + this.dom.Room.name + "\'\nEach player gets " + this.dom.Room.suggestions + " suggestions.";
                    this.dom.join = true;
                } else {
                    this.dom.greeting = "Room \'" + this.dom.Room.name + "\' already exists. Try a different name!";
                    this.dom.create = true;
                }
                this.dom.Room = {};
            });
            this.dom.create = false;
        }
        
        joinGame() {
            this.socket.emit("joinRoomRequest", this.dom.Room, (resp, roomDetails, msg) => {
                if (resp) {
                    this.roomExists = true;
                    this.joinMsg = "Enter your name to join \'" + this.dom.Room.name + "\'";
                    console.log(roomDetails);
                }
            });
            this.dom.join = false;
        }
    }
    $scope.player = new Player();
}]);