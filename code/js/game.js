
var game = new Phaser.Game(960, 642, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('sky','../../assets/img/Sky.jpg');
	game.load.image('ground','../../assets/img/Ground.png');
	game.load.spritesheet('hero', '../../assets/img/myHero.png',74,74);
	game.load.image('arrow','../../assets/img/arrow.png');
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
var shootAnimationTime=0;
var isShooting=false;
var playing;
var arrows;

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

	arrows=game.add.group();
	arrows.enableBody=true;
	//arrows.scale.setTo(0.6,1);
	// players
	player = [];

	for (var i = 0; i < 3; i++) {
		player[i] = game.add.sprite(0, 0, 'hero');
	  	player[i].scale.setTo(.6,.6);
		player[i].anchor.setTo(.5,0);
		player[i].animations.add('stand', [0,1,2,3,4], 6,true);
		player[i].animations.add('shoot', [5,6,7], 7);
		player[i].animations.add('walk', [10,11,12,13],6);
		player[i].animations.add('jump', [15]);
		game.physics.arcade.enable(player[i]);
		player[i].body.gravity.y = 900;
		player[i].body.collideWorldBounds = true;
		player[i].animations.play('stand');
		player[i].body.setSize(72,65);
	}
	

	groupR.add(player[0]);
	groupG.add(player[1]);
	groupB.add(player[2]);

	playing = 0;

	// cursors
	cursors = {};
	cursors.left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	cursors.right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	cursors.jump = game.input.keyboard.addKey(Phaser.Keyboard.Z);
	cursors.action = game.input.keyboard.addKey(Phaser.Keyboard.X);
	/*cursors.up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	cursors.down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);*/

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
	game.physics.arcade.collide(groupR,arrows);


	PlayerMovementController();
	Shoot();
	PlayerSelect();
	PauseManager();
	ArrowBehaviour();
	
}

function Shoot(){
	if(cursors.action.isDown&&!isShooting&&(player[playing].body.velocity.x==0)){
		player[playing].animations.play('shoot');
		isShooting=true;
		shootAnimationTime=0;
		var h=player[playing].body.position.y+(player[playing].height/2);
		var a=arrows.create(player[playing].body.position.x,h,'arrow');
		a.body.velocity.x=500;
		a.scale.setTo(0.8,0.8);
	}else{
		shootAnimationTime+=game.time.elapsed;
		if(shootAnimationTime>500)
			isShooting=false;
	}

}

function ArrowBehaviour(){
	//arrows.body.rotation = Math.atan2(arrows.body.velocity.y, arrows.body.velocity.x);
}


function PauseManager(){
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
}

function PlayerSelect(){
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
}

function PlayerMovementController(){
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
	if (cursors.jump.isDown && player[playing].body.touching.down){
		player[playing].body.velocity.y = -350;
		player[playing].animations.play('jump');
	}else if((player[playing].body.touching.down )&&( player[playing].body.velocity.x==0)&&!isShooting){
		player[playing].animations.play('stand');
	}	

	if(!player[playing].body.touching.down){
		player[playing].animations.play('jump');
	}
	
}
