var groups;

var cursors;
var pause;

var playing;

var shootAnimationTime = 0;
var isShooting = false;
var canShoot = true;

var fireAnimationTime = 0;
var isFiring = false;
var canFire = true;

var reflectAnimationTime = 0;
var isReflecting = false;
var canDefend = true;

var standAnim = true;
var canMove = true;

//Light Beam Reflection point:
var p = new Phaser.Point();

var lightStart;
var lightEnd;
var lights;

var lfx;

var arrows;
var a;
var enemy;
var enemyLife=3;
var enemyLimitRight=850;
var enemyLimitLeft=480;
var enemyDieTime=0;
var enemyDie=false;
var plat;

var playState = {

	create: function() {
		// Groups
		groups = []

		for (var i = 0; i < 3; i++) {
			// creates the structure of each group
			groups[i] = {
				all: game.add.group(),
				player: null,
				bg: null,
				platforms: game.add.group(),
				misc: game.add.group()
			};

			// nesting groups

			groups[i].bg = groups[i].all.create(0, i * 213, 'back');
			groups[i].all.add(groups[i].platforms);
			groups[i].all.add(groups[i].misc);

			// adding physics to the group
			groups[i].platforms.enableBody = true;

			switch(i){
				case 0:
					lf = groups[0].all.create(0,0,'lfx');
					lf.anchor.setTo(.5,.5);
					break;

				case 1:
					arrows=game.add.group();
					arrows.enableBody=true;
					break;

				case 2:
					lights = [];
					lights[0] = game.add.tileSprite(0,0,10,0,'lbeam')
					lights[0].anchor.setTo(.5,0)
					lights[1] = game.add.tileSprite(0,0,10,0,'lbeam')
					lights[1].anchor.setTo(.5,0)
					break;
			}
		}

		// Base stage
		var temp;

		for (var i = 0; i < 3; i++){
			// sets the stage background
			groups[i].bg.scale.setTo(.6,.6);

			// sets the color and grey states
			groups[i].bg.animations.add('default', [0]);
			groups[i].bg.animations.add('color', [i + 1]);

			temp = groups[i].platforms.create(0, ((i + 1) * 213) - (68 * 0.6), 'ground');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);

			// sets the color and grey states
			temp.animations.add('default', [0]);
			temp.animations.add('color', [i + 1]);
		}

		//Players
		player = [];

		for (var i = 0; i < 3; i++) {
			// creates the players sprites
			groups[i].player = groups[i].all.create(0, i*214, 'hero'+i);
		  	groups[i].player.scale.setTo(.6,.6);
			groups[i].player.anchor.setTo(.5,0);

			// creates the base animations for the player movement
			groups[i].player.animations.add('stand', [0,1,2,3,4], 7, true);
			groups[i].player.animations.add('walk', [5,6,7,8], 6);
			groups[i].player.animations.add('jump', [9]);

			// some physics constants
			game.physics.arcade.enable(groups[i].player);
			groups[i].player.enableBody = true;
			groups[i].player.body.gravity.y = 900;
			groups[i].player.body.collideWorldBounds = true;
		}

		//enemy
		enemy=game.add.sprite(900,214,'dog');
		enemy.scale.setTo(.8,.8);
		enemy.anchor.setTo(0.5, 0.5);
		game.physics.arcade.enable(enemy);
		enemy.enableBody=true;
		enemy.body.gravity.y = 900;
		enemy.body.collideWorldBounds = true;
		enemy.animations.add('walks',[0,1,2,3,4,5],6);
		enemy.animations.add('death',[6,7,8,9,10,11,12],6);
		
		//teste
		plat=game.add.sprite(400,300,'ground');
		plat.scale.setTo(.2,.4);
		game.physics.arcade.enable(plat);
		plat.enableBody=true;
		plat.body.gravity.y=0;
		plat.body.immovable=true;
		plat.body.checkCollision.down = false;
		plat.body.checkCollision.right = false;
		plat.body.checkCollision.left = false;


		groups[0].player.animations.add('fire',[10,11],3);
		groups[1].player.animations.add('shoot',[10,11,12],10);
		groups[2].player.animations.add('defend',[10]);

		playing = 0;

		// Controls
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

		//Pause Menu
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

		//Light Beam
		handle1 = game.add.sprite(186.0, 601.0, '', 0);
		handle1.anchor.set(0.5);
		handle1.inputEnabled = true;

		handle2 = game.add.sprite(378.0, 427.0, '', 0);
		handle2.anchor.set(0.5);
		handle2.inputEnabled = true;

		line1 = new Phaser.Line(handle1.x, handle1.y, handle2.x, handle2.y);
		line2 = new Phaser.Line(groups[2].player.x, groups[2].player.y, groups[2].player.x, groups[2].player.x+30);

		reflection = new Phaser.Line(0, 0, 0, 0);
	},

	update: function() {

		//  Collide each group with itself
		for (var i = 0; i < 3; i++) {
			game.physics.arcade.collide(groups[i].all, groups[i].all);
		}
		if(playing==1) plat.frame=2;
		else plat.frame=0;
		game.physics.arcade.collide(enemy,groups[1].platforms);
		game.physics.arcade.collide(groups[1].player,plat);
		groups[playing].player.body.velocity.x = 0;
		movementControll();
		actionControll();
		actionStatusControll();
		switchPlayer();
		filterControll();
		pauseControll();
		gameAnimations();	
		lightBeamsUpdate();
		enemyBehaviour();
		game.physics.arcade.overlap(arrows,enemy, enemyDamageTaken, null, this);
		if(playing==1) game.physics.arcade.overlap(groups[1].player,enemy, playerDamageTaken, null, this);
	}


}

