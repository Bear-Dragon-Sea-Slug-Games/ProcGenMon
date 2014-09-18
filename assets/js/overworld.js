PGM.Overworld = function(game) {};
PGM.Overworld.prototype = {

    preload: function() {
        this.load.tilemap('testmap', 'assets/testmap.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/img/tileset.png', 16, 16);
        this.load.spritesheet('player', 'assets/img/trainer.png', 24, 32, 12, 2, 2);
    },

    create: function() {
        var map = this.add.tilemap('testmap');
        map.addTilesetImage('tileset', 'tiles');

        var background = map.createLayer('Background');
        var ground = map.createLayer('Ground');
        var mid = map.createLayer('Mid');
        var collidable = map.createLayer('Collidable');
        background.resizeWorld();

        var player = this.add.sprite(300, 400, 'player');
        this.camera.follow(player);
        
        player.animations.add('down_1', [0, 1, 0], 5, true);
        player.animations.add('down_2', [0, 2, 0], 5, true);

        player.animations.add('up_1', [10, 11, 10], 5, true);
        player.animations.add('up_2', [10, 12, 10], 5, true);

        player.animations.add('left_1', [3, 4, 3], 5, true);
        player.animations.add('left_2', [3, 5, 3], 5, true);

        player.animations.add('right_1', [7, 8, 7], 5, true);
        player.animations.add('right_2', [7, 9, 7], 5, true);
    },

    update: function() {
    }
};