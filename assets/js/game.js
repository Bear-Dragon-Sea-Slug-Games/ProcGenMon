PGM.Preload = {
	preload: function() {
		this.state.add('MainMenu', PGM.MainMenu);
		this.state.add('Overworld', PGM.Overworld);
	},

	create: function() {
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.refresh();

        this.state.start('MainMenu');
	}
};

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', PGM.Preload)