function enemyDamageTaken(enemy,arrow){
	enemyLife-=1;
	arrow.kill();
}

function playerDamageTaken(player,enemy){
	player.body.position.x=0;
	player.body.velocity.x=0;
	enemy.body.position.x=900;
}

function enemyBehaviour(){
	if(playing&&enemyLife>0){
		if(enemy.position.x>=enemyLimitRight){
			enemy.body.velocity.x=-150;
			enemy.scale.x=Math.abs(enemy.scale.x);
		}else if(enemy.position.x<=enemyLimitLeft){
			enemy.body.velocity.x=150;
			enemy.scale.x=-Math.abs(enemy.scale.x);
		}
		enemy.animations.play('walks');
	}
	if(playing!=1) {
		enemy.animations.stop();
		enemy.frame=1;
	}

	if(enemyLife<=0&&!enemyDie){
		enemy.body.velocity.x=0;
		enemy.animations.play('death');
		enemyDieTime=0;
		enemyDie=true;
	}

	if(enemyDie){
		enemyDieTime+=game.time.elapsed;
		if(enemyDieTime>=1100){
			enemy.kill();
		} 
	}
	

}

function lightBeamsUpdate(){
	//Light Beams Updates:

		//game.debug.geom(line1, '#ffff00');
		//game.debug.geom(line2, '#9999ff');


		line2.start.x = groups[2].player.x + 15;
		line2.start.y = groups[2].player.y + 40;
		line2.end.x = groups[2].player.x + 15;
		line2.end.y = groups[2].player.y + 0;

		p = line2.intersects(line1, true);

		lights[1].visible = false;
		if (p) {
			lights[1].visible = true;
			var outgoing = line2.reflect(line1);

			reflection.fromAngle(p.x, p.y, outgoing, 200);

			line1.start.x = reflection.start.x;
			line1.start.y = reflection.start.y;

			line3 = new Phaser.Line(reflection.start.x, reflection.start.y, reflection.end.x, reflection.end.y);

			lights[1].x = line3.start.x;
			lights[1].y = line3.start.y;
			lights[1].angle = Math.atan2((line3.end.y - line3.start.y), (line3.end.x - line3.start.x)) * 180 / Math.PI - 90;
			lights[1].height = line3.length;

			//game.debug.geom(line3, '#ffff00');
		}
		else {
			line1.start.x = handle1.x;
			line1.start.y = handle1.y;

		}

		lights[0].x = line1.end.x;
		lights[0].y = line1.end.y;
		lights[0].angle = -(180/Math.PI) * line1.angle + 5.5;
		lights[0].height = line1.length;
}
function gameAnimations(){

	for(var i = 0; i < 3; i++){
		if( groups[i].player.body.velocity.x == 0 && standAnim) groups[i].player.animations.play('stand');
		if( !groups[i].player.body.touching.down ) groups[i].player.animations.play('jump');
	}

}

