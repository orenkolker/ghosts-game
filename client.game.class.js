class Game {

    constructor(el , roomName) {
        this.room = roomName;
        this.el = el;
        this.myGhosts = [];
        this.opponentGhosts = [];

        for (let x = 1; x <= 4; x++) {
            this.myGhosts.push(new Ghost(x, 0, 'red'));
        }
        for (let x = 1; x <= 4; x++) {
            this.myGhosts.push(new Ghost(x, 1, 'blue'));
        }

        for (let x = 1; x <= 4; x++) {
            this.opponentGhosts.push(new Ghost(x, 4, 'unknown'));
        }
        for (let x = 1; x <= 4; x++) {
            this.opponentGhosts.push(new Ghost(x, 5, 'unknown'));
        }        

    }
}