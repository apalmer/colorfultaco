window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'canvas-container', { preload: preload, create: create, update: update });

    function preload() {
        game.load.image('sky','img/sky.png');
        game.load.image('taco','img/taco.png');
        game.load.image('ground','img/ground.png');
    }

    function create() {
        game.add.sprite(0, 0, 'sky');
        game.add.sprite(0, 0, 'taco');
        var length = 7;
        for (var i = 0; i < length; i++) {   
            game.add.sprite(120*i, 540, 'ground');
        }
    }

    function update() {

    }
};