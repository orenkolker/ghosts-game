var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var ghost = require('./server.ghost.class.js');
var serverGame = require('./server.game.class.js');

var rooms = 0;
var games = {};

app.use(express.static('.'));

app.get('/:roomName/', function (req, res) {
    let roomName = req.params.roomName;
    var room = io.nsps['/'].adapter.rooms[roomName];
    res.sendFile(__dirname + '/room.html');

});
app.get('/', function (req, res) {
    
    res.sendFile(__dirname + '/home.html' , {data:games, number:  rooms});

});


io.on('connection', function (socket) {
    
    var url = socket.handshake.headers.referer;
    var roomNname = url.match(/([^\/]*)\/*$/)[1]
    console.log(socket.id);    
    /**
     * Connect the Player 2 to the room he requested. Show error if room full.
     */
    socket.on('joinGame', function (data) {

        var room = io.nsps['/'].adapter.rooms[roomNname];
       console.log(room);

        if (!room) {
            socket.join(roomNname);
            
            games[roomNname] = new serverGame(roomNname);
            games[roomNname].setPlayer1(data.name , socket.id);
            socket.emit('waiting', {'player' :'p1'});
            console.log(data.name + 'p1 Joined Roonm ' +roomNname  + ' id ' + socket.id );
        } else if (room.length == 1) {
            socket.join(roomNname);
            games[roomNname].setPlayer2(data.name, socket.id);
            socket.emit('waiting', {'player' :'p2'});
            io.to(roomNname).emit('startOrder', games[roomNname].getPlayers());
            
            console.log(data.name + 'p2 Joined Roonm ' +roomNname  + ' id ' + socket.id );
        } else {
            console.log(data.name + 'Cant Joine room ' +roomNname  + ' id ' + socket.id );
            socket.emit('err', {
                message: 'Sorry, The room is full!'
            });
        }
    });


    /**
     * Handle the turn played by either player and notify the other. 
     */
    socket.on('ready', function (ghosts) {
        console.log(roomNname);   
        console.log( games[roomNname]);   
        console.log(ghosts);
        games[roomNname].setGhosts(socket.id,ghosts);
        games[roomNname].playerReady(socket.id);
        socket.emit('waitingOrder', {});
        if (games[roomNname].isReady()){
            io.to(roomNname).emit('startGame', games[roomNname].getPlayers());
            io.to(roomNname).emit('status', games[roomNname].getStatus());
        
        
            io.to(games[roomNname].player1.id).emit('yourTurn', {});
        }


        
        
    });


    /**
     * Handle the turn played by either player and notify the other. 
     */
    socket.on('move', function (data) {
        console.log('move'  );
        console.log(data);
        
        let ghost = games[roomNname].getGhost( data.toX,data.toY);
        if (ghost !== false){
            socket.emit('remove', ghost);
        }

        let winner =  games[roomNname].move(socket.id , data.fromX , data.fromY, data.toX,data.toY);
        let otherPlayer = games[roomNname].getOtherPlayer(socket.id);
        

        io.to(roomNname).emit('status', games[roomNname].getStatus());

        io.to(otherPlayer).emit('move', {data});
        if (winner){
            let p1Id = games[roomNname].player1.id;
            let p2Id = games[roomNname].player2.id;
            if ('p1' === winner){
                io.to(p1Id).emit('yourWin', {});
                io.to(p2Id).emit('yourLoose', {});
            } 
            if ('p2' === winner){
                io.to(p2Id).emit('yourWin', {});
                io.to(p1Id).emit('yourLoose', {});
            }
            
            
        } else {
            io.to(otherPlayer).emit('yourTurn', {});
        }
        



      
    });


    socket.on('print', function (data) {
        console.log(games);
    });

    socket.on('debug', function (data) {
        let game =  games[roomNname];
        let status = game.getStatus();
        console.log(status );
    });

    socket.on('disconnect', function() {
        
        socket.broadcast.to(roomNname).emit('gameStop',{});
        io.of('/').in(roomNname).clients((error, socketIds) => {
                    
            socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(roomNname));
          
        });


        delete games[roomNname];

        
        
     });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

server.listen(port);
