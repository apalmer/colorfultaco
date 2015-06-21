/// <reference path="../vnd/ts/phaser.comments.d.ts" />
/// <reference path="../vnd/ts/phaser.d.ts" />

window.onload = function () {
    var game = new Phaser.Game(1562, 840, Phaser.AUTO, 'canvas-container', { preload: preload, create: create, update: update });
    var player;
    var speed = 150;
    var cursors;
    var jumpButton;
    var map;
    var background;
    
    function preload() {
        
        game.load.tilemap('level1', 'data/level1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('background','img/sky.png');
        game.load.image('tiles','img/tiles_spritesheet.png');
        game.load.atlasXML('player','img/alienGreen.png', 'data/alienGreen.xml');
    }

    function create() {
        
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = 500;
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0.1;
        
        background = game.add.sprite(1562, 608, 'background');
        background.x = 0;
        background.y = 0;
        background.height = game.height;
        background.width = game.width;
        
        map = game.add.tilemap('level1');

        map.addTilesetImage('tiles');
                
        var layer = map.createLayer('Tile Layer 1');
        
        //  Un-comment this on to see the collision tiles
        // layer.debug = true;
        
        layer.resizeWorld();  
 
        map.setCollisionByExclusion([], true);
   
        //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
        //  This call returns an array of body objects which you can perform addition actions on if
        //  required. There is also a parameter to control optimising the map build.
        game.physics.p2.convertTilemap(map, layer);
        
        // The player and its settings
        player = game.add.sprite(571, 96, 'player');
   
        var walkFrames = ['alienGreen_walk1.png','alienGreen_walk2.png'];
        player.animations.add('walk', walkFrames, 30, true);
        
        var swimFrames = ['alienGreen_swim1.png','alienGreen_swim2.png'];
        player.animations.add('swim', swimFrames, 30, true);
        
        var climbFrames = ['alienGreen_climb1.png','alienGreen_climb2.png'];
        player.animations.add('climb', climbFrames, 30, true);
        
        var jumpFrames = ['alienGreen_jump.png'];
        player.animations.add('jump', jumpFrames, 30, true);
        
        var idleFrames = ['alienGreen_stand.png'];
        player.animations.add('idle', idleFrames, 1, true);    
        
        var crouchFrames = ['alienGreen_duck.png'];
        player.animations.add('crouch', crouchFrames, 1, true);    
        
        var hurtFrames = ['alienGreen_hurt.png'];
        player.animations.add('hurt', hurtFrames, 1, true);    
        
        game.physics.p2.enable(player);  
        player.body.fixedRotation = true;
          
        game.camera.follow(player);
        
        //  By default the ship will collide with the World bounds,
        //  however because you have changed the size of the world (via layer.resizeWorld) to match the tilemap
        //  you need to rebuild the physics world boundary as well. The following
        //  line does that. The first 4 parameters control if you need a boundary on the left, right, top and bottom of your world.
        //  The final parameter (false) controls if the boundary should use its own collision group or not. In this case we don't require
        //  that, so it's set to false. But if you had custom collision groups set-up then you would need this set to true.
        game.physics.p2.setBoundsToWorld(true, true, true, true, false);
    
        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    function update() {
        
        var onGround = touchingDown(player);
        
        if(!onGround){
            player.animations.play('jump', 1, true);
        }
        
        if (jumpButton.isDown && onGround)
        {
            player.animations.play('jump', 1, true);
            player.body.velocity.y = -3*speed;
        }
        else if (cursors.down.isDown && onGround){
                player.animations.play('crouch', 6, true);
        }
        else if (cursors.left.isDown)
        {
            flip(player, 'left');
            if(onGround){
                player.animations.play('walk', 6, true);
            }
            player.body.velocity.x = -1*speed;
        }
        else if (cursors.right.isDown)
        {
            flip(player, 'right');
            if(onGround){
                player.animations.play('walk', 6, true);
            }
            player.body.velocity.x = speed;
        }
        else if(onGround){
            player.animations.play('idle', 6, true);
        }
    }
    
    function flip(sprite, direction) {
        if(sprite.direction !== direction){
            if(direction === 'right'){
                sprite.scale.x = Math.abs(sprite.scale.x);
            }else{
                sprite.scale.x = -1 * Math.abs(sprite.scale.x);
            }
            sprite.direction = direction;
        }
    }
    
    function touchingDown(someone) {
        var yAxis = p2.vec2.fromValues(0, 1);
        var result = false;
        for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
            var c = game.physics.p2.world.narrowphase.contactEquations[i];  // cycles through all the contactEquations until it finds our "someone"
            if (c.bodyA === someone.body.data || c.bodyB === someone.body.data)        {
                var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
                if (c.bodyA === someone.body.data) d *= -1;
                if (d > 0.5) result = true;
            }
        } return result;
    }
    
};