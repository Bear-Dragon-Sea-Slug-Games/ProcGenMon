var direction = {
    'UP': 1,
    'DOWN': 2,
    'LEFT': 4,
    'RIGHT': 8
};

Player = function(game) {
    this.game = game;
    this.sprite = null;
    this.cursors = null;
}

Player.prototype = {

    normalMoveSpeed: 100,
    runMoveSpeed: 200,
    isRunning: false,

    tileSize: 16,
    destination: null,
    snapOnNextFrame: false,
    lastMove: null,

    preload: function() {
        this.game.load.spritesheet('player', 'assets/img/trainer.png', 24, 32, 12, 2, 2);
    },

    create: function() {
        this.sprite = game.add.sprite(300, 400, 'player');
        this.game.camera.follow(this.sprite);

        // enable physics
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.setSize(24, 32);

        // walking animations
        this.sprite.animations.add('up_1', [9, 10, 9], 5, true);
        this.sprite.animations.add('up_2', [9, 11, 9], 5, true);
        this.sprite.animations.add('down_1', [0, 1, 0], 5, true);
        this.sprite.animations.add('down_2', [0, 2, 0], 5, true);
        this.sprite.animations.add('left_1', [3, 4, 3], 5, true);
        this.sprite.animations.add('left_2', [3, 5, 3], 5, true);
        this.sprite.animations.add('right_1', [6, 7, 6], 5, true);
        this.sprite.animations.add('right_2', [6, 8, 6], 5, true);
    
        this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    update: function() {
        var nextMove = null;

        if(this.snapOnNextFrame) {
            this.snapToTile(this.destination.x,this.destination.y);
            this.destination = null;
            this.snapOnNextFrame = false;
        }

        // collect an array of key-press durations
        // if a key is not pressed, its value is very large, since we want the shortest keypress
        var keyTimes = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
        if(this.cursors.up.isDown) keyTimes[0] = this.cursors.up.duration;
        if(this.cursors.down.isDown) keyTimes[1] = this.cursors.down.duration;
        if(this.cursors.left.isDown) keyTimes[2] = this.cursors.left.duration;
        if(this.cursors.right.isDown) keyTimes[3] = this.cursors.right.duration;

        // grab the index of whichever key has been held down the least amount of time
        var i = keyTimes.indexOf(Math.min.apply(Math, keyTimes));
        if(keyTimes[i] !== Number.MAX_VALUE) {
            if(i === 0) nextMove = direction.UP;
            else if(i === 1) nextMove = direction.DOWN;
            else if(i === 2) nextMove = direction.LEFT;
            else if(i === 3) nextMove = direction.RIGHT;
        }

        // check if character is running
        this.isRunning = this.game.input.keyboard.isDown(Phaser.Keyboard.Z) ? true : false;

        // stop moving at destination
        if(this.isMoving() && this.destinationReached() && !nextMove)
            this.stopMoving();

        // destination reached, but keep going in same direction
        else if(this.isMoving() && this.destinationReached() && nextMove && nextMove === this.lastMove)
            this.keepMovingSameDirection();

        // destination reached, but change direction and continue
        else if(this.isMoving() && this.destinationReached() && nextMove && nextMove !== this.lastMove)
            this.keepMovingChangeDirection(nextMove);

        // destination not yet reached, so keep goin
        else if(this.isMoving() && !this.destinationReached())
            this.keepMoving();

        // not moving yet, begin moving
        else if(!this.isMoving() && nextMove)
            this.startMoving(nextMove);
    },

    getCurrentTile: function() {
        var tileX = this.sprite.x;
        var tileY = this.sprite.y;
        return { x: tileX, y: tileY };
    },

    getAdjacentTile: function(tileX, tileY, dir) {
        if(dir === direction.UP) tileY -=  this.tileSize;
        else if(dir === direction.DOWN) tileY += this.tileSize;
        else if(dir === direction.LEFT) tileX -= this.tileSize;
        else if(dir === direction.RIGHT) tileX += this.tileSize;

        return { x: tileX, y: tileY };
    },

    startMoving: function(dir) {
        var currentTile = this.getCurrentTile();
        this.destination = this.getAdjacentTile(currentTile.x, currentTile.y, dir);
        this.setVelocityByTile(this.destination.x, this.destination.y);
        this.lastMove = dir;
    },

    keepMoving: function() {
        this.setVelocityByTile(this.destination.x, this.destination.y);
    },

    keepMovingSameDirection: function() {
        this.destination = this.getAdjacentTile(this.destination.x, this.destination.y, this.lastMove);
        this.setVelocityByTile(this.destination.x, this.destination.y);
    },

    keepMovingChangeDirection: function(dir) {
        this.snapToTile(this.destination.x, this.destination.y);
        this.destination = this.getAdjacentTile(this.destination.x, this.destination.y, dir);
        this.setVelocityByTile(this.destination.x, this.destination.y);
        this.lastMove = dir;
    },

    stopMoving: function() {
        this.sprite.body.velocity.x = this.sprite.body.velocity.y = 0;
        this.snapOnNextFrame = true;
    },

    snapToTile: function(x, y) {
        this.sprite.x = x;
        this.sprite.y = y; 
    },
    
    destinationReached: function() {
        var _x = this.destination.x;
        var _y = this.destination.y;
        
        var _dt = this.game.time.physicsElapsed;
        var _dx = this.sprite.body.velocity.x * _dt;
        var _dy = this.sprite.body.velocity.y * _dt;

        var result = (
            (this.sprite.x < _x && this.sprite.x + _dx >= _x) ||
            (this.sprite.x > _x && this.sprite.x + _dx <= _x) ||
            (this.sprite.y < _y && this.sprite.y + _dy >= _y) ||
            (this.sprite.y > _y && this.sprite.y + _dy <= _y)
        );
        return result;
    },

    isMoving: function() {
        return this.destination !== null;
    },

    setVelocityByTile: function(tileX, tileY) {
        var tileCenterX = tileX  + this.tileSize / 2;
        var tileCenterY = tileY  + this.tileSize / 2;

        var entityCenterX = this.sprite.x + 8;
        var entityCenterY = this.sprite.y + 8;

        this.sprite.body.velocity.x = this.sprite.body.velocity.y = 0;
        var moveSpeed = this.getMoveSpeed();

        if(entityCenterX > tileCenterX) this.sprite.body.velocity.x = -moveSpeed;
        else if(entityCenterX < tileCenterX) this.sprite.body.velocity.x = moveSpeed;
        else if(entityCenterY > tileCenterY) this.sprite.body.velocity.y = -moveSpeed;
        else if(entityCenterY < tileCenterY) this.sprite.body.velocity.y = moveSpeed;
    },

    getMoveSpeed: function() {
        return this.isRunning ? this.runMoveSpeed : this.normalMoveSpeed;
    }
};