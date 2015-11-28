var groups;

var cursors;
var pause;

var playing;

var shootAnimationTime = 0;
var isShooting = false;
var canShoot = true;

var reflectAnimationTime = 0;
var isReflecting = false;
var canDefend = true;

var standAnim = true;
var canMove = true;

var lines;
var linebounds;
var reflector;

var button;
var isPressed;

//Light Beam Reflection point:
var p = new Phaser.Point();

var lightStart;
var lightEnd;
var lights;
var cristal;

var lfx;

var arrows;
var a;
var enemy;
var enemyLife=3;
var enemyLimitRight=850;
var enemyLimitLeft=200;
var enemyDieTime=0;
var enemyDie=false;
var plat;

var arrowShootAudio;
var torchSound;
var enemyHit;
var hitAnimation=false;
var hitTime=0; 

var amountKeys=0;
var p1;
var wallActive=true;



var playState = {

	create: function() {
		// Groups
		groups = []
		arrowShootAudio=game.add.audio('arrow');
		enemyHit=game.add.audio('bowHit');
		torchSound=game.add.audio('torch',true);
		for (var i = 0; i < 3; i++) {
			// creates the structure of each group
			groups[i] = {
				all: game.add.group(),
				player: null,
				bg: null,
				platforms: game.add.group(),
				misc: game.add.group(),
				walls: game.add.group(),
				keys: game.add.group()
				
			};

			// nesting groups

			groups[i].bg = groups[i].all.create(0, i * 213, 'back');
			groups[i].all.add(groups[i].platforms);
			//groups[i].all.add(groups[i].walls)
			groups[i].all.add(groups[i].misc);

			// adding physics to the group
			groups[i].platforms.enableBody = true;
			groups[i].walls.enableBody=true;
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
					lights[0] = game.add.tileSprite(0,0,10,0,'lbeam');
					lights[0].anchor.setTo(.5,0)
					lights[1] = game.add.tileSprite(0,0,10,0,'lbeam');
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

		}
		
			temp = groups[0].platforms.create(0, 213 - 68 * 0.6, 'R0');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);

			temp = groups[0].platforms.create(249 * 0.6, (315 - 98) * 0.6, 'R1');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);

			temp = groups[0].platforms.create(825 * 0.6, (256 - 98) * 0.6, 'R2');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);

			temp = groups[0].platforms.create(927 * 0.6, (345 - 98) * 0.6, 'R3');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);

			temp = groups[1].platforms.create(0, 213 * 2 - 68 * 0.6, 'G0');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);

			temp = groups[1].platforms.create(400, 213 * 2 - 100, 'G1');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);
			temp.body.checkCollision.down = false;
			temp.body.checkCollision.right = false;
			temp.body.checkCollision.left = false;

			temp = groups[2].platforms.create(0, 213 * 3 - 68 * 0.6, 'B0');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);

			temp = groups[2].walls.create(1152 * 0.6, (880 - 98) * 0.6, 'B1');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);

			temp = groups[2].walls.create(1152 * 0.6, (1080 - 98) * 0.6, 'B2');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);

			button = groups[0].misc.create(694 * 0.6, (345 - 116) * 0.6,'button');
			button.enableBody = true;
			game.physics.arcade.enable(button);
			button.body.immovable = true;
			button.scale.setTo(.5,.6);
			button.animations.add('press',[0,1,2,3]);
			button.animations.add('unpress',[3,2,1,0]);

			cristal = groups[2].misc.create(800,510,'crystal');
			cristal.scale.setTo(.6,.6);
			cristal.animations.add('stop',[0]);
			cristal.animations.add('glow',[0,1,2,3,4,5,6,7,8],7,true);


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

			//create keys
			
			groups[i].keys=groups[i].all.create(900,i*214,'mykey');
			groups[i].keys.scale.setTo(0.10,0.10);
			game.physics.arcade.enable(groups[i].keys);
			groups[i].keys.enableBody = true;
			groups[i].keys.body.gravity.y = 900;
			groups[i].keys.body.collideWorldBounds = true;
			
		}

		//enemy
		enemy=game.add.sprite(900,220,'dog');
		enemy.scale.setTo(.8,.8);
		enemy.anchor.setTo(0.5, 0.5);
		game.physics.arcade.enable(enemy);
		enemy.enableBody=true;
		enemy.body.gravity.y = 900;
		enemy.body.collideWorldBounds = true;
		enemy.animations.add('walks',[0,1,2,3,4],6);
		enemy.animations.add('death',[6,7,8,9,10,11,12],6);
		enemy.animations.add('stand',[13,14,15,16,17,18,19,20,21],5);
		enemy.animations.add('hit',[22,23],5);


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
		lines = []
		lines[0] = new Phaser.Line(600,430, 600, 217*3 - (93 * .6));
		lines[1] = new Phaser.Line(0,0,0,0);
		linebounds = [];
		linebounds[0] = new Phaser.Line(0,425, 960, 425);
		linebounds[1] = new Phaser.Line(0,217*3 - (93 * .6), 960, 217*3 - (93 * .6));
		linebounds[2] = new Phaser.Line(0,425, 0, 217*3 - (93 * .6));
		linebounds[3] = new Phaser.Line(960,425, 960, 217*3 - (93 * .6));

		reflector = []
		reflector[0] = new Phaser.Line(0,0,0,0);
		reflector[1] = new Phaser.Line(cristal.x,cristal.y,cristal.x + cristal.width,cristal.y + cristal.height);
		groups[1].keys.x=800;
		groups[1].keys.y=700;
		groups[1].keys.body.gravity.y=0;
	},

	start: function(){
		//torchSound.play('',0,0.4,true,true);
		torchSound.loopFull(2.0);

	},

	update: function() {
		//  Collide each group with itself
		for (var i = 0; i < 3; i++) {
			if(i!=1) game.physics.arcade.overlap(groups[i].keys,groups[i].player,getKey,null,this);
			else if(enemyDie) game.physics.arcade.overlap(groups[i].keys,groups[i].player,getKey,null,this);
			game.physics.arcade.collide(groups[i].all, groups[i].all);
		}
		if(wallActive)	game.physics.arcade.collide(groups[2].player,groups[2].walls);
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
		pressButton();
		hitAnimationControll();
		game.physics.arcade.overlap(arrows,enemy, enemyDamageTaken, null, this);
		if(playing==1 && !enemyDie) game.physics.arcade.overlap(groups[1].player,enemy, playerDamageTaken, null, this);
		audioControll();
		startNextLevel();
	}


}

