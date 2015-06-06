/// <reference path="../ts/phaser.comments.d.ts" />
/// <reference path="../ts/phaser.d.ts" />

window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'canvas-container', { preload: preload, create: create, update: update });
    var player;
    var speed = 50;
    var facing = 'left';
    var cursors;
    var jumpButton;
    var jumpTimer = 0;
    var ground;
    var ledge;
    var ledge2;
    
    function preload() {
        game.load.image('sky','img/sky.png');
        game.load.image('ground','img/ground.png');
        
        game.load.spritesheet('player','img/damaged.png', 95, 158, 36);
    }

    function create() {
        
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = 500;
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0.1;
    
        //  A simple background for our game
        game.add.sprite(0, 0, 'sky');
         
        var playerCollisionGroup = game.physics.p2.createCollisionGroup(); 
        var platformsCollisionGroup = game.physics.p2.createCollisionGroup();
        
        //  The platforms group contains the ground and the 2 ledges we can jump on
        var platforms = game.add.group();
        platforms.enableBody = true;
        platforms.physicsBodyType = Phaser.Physics.P2JS;
        
        game.physics.p2.updateBoundsCollisionGroup();
        
        // Here we create the ground.
        ground = platforms.create(0, game.world.height - 64, 'ground');
        ground.scale.setTo(7, 1);
        ground.body.fixedRotation = true;
        ground.body.immovable=true;
        ground.body.moves = false;
        ground.body.kinematic = true;
        ground.body.setCollisionGroup(platformsCollisionGroup);
        ground.body.collides([platformsCollisionGroup,playerCollisionGroup]);
        //  Now let's create two ledges
        ledge = platforms.create(500, 400, 'ground');
        ledge.body.fixedRotation = true;
        ledge.body.immovable=true;
        ledge.body.kinematic = true;
        ledge.body.setCollisionGroup(platformsCollisionGroup);
        ledge.body.collides([platformsCollisionGroup,playerCollisionGroup]);
        
        ledge2 = platforms.create(650, 250, 'ground');
        ledge2.body.fixedRotation = true;
        ledge2.body.immovable = true;
        ledge2.body.kinematic = true;
        ledge2.body.setCollisionGroup(platformsCollisionGroup);
        ledge2.body.collides([platformsCollisionGroup,playerCollisionGroup]);
               
        // The player and its settings
        player = game.add.sprite(32, game.world.height - 220, 'player');
        player.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11], 12, true, true);
        player.animations.add('left', [12,13,14,15,16,17,18,19,20,21,22,23], 12, true, true);
        player.animations.add('right', [24,25,26,27,28,29,30,31,32,33,34,35], 12, true, true);
        
     
        game.physics.p2.enable(player);  
        player.body.fixedRotation = true;
        player.body.setCollisionGroup(playerCollisionGroup);
        
        player.body.collides(platformsCollisionGroup);
        
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
        
        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    function update() {
        
        ground.body.velocity.x = 0;
        ground.body.velocity.y = 0;
        
        ledge.body.velocity.x = 0;
        ledge.body.velocity.y = 0;
        
        ledge2.body.velocity.x = 0;
        ledge2.body.velocity.y = 0;
        
        if (cursors.left.isDown)
        {
            player.body.velocity.x = -1*speed;
    
            if (facing != 'left')
            {
                player.animations.play('left');
                facing = 'left';
            }
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = speed;
    
            if (facing != 'right')
            {
                player.animations.play('right');
                facing = 'right';
            }
        }
        else
        {
            if (facing != 'idle')
            {
                player.animations.stop();
    
                if (facing == 'left')
                {
                    player.frame = 0;
                }
                else
                {
                    player.frame = 5;
                }
    
                facing = 'idle';
            }
        }
        
        if (jumpButton.isDown && game.time.now > jumpTimer)
        {
            player.body.velocity.y = -500;
            jumpTimer = game.time.now + 750;
        }
    }
    
};