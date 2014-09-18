var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.tilemap('testmap', 'assets/testmap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/img/tileset.png', 16, 16);
    game.load.spritesheet('player', 'assets/img/trainer.png', 24, 32, 12, 2, 2);
}

var map;
var layers;
var player;
var cursors;

function create() {
    map = game.add.tilemap('testmap');
    map.addTilesetImage('tileset', 'tiles');

    background = map.createLayer('Background');
    ground = map.createLayer('Ground');
    mid = map.createLayer('Mid');
    collidable = map.createLayer('Collidable');
    background.resizeWorld();

    player = game.add.sprite(300, 400, 'player');
    game.camera.follow(player);
    
    player.animations.add('down_1', [0, 1, 0], 5, true);
    player.animations.add('down_2', [0, 2, 0], 5, true);

    player.animations.add('up_1', [10, 11, 10], 5, true);
    player.animations.add('up_2', [10, 12, 10], 5, true);

    player.animations.add('left_1', [3, 4, 3], 5, true);
    player.animations.add('left_2', [3, 5, 3], 5, true);

    player.animations.add('right_1', [7, 8, 7], 5, true);
    player.animations.add('right_2', [7, 9, 7], 5, true);

    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
 if (cursors.left.isDown)
    {
    }
    else if (cursors.right.isDown)
    {
    }

    if (cursors.up.isDown)
    {
    }
    else if (cursors.down.isDown)
    {
    }
}

function render() {
}