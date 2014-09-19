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

    tileSize: 16,
    moveSpeed: 100,
    destination: null,
    snapOnNextFrame: false,
    facing: direction.DOWN,
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
        this.sprite.animations.add('up_1', [10, 11, 10], 5, true);
        this.sprite.animations.add('up_2', [10, 12, 10], 5, true);
		this.sprite.animations.add('down_1', [0, 1, 0], 5, true);
        this.sprite.animations.add('down_2', [0, 2, 0], 5, true);
        this.sprite.animations.add('left_1', [3, 4, 3], 5, true);
        this.sprite.animations.add('left_2', [3, 5, 3], 5, true);
        this.sprite.animations.add('right_1', [7, 8, 7], 5, true);
        this.sprite.animations.add('right_2', [7, 9, 7], 5, true);
	
        this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    update: function() {
		var nextMove = null;

		if (this.snapOnNextFrame){
		    this.snapToTile(this.destination.x,this.destination.y);
		    this.destination = null;
		    this.snapOnNextFrame = false;
		}
		
		if(this.cursors.up.isDown) nextMove = direction.UP;
		else if(this.cursors.down.isDown) nextMove = direction.DOWN;
		else if(this.cursors.left.isDown) nextMove = direction.LEFT;
		else if(this.cursors.right.isDown) nextMove = direction.RIGHT;

		// stop moving at destination
		if(this.isMoving() && this.destinationReached() && !nextMove) {
		    this.stopMoving();

		}

		// destination reached, but keep going in same direction
		else if(this.isMoving() && this.destinationReached() && nextMove && nextMove === this.lastMove) {
		    this.keepMovingSameDirection();

		}

		// destination reached, but change direction and continue
		else if(this.isMoving() && this.destinationReached() && nextMove && nextMove !== this.lastMove) {
		    this.keepMovingChangeDirection(nextMove);
		}

		// destination not yet reached, so keep goin
		else if(this.isMoving() && !this.destinationReached()) {
		    this.keepMoving();
		}

		// not moving yet, begin moving
		else if(!this.isMoving() && nextMove) {
		    this.startMoving(nextMove);
		}
    },

    getCurrentTile: function() {
		var tileX = this.sprite.x; // / this.tileSize;
		var tileY = this.sprite.y; // / this.tileSize;
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
		this.setVelocityByTile(this.destination.x, this.destination.y, this.moveSpeed);
		this.lastMove = dir;
    },

    keepMoving: function() {
		this.setVelocityByTile(this.destination.x, this.destination.y, this.moveSpeed);
    },

    keepMovingSameDirection: function() {
		this.destination = this.getAdjacentTile(this.destination.x, this.destination.y, this.lastMove);
		this.setVelocityByTile(this.destination.x, this.destination.y, this.moveSpeed);
    },

    keepMovingChangeDirection: function(dir) {
		this.snapToTile(this.destination.x, this.destination.y);
		this.destination = this.getAdjacentTile(this.destination.x, this.destination.y, dir);
		this.setVelocityByTile(this.destination.x, this.destination.y, this.moveSpeed);
		this.lastMove = dir;
    },

    stopMoving: function() {
		this.sprite.body.velocity.x = this.sprite.body.velocity.y = 0;
		this.snapOnNextFrame = true;
    },

    snapToTile: function(x, y) {
		this.sprite.x = x; // * this.tileSize;
		this.sprite.y = y; // * this.tileSize;	
    },
    
    destinationReached: function() {
		var _x = this.destination.x; // * this.tileSize;
		var _y = this.destination.y; // * this.tileSize;
		
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

    setVelocityByTile: function(tileX, tileY, velocity) {
		var tileCenterX = tileX  + this.tileSize / 2;
		var tileCenterY = tileY  + this.tileSize / 2;

		var entityCenterX = this.sprite.x + 8;
		var entityCenterY = this.sprite.y + 8;

		this.sprite.body.velocity.x = this.sprite.body.velocity.y = 0;
		if(entityCenterX > tileCenterX) this.sprite.body.velocity.x = -velocity;
		else if(entityCenterX < tileCenterX) this.sprite.body.velocity.x = velocity;
		else if(entityCenterY > tileCenterY) this.sprite.body.velocity.y = -velocity;
		else if(entityCenterY < tileCenterY) this.sprite.body.velocity.y = velocity;
    }
};