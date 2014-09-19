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

	moveDuration: 200,
	timeMoving: 0,
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

		// if we are in the process of moving, finish the movement for this timestamp
		if(this.isMoving()) {
			newPos = this.extrapolateNextPosition(this.game.time.elapsed);
			if(this.facing === direction.UP || this.facing === direction.DOWN)
				this.sprite.y = newPos;
			else
				this.sprite.x = newPos;

			// if our movement is complete, snap the sprite to position and null movement-related state
			if(this.timeMoving >= this.moveDuration) {
				//this.snapToTile();
				this.timeMoving = 0;
				this.destination = null;
			}
		}

		// if we are no longer moving and a new move is queued, start moving
		if(!this.isMoving() && nextMove) {
			this.facing = nextMove;
			if(this.facing === direction.UP) this.destination = this.sprite.y - 16;
			else if(this.facing === direction.DOWN) this.destination = this.sprite.y + 16;
			else if(this.facing === direction.LEFT) this.destination = this.sprite.x - 16;
			else if(this.facing === direction.RIGHT) this.destination = this.sprite.x + 16;
		}
	},

	extrapolateNextPosition: function(delta) {
		// the progress of a movement animation is based on the quotient of time passed during
		// the animation and the preset duration of the animation
		this.timeMoving += delta;
		var t = this.timeMoving / this.moveDuration;
			
		// if we are in motion, we can  derive the direction of motion based on the
		// direction the sprite is facing, then grab the coordinate for the axis of motion
		var currentPos = null;
		if(this.facing === direction.UP || this.facing === direction.DOWN)
			currentPos = this.sprite.y;
		else
			currentPos = this.sprite.x;

		// the new position is based on this time quotient
		return currentPos + (this.destination - currentPos) * t;
	},

	snapToTile: function() {

	},

	isMoving: function() {
		return this.destination !== null;
	}
};