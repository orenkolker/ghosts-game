class serverGame {
    constructor(roomName) {
        this.roomId = roomName;
        this.moves = 0;
        this.stage = 'new';
        this.player1 = {id: '' , name: 'player1'};
        this.player2 = {id: '' , name: 'player2'};
        this.p1Ghosts = [];
        this.p2Ghosts = [];
        this.turn = 'p1';
        this.player1Ready = false;
        this.player2Ready =  false;
        this.board = [];
        this.initBoard();


        
    }
    
    initBoard(){
        for (let i =0 ; i<6 ; i++){
            this.board[i] = [];
            for (let j =0 ; j<6 ;j++){
                this.board[i][j] = false;
            }
        }
    }
    setPlayer1(name,id) {
        this.player1 =   {id: id, name: name}; 
        
    }
    setPlayer2(name,id) {
        this.player2 =   {id: id, name: name}; 
        
    }
    setGhosts(socketId , ghosts){
        let p  = 'p2';
        if (socketId === this.player1.id){
            p  = 'p1';
        }
        let b = this;
        ghosts.ghosts.forEach(function(ghost){ 
            console.log(ghost)
            
            b.board[ghost.x][ghost.y] = {player: p , color: ghost.color}
        })

    }
    playerReady(socketId){
        if (socketId === this.player1.id){
            this.player1Ready = true;
        }
        if (socketId === this.player2.id){
            this.player2Ready = true;
        }
    }
    isReady(){
        return this.player2Ready && this.player1Ready;
    }

    getPlayers(){
        return {'p1': this.player1 , 'p2': this.player2};
    }

    getOtherPlayer(socketId){
        if (socketId === this.player1.id){
            return this.player2.id;
        }
        if (socketId === this.player2.id){
            return this.player1.id;
        }
    }

    getGhost ( x,y){

        return this.board[x][y];
    }

    move (socketId , fromX,fromY,toX,toY){
        
        this.board[toX][toY] =  this.board[fromX][fromY] ;
        this.board[fromX][fromY] = false;
        let winner = this.checkWin(socketId,toX,toY);
        return winner;

        
    }
    getStatus(){
        let status = {};
        status.p1 = {};
        status.p1.red = 0;
        status.p1.blue = 0;
        status.p2 = {};
        status.p2.red = 0;
        status.p2.blue = 0;
        status.p1.name = this.player1.name;
        status.p2.name = this.player2.name;


        for (let i =0 ; i<6 ; i++){
            for (let j =0 ; j<6 ;j++){
                let ghost  =this.board[i][j];
                if (ghost){
                    if (ghost.player === 'p1'){
                        if (ghost.color==='red'){
                            status.p1.red++;
                        } else if (ghost.color==='blue'){
                            status.p1.blue++;
                        }
                    }  
                    if (ghost.player === 'p2'){
                        if (ghost.color==='red'){
                            status.p2.red++;
                        } else if (ghost.color==='blue'){
                            status.p2.blue++;
                        }
                    }                        
                }
                 
            }
        }

        return status;

    }
    
    checkWin(socketId , x ,y){
        let winner = false;
        console.log('checkWin '+ x +','+ y);
        
        
        if ( (x==0 || x==5) && (y==0 || y==5)){
            winner = this.player1.id === socketId ? 'p1' : 'p2';
        }
        let status = this.getStatus();
        if (status.p1.red == 0){
            winner =  'p1';
        }
        if (status.p2.red == 0){
            winner = 'p2';
        }        
        if (status.p1.blue == 0){
            winner = 'p2';
        }
        if (status.p2.blue == 0){
            winner = 'p1';
        }            
        console.log('checkWin '+ x +','+ y + ':' + winner);
        
        return winner;
    }

    
}

module.exports = serverGame;

