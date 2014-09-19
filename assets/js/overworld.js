PGM.Overworld = function(game) {
    this.game = game;
};

PGM.Overworld.prototype = {

    preload: function() {
        // preload map assets
        this.load.tilemap('testmap', 'assets/testmap.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/img/tileset.png', 16, 16);

        // preload player assets
        this.player = new Player(this.game);
        this.player.preload()
    },

    create: function() {
        // load tilemap
        var map = this.add.tilemap('testmap');
        map.addTilesetImage('tileset', 'tiles');

        // create layers and resize world according to bg layer
        var background = map.createLayer('Background');
        var ground = map.createLayer('Ground');
        var mid = map.createLayer('Mid');
        var collidable = map.createLayer('Collidable');
        background.resizeWorld();

        // create the player sprite
        this.player.create();
    },

    update: function() {
        this.player.update();
    }
};