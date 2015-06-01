window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'canvas-container', { preload: preload, create: create, update: update });

    function preload() {
        game.load.image('sky','img/sky.png');
        game.load.image('ground','img/ground.png');
        
        game.load.spritesheet('player','img/damaged.png', 95, 158, 36);
    }

    function create() {
        
        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
    
        //  A simple background for our game
        game.add.sprite(0, 0, 'sky');
    
        //  The platforms group contains the ground and the 2 ledges we can jump on
        var platforms = game.add.group();
    
        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;
    
        // Here we create the ground.
        var ground = platforms.create(0, game.world.height - 64, 'ground');
    
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(7, 1);
    
        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;
    
        //  Now let's create two ledges
        var ledge = platforms.create(500, 400, 'ground');
    
        ledge.body.immovable = true;
    
        ledge = platforms.create(650, 250, 'ground');
    
        ledge.body.immovable = true;
        
        // The player and its settings
        var player = game.add.sprite(32, game.world.height - 220, 'player');
        player.animations.add('bottom', [0,1,2,3,4,5,6,7,8,9,10,11], 12, true, true);
        player.animations.add('left', [12,13,14,15,16,17,18,19,20,21,22,23], 12, true, true);
        player.animations.add('right', [24,25,26,27,28,29,30,31,32,33,34,35], 12, true, true);
        player.animations.play('right');
        
        //player.scale.setTo(1.5,1.5);  
    
        //  We need to enable physics on the player
        //game.physics.arcade.enable(player);
    
        //  Player physics properties. Give the little guy a slight bounce.
        //player.body.bounce.y = 0.2;
        //player.body.gravity.y = 300;
        //player.body.collideWorldBounds = true;
    
        //  Our two animations, walking left and right.
        //player.animations.add('left', [0], 1, true);
        // player.animations.add('right', [5, 6, 7, 8], 10, true);

    }

    function update() {

    }
};