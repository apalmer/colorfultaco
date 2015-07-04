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
        
        _initializePhysics(game);
        
        background = _createBackground(game);
        map = _createMap(game);       
        player = _createPlayer(game);
        
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
        var onGround = _touchingDown(player,game);
        
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
            _flip(player, 'left');
            if(onGround){
                player.animations.play('walk', 6, true);
            }
            player.body.velocity.x = -1*speed;
        }
        else if (cursors.right.isDown)
        {
            _flip(player, 'right');
            if(onGround){
                player.animations.play('walk', 6, true);
            }
            player.body.velocity.x = speed;
        }
        else if(onGround){
            player.animations.play('idle', 6, true);
        }
    }
    
    function _initializePhysics(game){
         
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = 500;
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0.1;
    };
    
    function _createBackground(game){
        var _background = game.add.sprite(1562, 608, 'background');
        
        _background.x = 0;
        _background.y = 0;
        _background.height = game.height;
        _background.width = game.width;
        
        return _background;    
    }
    
    function _createMap(game){
        
        var _map = game.add.tilemap('level1');

        _map.addTilesetImage('tiles');
                
        var _layer = _map.createLayer('Tile Layer 1');
        //  Un-comment this on to see the collision tiles
        // _layer.debug = true;
        
        _layer.resizeWorld();  
 
        _map.setCollisionByExclusion([], true);
   
        //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
        //  This call returns an array of body objects which you can perform addition actions on if
        //  required. There is also a parameter to control optimising the map build.
        game.physics.p2.convertTilemap(_map, _layer);
    };
    
    function _createPlayer(game){
        var _player = game.add.sprite(571, 96, 'player');
   
        var walkFrames = ['alienGreen_walk1.png','alienGreen_walk2.png'];
        _player.animations.add('walk', walkFrames, 30, true);
        
        var swimFrames = ['alienGreen_swim1.png','alienGreen_swim2.png'];
        _player.animations.add('swim', swimFrames, 30, true);
        
        var climbFrames = ['alienGreen_climb1.png','alienGreen_climb2.png'];
        _player.animations.add('climb', climbFrames, 30, true);
        
        var jumpFrames = ['alienGreen_jump.png'];
        _player.animations.add('jump', jumpFrames, 30, true);
        
        var idleFrames = ['alienGreen_stand.png'];
        _player.animations.add('idle', idleFrames, 1, true);    
        
        var crouchFrames = ['alienGreen_duck.png'];
        _player.animations.add('crouch', crouchFrames, 1, true);    
        
        var hurtFrames = ['alienGreen_hurt.png'];
        _player.animations.add('hurt', hurtFrames, 1, true);    
        
        game.physics.p2.enable(_player);  
        _player.body.fixedRotation = true;
        
        return _player;
    };
    
    function _flip(sprite, direction) {
        if(sprite.direction !== direction){
            if(direction === 'right'){
                sprite.scale.x = Math.abs(sprite.scale.x);
            }else{
                sprite.scale.x = -1 * Math.abs(sprite.scale.x);
            }
            sprite.direction = direction;
        }
    }
    
    function _touchingDown(someone, game) {
        var _yAxis = p2.vec2.fromValues(0, 1);
        var _result = false;
        for (var _i = 0; _i < game.physics.p2.world.narrowphase.contactEquations.length; _i++) {
            var _c = game.physics.p2.world.narrowphase.contactEquations[_i];  // cycles through all the contactEquations until it finds our "someone"
            if (_c.bodyA === someone.body.data || _c.bodyB === someone.body.data)        {
                var _d = p2.vec2.dot(_c.normalA, _yAxis); // Normal dot Y-axis
                if (_c.bodyA === someone.body.data) _d *= -1;
                if (_d > 0.5) _result = true;
            }
        } return _result;
    }
    
};