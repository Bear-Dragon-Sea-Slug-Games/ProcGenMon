var PGM = {};

PGM.MainMenu = function(game) {};
PGM.MainMenu.prototype = {

    preload: function() {
        this.stage.backgroundColor = '#2d2d2d'
    },

    create: function() {
        var text = 'Press space';
        var style = { font: '14px Arial', fill: '#ffffff' };
        this.add.text(this.world.centerX, this.world.centerY, text, style);

        // stop following key inputs from propagating to the browser
        this.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    },

    update: function() {
        if(this.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
            this.state.start('Overworld');
        }
    }
};