function actionControll(){
// Mechanical action
		if(cursors.action.isDown){
				switch (playing) {
					case 0:
						if(!isFiring && groups[playing].player.body.touching.down && canFire){
							groups[playing].player.animations.play('fire');
							isFiring = true;
							canFire = false;
							standAnim = false;
							canMove = false;
							fireAnimationTime = 0;
						}
						break;
					case 1:
						if(!isShooting && groups[playing].player.body.touching.down && groups[playing].player.body.velocity.x == 0 && canShoot){
							groups[playing].player.animations.play('shoot');

							var h = groups[playing].player.body.position.y + ( groups[playing].player.height / 2 );
							var side = groups[playing].player.scale.x / Math.abs(groups[playing].player.scale.x)

							a = arrows.create(groups[playing].player.body.position.x + side * ( groups[playing].player.width / 2  - 10), h+5 ,'arrow');
							a.body.velocity.x = side;
							a.anchor.setTo(.5,.5);
							a.scale.setTo(side * 0.7, 0.7);
							isShooting = true;
							canShoot = false;
							standAnim = false;
							canMove = false;
							shootAnimationTime = 0;
						}
						break;
					case 2:
					if(groups[playing].player.body.touching.down && groups[playing].player.body.velocity.x == 0 && canDefend){
						isReflecting = !isReflecting;
						//canMove = !canMove;
						standAnim = !standAnim;
						canDefend = false;
						reflectAnimationTime = 0;

						groups[playing].player.animations.play('defend');
					}
					break;
				}
			}
}

function pauseControll(){
	if(cursors.esc.isDown){
			pause.visible = true;
			game.paused = true;

			for (var i = 0; i < 3; i++) {
				groups[i].all.filters = filters;
			}

			var unpausePre = setInterval(function(){
				if(cursors.esc.isUp){
					var unpausePos = setInterval(function(){
						if(cursors.esc.isDown){
							pause.visible = false;
							this.game.paused = false;

							for (var i = 0; i < 3; i++) {
								groups[i].all.filters = null;
							}
							clearInterval(unpausePos);
						}
					}, 1000/60);
					clearInterval(unpausePre);
				}
			},1000/60);
		}
}

function filterControll(){
	// set the correct filters and stuff
		for (var i = 0; i < 3; i++) {
				if(i == playing){
					groups[i].all.filters = null;
					groups[i].bg.animations.play('color');
					groups[i].platforms.forEach(function(sprite){
				  	sprite.animations.play('color');
				 	});

				}else{
					groups[i].all.filters = [filters[0]];
					groups[i].bg.animations.play('default');
					groups[i].platforms.forEach(function(sprite){
				  	sprite.animations.play('default');
				 	});
				}
		}
}

function switchPlayer(){
	// switch players
		if (cursors.change[0].isDown) {
			groups[playing].player.body.velocity.x = 0;
			playing = 0;
			enemy.body.velocity.x = 0;
		} else if (cursors.change[1].isDown) {
			groups[playing].player.body.velocity.x = 0;
			playing = 1;
			enemy.body.velocity.x=150;
		} else if (cursors.change[2].isDown) {
			groups[playing].player.body.velocity.x = 0;
			playing = 2;
			enemy.body.velocity.x = 0;
		}
}
function movementControll(){
		// Move left & right
		if (cursors.left.isDown && canMove) {
			groups[playing].player.body.velocity.x = -150;
			groups[playing].player.scale.x = Math.abs(groups[playing].player.scale.x);
			groups[playing].player.animations.play('walk');
		} else if (cursors.right.isDown && canMove) {
			groups[playing].player.body.velocity.x = 150;
			groups[playing].player.scale.x = -Math.abs(groups[playing].player.scale.x);
			groups[playing].player.animations.play('walk');
		}

		//  Jump
		if (cursors.up.isDown && groups[playing].player.body.touching.down && canMove){
			groups[playing].player.body.velocity.y = -450;
		}
	}

function actionStatusControll(){
	if(isShooting || !canShoot) {
				shootAnimationTime += game.time.elapsed;

				if(isShooting && shootAnimationTime > 600){
					a.body.velocity.x *= -500;
					isShooting = false;
					standAnim = true;
					canMove = true;
				}else if(shootAnimationTime > 1000){
					canShoot = true;
				}
			}

			if(isFiring || !canFire) {
				fireAnimationTime += game.time.elapsed;

				if(isFiring && fireAnimationTime > 800){
					isFiring = false;
					standAnim = true;
					canMove = true;
					canFire= true;
				}
			}

			if(!canDefend) {
				reflectAnimationTime += game.time.elapsed;

				if(reflectAnimationTime > 500){
					canDefend = true;
				}
			}

			lf.position.x = groups[0].player.position.x
			lf.position.y = groups[0].player.position.y

}