function startNextLevel(){
	if(amountKeys==3){
		//animação
		//game.state.start('play2');
		torchSound.pause();
		game.stateTransition.to('play2');
	}
}

function getKey(keys,player){
	//tocar som de pegar chave
	amountKeys++;
	keys.kill();
}

function pressButton(){
		if(groups[0].player.body.touching.down && button.body.touching.up && !isPressed){
			button.animations.play('press');
			isPressed = true;
			button.body.height = button.body.height - (20*.6);
			button.body.offset.y = 20*.6;
			button.body.reset(button.x,button.y);
		}else if(groups[0].player.body.touching.down && !button.body.touching.up && isPressed){
			button.animations.play('unpress');
			isPressed = false;
			button.body.height = button.body.height + (20*.6);
			button.body.offset.y = 0;
			button.body.reset(button.x,button.y);
		}
}


function enemyDamageTaken(enemy,arrow){
	enemyLife-=1;
	arrow.kill();
	enemyHit.play();
	hitAnimation=true;
	enemy.body.velocity.x=0;
	enemy.animations.play('hit');
}

function playerDamageTaken(player,enemy){
	player.body.position.x=0;
	player.body.velocity.x=0;
	enemy.body.position.x=900;
	enemyLife=3;
}

function hitAnimationControll(){
	if(hitAnimation==false){
		enemyBehaviour();
	}else if(hitAnimation==true){
		if(hitTime>300){
			hitAnimation=false;
			hitTime=0;
			enemyStart();
		}else{
			hitTime+=game.time.elapsed;
		}
	}
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

	if(playing!=1)
		enemy.body.velocity.x=0;


	if(!enemy.animations.isPlaying){
		hitAnimation=false;
	} 
	if(playing!=1) {
		enemy.animations.play('stand');
	}

	if(enemyLife<=0&&!enemyDie){
		//createKey(enemy.body.position.x);
		groups[1].keys.x=enemy.body.position.x;
		groups[1].keys.y=enemy.body.position.y;
		groups[1].keys.body.gravity.y=900;
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

function createKey(xPosition){
	groups[1].keys=groups[1].all.create(xPosition,628.3,'mykey');
	groups[1].keys.scale.setTo(0.10,0.10);
	game.physics.arcade.enable(groups[1].keys);
	groups[1].keys.enableBody = true;
	groups[1].keys.body.gravity.y = 900;
	groups[1].keys.body.collideWorldBounds = true;
	groups[1].keys.visible=true;
}

function enemyStart(){
	if(enemy.scale.x>0) enemy.body.velocity.x=-150;
	else if(enemy.scale.x<0) enemy.body.velocity.x=150;
}

function lightBeamsUpdate(){
	reflector[0].start.x = groups[2].player.x + groups[2].player.width / 2;
	reflector[0].start.y = groups[2].player.y;
	reflector[0].end.x = groups[2].player.x - groups[2].player.width / 2;
	reflector[0].end.y = groups[2].player.y + groups[2].player.height;

	for (var i = 0; i < lines.length; i++) {
		if(isReflecting){
			p = lines[0].intersects(reflector[0]);
			if(p){
				lines[0].end.y = p.y;
				var side = groups[playing].player.scale.x / Math.abs(groups[playing].player.scale.x)
				lines[1].start.x = p.x;
				lines[1].start.y = p.y
				lines[1].end.y = p.y;
				lines[1].end.x = side * -1000;
			}
		}else{
			lines[0].end.y = 640;
			lines[1].start.x = 0;
			lines[1].start.y = 0
			lines[1].end.y = 0;
			lines[1].end.x = 0;
		}

		p = lines[1].intersects(reflector[1]);
		if(p && isPressed){
			cristal.animations.play('glow');
			groups[2].walls.visible=false;
			groups[2].walls.enableBody=false;
			wallActive=false;

		}

		for (var j = 0; j < linebounds.length; j++) {
			p = lines[i].intersects(linebounds[j]);
			if(p){
				lines[i].end.x = p.x;
				lines[i].end.y = p.y;
			}
		}
		if(isPressed){
			lights[i].x = lines[i].start.x;
			lights[i].y = lines[i].start.y;
			lights[i].height = lines[i].length;
			lights[i].angle = Math.atan2((lines[i].end.y - lines[i].start.y), (lines[i].end.x - lines[i].start.x)) * 180 / Math.PI - 90;
		}else{
			lights[i].height=0;
		}
	}

}

function gameAnimations(){

	for(var i = 0; i < 3; i++){
		if( groups[i].player.body.velocity.x == 0 && standAnim) groups[i].player.animations.play('stand');
		if( !groups[i].player.body.touching.down ) groups[i].player.animations.play('jump');
	}
}

function audioControll(){
	if(playing==0){
		if(!torchSound.isPlaying) torchSound.loopFull(2.0);

	}else{
		torchSound.pause();
	}
}

function actionControll(){
		if(cursors.action.isDown){
				switch (playing) {
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
							//game.sound.play('arrow');
							arrowShootAudio.play('',0,8,false,true);
						}
						break;
					case 2:
					if(groups[playing].player.body.touching.down && groups[playing].player.body.velocity.x == 0 && canDefend){
						isReflecting = !isReflecting;
						canMove = !canMove;
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
				groups[i].walls.filters=filters;
			}

			var unpausePre = setInterval(function(){
				if(cursors.esc.isUp){
					var unpausePos = setInterval(function(){
						if(cursors.esc.isDown){
							pause.visible = false;
							this.game.paused = false;

							for (var i = 0; i < 3; i++) {
								groups[i].all.filters = null;
								groups[i].walls.filters = null;
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
					groups[i].walls.filters = null;
					groups[i].bg.animations.play('color');
					groups[i].platforms.forEach(function(sprite){
				  	sprite.animations.play('color');
				 	});
				 	groups[i].walls.forEach(function(sprite){
				  	sprite.animations.play('color');
				 	});

				}else{
					groups[i].all.filters = [filters[0]];
					groups[i].walls.filters = [filters[0]];
					groups[i].bg.animations.play('default');
					groups[i].platforms.forEach(function(sprite){
				  	sprite.animations.play('default');
				 	});
				 	groups[i].walls.forEach(function(sprite){
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
			//audioControll();
		} else if (cursors.change[1].isDown) {
			groups[playing].player.body.velocity.x = 0;
			playing = 1;
			enemyStart();
			//audioControll();
		} else if (cursors.change[2].isDown) {
			groups[playing].player.body.velocity.x = 0;
			playing = 2;
			enemy.body.velocity.x = 0;
			//audioControll();
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
			groups[playing].player.body.velocity.y = -350;
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

			
			if(!canDefend) {
				reflectAnimationTime += game.time.elapsed;

				if(reflectAnimationTime > 500){
					canDefend = true;
				}
			}

			lf.position.x = groups[0].player.position.x
			lf.position.y = groups[0].player.position.y

}
