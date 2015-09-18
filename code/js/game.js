
var game = new Phaser.Game(960, 642, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('sky','../../assets/img/Sky.jpg');
	game.load.image('ground','../../assets/img/Ground.png');
	game.load.spritesheet('hero', '../../assets/img/Hero.png', 65, 68);

	game.load.script('Gray', '../../assets/filters/Gray.js');
	game.load.script('filterX', '../../assets/filters/FilterX.js');
	game.load.script('filterY', '../../assets/filters/FilterY.js');
}

var groupR;
var groupG;
var groupB;

var player;
var cursors;
var filters;
var pause;

var playing

function create() {

	// physics
	game.physics.startSystem(Phaser.Physics.ARCADE);

	// background
	bg = game.add.group();
	bg.create(0, 0, 'sky');

	// groups
	groupR = game.add.group();
	groupG = game.add.group();
	groupB = game.add.group();

	groupR.enableBody = true;
	groupG.enableBody = true;
	groupB.enableBody = true;

	// base stage
	var ground;

	ground = groupR.create(0, 209 - 68 * (.6), 'ground');
	ground.body.immovable = true;
	ground.scale.setTo(.6,.6);

	ground = groupG.create(0, 421 - 68 * (.6), 'ground');
	ground.body.immovable = true;
	ground.scale.setTo(.6,.6);

	ground = groupB.create(0, 635 - 68 * (.6), 'ground');
	ground.body.immovable = true;
	ground.scale.setTo(.6,.6);

	// players
	player = [];

	for (var i = 0; i < 3; i++) {
		player[i] = game.add.sprite(0, 0, 'hero');
	  player[i].scale.setTo(.6,.6);
		player[i].anchor.setTo(.5,0);
		player[i].animations.add('stand', [0,1,2,3,4], 7);
		player[i].animations.add('walk', [5,6,7,8], 6);
		player[i].animations.add('jump', [10]);
		game.physics.arcade.enable(player[i]);
		player[i].body.gravity.y = 900;
		player[i].body.collideWorldBounds = true;
	}

	groupR.add(player[0]);
	groupG.add(player[1]);
	groupB.add(player[2]);

	playing = 0;

	// cursors
	cursors = {};
	cursors.left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	cursors.right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	cursors.up = game.input.keyboard.addKey(Phaser.Keyboard.Z);
	cursors.action = game.input.keyboard.addKey(Phaser.Keyboard.X);

	cursors.change = [];
	cursors.change[0] = game.input.keyboard.addKey(Phaser.Keyboard.A);
	cursors.change[1] = game.input.keyboard.addKey(Phaser.Keyboard.S);
	cursors.change[2] = game.input.keyboard.addKey(Phaser.Keyboard.D);

	cursors.esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);

	// filters
	filters = [];
	filters[0] = game.add.filter('Gray');
	filters[1] = game.add.filter('BlurX');
	filters[2] = game.add.filter('BlurY');

	// Setup the pause menu
	pause = game.add.group();
	pause.visible = false;
	var style = {font: "65px Arial", fill: "#fff", strokeThickness:3, align: "left" }
	var text = game.add.text(game.world.centerX, game.world.centerY, "- Pause -",style);
	pause.add(text);
	text.updateText();
	text.position.x -= ( text.width / 2 );
	text.position.y -= 100;
	style.font = "35px Arial";
	text = game.add.text(game.world.centerX, game.world.centerY, "⇆ : Mover\nZ : Pular\nX : Ação\nA, S, D : Trocar heroi",style);
	pause.add(text);
	text.updateText();
	text.position.x -= ( text.width / 2 );
}

function update() {

	//  Collide the player and the stars with the platforms
	game.physics.arcade.collide(groupR, groupR);
	game.physics.arcade.collide(groupG, groupG);
	game.physics.arcade.collide(groupB, groupB);

	player[playing].body.velocity.x = 0;

	if (cursors.left.isDown) {

		player[playing].body.velocity.x = -150;
		player[playing].scale.x = Math.abs(player[playing].scale.x);
		player[playing].animations.play('walk');

	} else if (cursors.right.isDown) {

		player[playing].body.velocity.x = 150;
		player[playing].scale.x = -Math.abs(player[playing].scale.x);
		player[playing].animations.play('walk');

	}

	//  Allow the player to jump if they are touching the ground.
	if (cursors.up.isDown && player[playing].body.touching.down){
		player[playing].body.velocity.y = -350;
	}

	if(cursors.action.isDown){
		// Mecanica
	}

	if (cursors.change[0].isDown) {
		player[playing].body.velocity.x = 0;
		playing = 0;
	} else if (cursors.change[1].isDown) {
		player[playing].body.velocity.x = 0;
		playing = 1;
	} else if (cursors.change[2].isDown) {
		player[playing].body.velocity.x = 0;
		playing = 2;
	}

	if(cursors.esc.isDown){
		pause.visible = true;
		game.paused = true;

		bg.filters = filters;
		groupR.filters = filters;
		groupG.filters = filters;
		groupB.filters = filters;

		var unpausePre = setInterval(function(){
			if(cursors.esc.isUp){
				var unpausePos = setInterval(function(){
					if(cursors.esc.isDown){
						pause.visible = false;
						this.game.paused = false;

						bg.filters = null;
						groupR.filters = null;
						groupG.filters = null;
						groupB.filters = null;
						clearInterval(unpausePos);
					}
				}, 1000/60);
				clearInterval(unpausePre);
			}
		},1000/60);
	}

	for(var i = 0; i < 3; i++){
		if( player[i].body.velocity.x == 0 ) player[i].animations.play('stand');
		if( !player[i].body.touching.down ) player[i].animations.play('jump');
	}

}
