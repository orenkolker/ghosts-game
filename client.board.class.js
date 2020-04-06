class Board {
    constructor(el , roomName ,player) {
        this.room = roomName;
        this.el = el;
        this.myGhosts = [];
        this.opponentGhosts = [];
        this.player = player;

        let myBlueRow = 4;
        let myRedRow = 5;
        let opponetRows = [0,1];

        this.turn = false;
        this.stage = 'order';

        if (player == 'p1') {
            myBlueRow = 1;
            myRedRow = 0;
            opponetRows = [4,5];
        }
        for (let y = 1;y <= 4; y++) {
            this.myGhosts.push(new Ghost(myBlueRow, y, 'red'));
        }
        for (let y = 1; y <= 4; y++) {
            this.myGhosts.push(new Ghost(myRedRow, y, 'blue'));
        }

        for (let y = 1; y <= 4; y++) {
            this.opponentGhosts.push(new Ghost(opponetRows[0], y, 'unknown'));
        }
        for (let y = 1; y <= 4; y++) {
            this.opponentGhosts.push(new Ghost(opponetRows[1],y, 'unknown'));
        }        

        console.log(this)

    }

    createBoard(){


        let myRows = [4,5];

        if (this.player == 'p1') {
            myRows = [0,1];
        }


        for (let row = 0 ; row < 6 ; row++){
            for (let col = 0 ; col < 6 ; col++){
                let d = document.createElement("div");
                d.setAttribute('col',col);
                d.setAttribute('row',row);
                d.setAttribute('class','place');
                if (this.isHome(row,col)){
                    d.classList.add('home');
                }
                if (this.isCorner(row,col)){
                    d.classList.add('corner');
                }
                if (this.isGoal(row,col)){
                    d.classList.add('goal');
                }


                
                this.el.appendChild(d);
            }
        }


    }
    paint() {
        this.myGhosts.forEach(ghost => {
            let place= this.getElement(ghost.x,ghost.y);
            let a = document.createElement("a");
            a.setAttribute('player','me');
            a.setAttribute('color',ghost.color);
            a.setAttribute('class','ghost my');
            place.appendChild(a);
        });

        this.opponentGhosts.forEach(ghost => {
            let place= this.getElement(ghost.x,ghost.y);
            let a = document.createElement("a");
            a.setAttribute('player','opponent');
            a.setAttribute('class','ghost');
            place.appendChild(a);
        });

        
        

        var event = new Event('boardReady');
        window.dispatchEvent(event);
    }
    getElement(row,col){
        return this.el.getElementsByClassName('place')[row * 6 + col];
    }
    getGhostElement(row,col){
        return this.el.getElementsByClassName('place')[row * 6 + col].firstElementChild;
    }    
    move (fromX,fromY,toX, toY){
        let ghost = this.getGhostElement(fromX,fromY);
        let to = this.getElement(toX,toY);
        to.appendChild(ghost);
    }

    isHome(row,col){
        if (this.player === 'p1'){
            if ((row == 0 || row == 1) && 1 <= col && col <=4){
                return true;
            }
        } else if (this.player === 'p2'){
            if ((row == 4 || row == 5) && 1 <= col && col <=4){
                return true;
            }
        }
        return false;
    }
    isCorner(row,col){
        
            if ((row == 0 || row == 5) && (col == 0 || col == 5)){
                return true;
            }
    
    
        return false;
    }
    isGoal(row,col){
        if (this.player === 'p1'){
            if ((row == 5 ) && (col == 0 || col == 5)){
                return true;
            }
        } else if (this.player === 'p2'){
            if ((row == 0 ) && (col == 0 || col == 5)){
                return true;
            }
        }
        return false;
    }

    getStage(){
        return this.stage;
    }
    

}


