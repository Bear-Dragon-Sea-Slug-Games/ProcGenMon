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

	moveSpeed: 100,
	destination: null,
	facing: direction.DOWN,

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
		if(this.cursors.up.isDown) nextMove = direction.UP;
		else if(this.cursors.down.isDown) nextMove = direction.DOWN;
		else if(this.cursors.left.isDown) nextMove = direction.LEFT;
		else if(this.cursors.right.isDown) nextMove = direction.RIGHT;

		// stop moving at destination
		if(this.isMoving() && this.destinationReached() && !nextMove)
			this.stopMoving();

		// destination reached, but keep going in same direction
		else if(this.isMoving() && this.destinationReached() && nextMove && nextMove === this.facing)
			this.keepMovingSameDirection();

		// destination reached, but change direction and continue
		else if(this.isMoving() && this.destinationReached() && nextMove && nextMove !== this.facing)
			this.keepMovingChangeDirection(nextMove);

		// destination not yet reached, so keep going
		else if(this.isMoving() && !this.destinationReached())
			this.keepMoving();

		// not moving yet, begin moving
		else if(!this.isMoving() && nextMove)
			this.startMoving(nextMove);
	},

	startMoving: function(dir) {
		this.facing = dir;

		if(this.facing === direction.UP) this.destination = this.sprite.y - 16;
		else if(this.facing === direction.DOWN) this.destination = this.sprite.y + 16;
		else if(this.facing === direction.LEFT) this.destination = this.sprite.x - 16;
		else if(this.facing === direction.RIGHT) this.destination = this.sprite.x + 16;

		this.setVelocityByDirection();
	},

	keepMoving: function() {
		this.setVelocityByDirection();
	},

	keepMovingSameDirection: function() {
		if(this.facing === direction.UP) this.destination = this.sprite.y - 16;
		else if(this.facing === direction.DOWN) this.destination = this.sprite.y + 16;
		else if(this.facing === direction.LEFT) this.destination = this.sprite.x - 16;
		else if(this.facing === direction.RIGHT) this.destination = this.sprite.x + 16;

		this.setVelocityByDirection();
	},

	keepMovingChangeDirection: function(dir) {
		this.facing = dir;

		if(this.facing === direction.UP) this.destination = this.sprite.y - 16;
		else if(this.facing === direction.DOWN) this.destination = this.sprite.y + 16;
		else if(this.facing === direction.LEFT) this.destination = this.sprite.x - 16;
		else if(this.facing === direction.RIGHT) this.destination = this.sprite.x + 16;

		this.setVelocityByDirection();
	},

	stopMoving: function() {
		this.destination = null;
		this.sprite.body.velocity.x = this.sprite.body.velocity.y = 0;
	},

	destinationReached: function() {
		if(this.facing === direction.UP)
			return this.sprite.y <= this.destination;
		else if(this.facing === direction.DOWN)
			return this.sprite.y >= this.destination;
		else if(this.facing === direction.LEFT)
			return this.sprite.x <= this.destination;
		else if(this.facing === direction.RIGHT)
			return this.sprite.x >= this.destination;
	},

	isMoving: function() {
		return this.destination !== null;
	},

	setVelocityByDirection: function() {
		if(this.facing === direction.UP)
			this.sprite.body.velocity.y = -this.moveSpeed;
		else if(this.facing === direction.DOWN)
			this.sprite.body.velocity.y = this.moveSpeed;
		else if(this.facing === direction.LEFT)
			this.sprite.body.velocity.x = -this.moveSpeed;
		else if(this.facing === direction.RIGHT)
			this.sprite.body.velocity.x = this.moveSpeed;
	}
};