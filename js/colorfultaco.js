window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'canvas-container', { preload: preload, create: create, update: update });

    function preload() {
        game.load.image('sky','img/sky.png');
        game.load.image('taco','img/taco.png');
    }

    function create() {
        game.add.sprite(0, 0, 'taco');
    }

    function update() {

    }
};