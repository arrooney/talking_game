var app = angular.module("app", ['btford.socket-io']);

app.controller('myGame', ['$scope', 'socketFactory', function($scope, socketFactory) {
    class Player {
        constructor() {
            this.dom          = $scope;
            this.dom.Room     = {};
            this.dom.Player     = {};
            this.dom.greeting = "The talking game 📢";
            this.socket       = socketFactory();
            this.dom.roomExists   = false;
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
                    this.dom.roomExists = true;
                    let joinStr = "Enter your name to join \'" + this.dom.Room.name + "\'";
                    console.log(roomDetails);
                    this.dom.Room.details = roomDetails;
                    console.log(this.dom.Room.details.suggestions);
                    if (roomDetails.owner == this.socket.id||1) {
                        joinStr += " (you are the owner of this room)"
                        this.dom.iAmOwner = true;
                    } else {
                        this.dom.iAmOwner = false;
                    }
                    this.dom.joinMsg = joinStr;
                }
            });
            this.dom.join = false;
        }
    }
    $scope.player = new Player();
    
    $scope.range = function(min, max, step) {
        step = step || 1;
        min = min || 0;
        var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
        return input;
    };
}]);