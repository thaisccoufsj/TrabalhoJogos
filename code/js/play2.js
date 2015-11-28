var group;

var cursor;
var pause2;

var playing;

var shootAnimationTime2 = 0;
var isShooting2 = false;
var canShoot2 = true;

var reflectAnimationTime2 = 0;
var isReflecting2 = false;
var canDefend2 = true;

var standAnim2 = true;
var canMove2 = true;

var lineR;
var lineL;
var lightsR;
var lightsL;
var lineboundsR;
var lineboundsL;
var reflectorR;
var reflectorL;

var buttons =[];

//Light Beam Reflection point:
var p2 = new Phaser.Point();
var q = new Phaser.Point();

var lightStart2;
var lightEnd2;
var cristalR;
var cristalL;

var lfx;

var arrow;
var a;
var enemys;
var enemysHit;

var enemysLimitLeft=[150,500];
var enemysLimitRight=[400,850];
var platform;

var arrowShootSound;
var torchSound;

var amountKeys2=0;
var wallsActive=[true,true];
var amountenemysDeaths=0;
var enemysId;
var enemysInfo;



var playState2 = {

	create: function() {
		// group
		group = []
		arrowShootSound=game.add.audio('arrow');
		enemysHit=game.add.audio('bowHit');
		torchSound=game.add.audio('torch');

		for (var i = 0; i < 3; i++) {
			// creates the structure of each group
			group[i] = {
				all: game.add.group(),
				player: null,
				bg: null,
				platformforms: game.add.group(),
				misc: game.add.group(),
				wallR: game.add.group(),
				wallL: game.add.group(),
				wallT: game.add.group(),
				keys: game.add.group()
				
			};
			buttons[i] = {
				buttonSprite:null,
				isPressed:false
			};
			
			// nesting group

			group[i].bg = group[i].all.create(0, i * 213, 'back');
			group[i].all.add(group[i].platformforms);
			//group[i].all.add(group[i].walls)
			group[i].all.add(group[i].misc);

			// adding physics to the group
			group[i].platformforms.enableBody = true;
			group[i].wallR.enableBody=true;
			group[i].wallL.enableBody=true;
			group[i].wallT.enableBody=true;
			switch(i){
				case 0:
					lf = group[0].all.create(0,0,'lfx');
					lf.anchor.setTo(.5,.5);
					break;

				case 1:
					arrow=game.add.group();
					arrow.enableBody=true;
					break;

				case 2:
					lightsR = [];
					lightsL=[];
					lightsR[0] = game.add.tileSprite(0,0,10,0,'lbeam');
					lightsR[0].anchor.setTo(.5,0);
					lightsR[1] = game.add.tileSprite(0,0,10,0,'lbeam');
					lightsR[1].anchor.setTo(.5,0);

					lightsL[0] = game.add.tileSprite(0,0,10,0,'lbeam');
					lightsL[0].anchor.setTo(.5,0)
					lightsL[1] = game.add.tileSprite(0,0,10,0,'lbeam');
					lightsL[1].anchor.setTo(.5,0)
					break;
			}
		}

	
		// Base stage
		var temp;

		for (var i = 0; i < 3; i++){
			// sets the stage background
			group[i].bg.scale.setTo(.6,.6);

			// sets the color and grey states
			group[i].bg.animations.add('default', [0]);
			group[i].bg.animations.add('color', [i + 1]);

		}
			//red
		
			temp = group[0].platformforms.create(0, 213 - 68 * 0.6, 'R0');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);

			temp = group[0].platformforms.create(100 * 0.6, (250) * 0.6, 'R1');
			temp.body.immovable = true;
			temp.scale.setTo(.3,.3);

			temp = group[0].platformforms.create(400*0.6, 100 , 'G1');
			temp.body.immovable = true;
			temp.scale.setTo(.4,.4);
			temp.body.checkCollision.down = false;
			temp.body.checkCollision.right = false;
			temp.body.checkCollision.left = false;

			buttons[0].buttonSprite = group[0].misc.create(465*0.6,60,'button');
			buttons[0].buttonSprite.enableBody = true;
			game.physics.arcade.enable(buttons[0].buttonSprite);
			buttons[0].buttonSprite.body.immovable = true;
			buttons[0].buttonSprite.scale.setTo(.5,.6);
			buttons[0].buttonSprite.animations.add('press',[0,1,2,3]);
			buttons[0].buttonSprite.animations.add('unpress',[3,2,1,0]);

			temp = group[0].wallT.create(694 * 0.6,20 , 'B1');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);

			temp = group[0].wallT.create(694 * 0.6,140, 'B2');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);

			temp = group[0].platformforms.create(900 * 0.6, (250) * 0.6, 'R1');
			temp.body.immovable = true;
			temp.scale.setTo(.3,.3);

			buttons[2].buttonSprite = group[0].misc.create(1125*0.6,225* 0.6,'button');
			buttons[2].buttonSprite.enableBody = true;
			game.physics.arcade.enable(buttons[2].buttonSprite);
			buttons[2].buttonSprite.body.immovable = true;
			buttons[2].buttonSprite.scale.setTo(.5,.6);
			buttons[2].buttonSprite.animations.add('press',[0,1,2,3]);
			buttons[2].buttonSprite.animations.add('unpress',[3,2,1,0]);

			temp = group[0].platformforms.create(1200 * 0.6, (250) * 0.6, 'R1');
			temp.body.immovable = true;
			temp.scale.setTo(.3,.3);


			//green
			temp = group[1].platformforms.create(0, 213 * 2 - 68 * 0.6, 'G0');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);

			temp = group[1].platformforms.create(400, 213 * 2 - 100, 'G1');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);
			temp.body.checkCollision.down = false;
			temp.body.checkCollision.right = false;
			temp.body.checkCollision.left = false;

			buttons[1].buttonSprite = group[1].misc.create(475,288,'button');
			buttons[1].buttonSprite.enableBody = true;
			game.physics.arcade.enable(buttons[1].buttonSprite);
			buttons[1].buttonSprite.body.immovable = true;
			buttons[1].buttonSprite.scale.setTo(.5,.6);
			buttons[1].buttonSprite.animations.add('press',[0,1,2,3]);
			buttons[1].buttonSprite.animations.add('unpress',[3,2,1,0]);

			//blue

			temp = group[2].platformforms.create(0, 213 * 3 - 68 * 0.6, 'B0');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);

			temp = group[2].wallR.create(1152 * 0.6, (880 - 98) * 0.6, 'B1');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);

			temp = group[2].wallR.create(1152 * 0.6, (1080 - 98) * 0.6, 'B2');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);

			temp = group[2].wallL.create(400 * 0.6, (880 - 98) * 0.6, 'B1');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);

			temp = group[2].wallL.create(400 * 0.6, (1080 - 98) * 0.6, 'B2');
			temp.body.immovable = true;
			temp.scale.setTo(.6,.6);

			//cristais
			cristalL = group[2].misc.create(350,510,'crystal');
			cristalL.scale.setTo(.6,.6);
			cristalL.animations.add('stop',[0]);
			cristalL.animations.add('glow',[0,1,2,3,4,5,6,7,8],7,true);

			cristalR = group[2].misc.create(800,510,'crystal');
			cristalR.scale.setTo(.6,.6);
			cristalR.animations.add('stop',[0]);
			cristalR.animations.add('glow',[0,1,2,3,4,5,6,7,8],7,true);


		//Players
		player = [];

		for (var i = 0; i < 3; i++) {
			// creates the players sprites
			group[i].player = group[i].all.create(0, i*214, 'hero'+i);
		  	group[i].player.scale.setTo(.6,.6);
			group[i].player.anchor.setTo(.5,0);

			// creates the base animations for the player movement
			group[i].player.animations.add('stand', [0,1,2,3,4], 7, true);
			group[i].player.animations.add('walk', [5,6,7,8], 6);
			group[i].player.animations.add('jump', [9]);

			// some physics constants
			game.physics.arcade.enable(group[i].player);
			group[i].player.enableBody = true;
			group[i].player.body.gravity.y = 900;
			group[i].player.body.collideWorldBounds = true;

			//create keys
			
			group[i].keys=group[i].all.create(900,i*214,'mykey');
			group[i].keys.scale.setTo(0.10,0.10);
			game.physics.arcade.enable(group[i].keys);
			group[i].keys.enableBody = true;
			group[i].keys.body.gravity.y = 900;
			group[i].keys.body.collideWorldBounds = true;
			
		}

		//enemys
		enemys=[]
		enemysInfo=[]
		for(var i=0;i<2;i++){
			var posx;
			if(i==0) posx=400;
			else posx=900;
			enemysInfo[i]={
				enemysLife:3,
				hitAnimation:false,
				hitTime:0,
				enemysDieTime:0,
				enemysDie:false
			};
			enemys[i]=game.add.sprite(posx,361.2,'dog');
			enemys[i].scale.setTo(.8,.8);
			enemys[i].anchor.setTo(0.5, 0.5);
			game.physics.arcade.enable(enemys[i]);
			enemys[i].enableBody=true;
			enemys[i].body.gravity.y = 900;
			enemys[i].body.collideWorldBounds = true;
			enemys[i].animations.add('walks',[0,1,2,3,4],6);
			enemys[i].animations.add('death',[6,7,8,9,10,11,12],6);
			enemys[i].animations.add('stand',[13,14,15,16,17,18,19,20,21],5);
			enemys[i].animations.add('hit',[22,23],5);
		}


		group[0].player.animations.add('fire',[10,11],3);
		group[1].player.animations.add('shoot',[10,11,12],10);
		group[2].player.animations.add('defend',[10]);

		playing = 0;

		// Controls
		cursor = {};
		cursor.left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		cursor.right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		cursor.up = game.input.keyboard.addKey(Phaser.Keyboard.Z);
		cursor.action = game.input.keyboard.addKey(Phaser.Keyboard.X);

		cursor.change = [];
		cursor.change[0] = game.input.keyboard.addKey(Phaser.Keyboard.A);
		cursor.change[1] = game.input.keyboard.addKey(Phaser.Keyboard.S);
		cursor.change[2] = game.input.keyboard.addKey(Phaser.Keyboard.D);

		cursor.esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);

		//pause2 Menu
		pause2 = game.add.group();
		pause2.visible = false;

		var style = {font: "65px Arial", fill: "#fff", strokeThickness:3, align: "left" }
		var text = game.add.text(game.world.centerX, game.world.centerY, "- pause2 -",style);
		pause2.add(text);

		text.updateText();
		text.position.x -= ( text.width / 2 );
		text.position.y -= 100;

		style.font = "35px Arial";
		text = game.add.text(game.world.centerX, game.world.centerY, "⇆ : Mover\nZ : Pular\nX : Ação\nA, S, D : Trocar heroi",style);
		pause2.add(text);

		text.updateText();
		text.position.x -= ( text.width / 2 );

		//Light Beam
		lineR = []
		lineR [0] = new Phaser.Line(600,430, 600, 217*3 - (93 * .6));
		lineR [1] = new Phaser.Line(0,0,0,0);
		lineboundsR = [];
		lineboundsR[0] = new Phaser.Line(0,425, 960, 425);
		lineboundsR[1] = new Phaser.Line(0,217*3 - (93 * .6), 960, 217*3 - (93 * .6));
		lineboundsR[2] = new Phaser.Line(0,425, 0, 217*3 - (93 * .6));
		lineboundsR[3] = new Phaser.Line(960,425, 960, 217*3 - (93 * .6));

		reflectorR = []
		reflectorR[0] = new Phaser.Line(0,0,0,0);
		reflectorR[1] = new Phaser.Line(cristalR.x,cristalR.y,cristalR.x + cristalR.width,cristalR.y + cristalR.height);

		group[1].keys.x=800;
		group[1].keys.y=700;
		group[1].keys.body.gravity.y=0;

		//line 2

		lineL= [];
		lineL [0] = new Phaser.Line(200,430, 200, 217*3 - (93 * .6));
		lineL [1] = new Phaser.Line(0,0,0,0);
		lineboundsL = [];
		lineboundsL[0] = new Phaser.Line(0,425, 960, 425);
		lineboundsL[1] = new Phaser.Line(0,217*3 - (93 * .6), 960, 217*3 - (93 * .6));
		lineboundsL[2] = new Phaser.Line(0,425, 0, 217*3 - (93 * .6));
		lineboundsL[3] = new Phaser.Line(960,425, 960, 217*3 - (93 * .6));

		reflectorL = []
		reflectorL[0] = new Phaser.Line(0,0,0,0);
		reflectorL[1] = new Phaser.Line(cristalL.x,cristalL.y,cristalL.x + cristalL.width,cristalL.y + cristalL.height);

	},

	start: function(){
		torchSound.play('',0,2.0,true,true);
		torchSound.loopFull(2.0);

	},

	update: function() {
		//  Collide each group with itself
		for (var i = 0; i < 3; i++) {
			if(i!=1) game.physics.arcade.overlap(group[i].keys,group[i].player,getkey2,null,this);
			else if(enemysInfo[0].enemysDie && enemysInfo[1].enemysDie) game.physics.arcade.overlap(group[i].keys,group[i].player,getkey2,null,this);
			game.physics.arcade.collide(group[i].all, group[i].all);
		}
		
		if(wallsActive[0]){
			game.physics.arcade.collide(group[2].player,group[2].wallL);
			game.physics.arcade.collide(group[0].player,group[0].wallT);
		}	
		if(wallsActive[1])	game.physics.arcade.collide(group[2].player,group[2].wallR);
		
		game.physics.arcade.collide(enemys[0],group[1].platformforms);
		game.physics.arcade.collide(enemys[1],group[1].platformforms);
		game.physics.arcade.collide(group[1].player,platform);
		group[playing].player.body.velocity.x = 0;
		movementControll2();
		actionControll2();
		actionStatusControll2();
		switchPlayer2();
		filterControll2();
		pause2Controll();
		gameAnimations2();	
		lightBeamsUpdateR();
		lightBeamsUpdateL();
		pressButton2();
		hitAnimationControll2();
		game.physics.arcade.overlap(arrow,enemys[0], enemysDamageTaken2, setId, this);
		game.physics.arcade.overlap(arrow,enemys[1], enemysDamageTaken2, setId2, this);
		if(playing==1){
			 if(!enemysInfo[0].enemysDie) game.physics.arcade.overlap(group[1].player,enemys[0], playerDamageTaken2, setId, this);
			 if(!enemysInfo[1].enemysDie) game.physics.arcade.overlap(group[1].player,enemys[1], playerDamageTaken2, setId2, this);
		}
		audioControll2();


		
	}


}

function setId(){
	enemysId=0;
	return true;
}
function setId2(){
	enemysId=1;
	return true;
}


function getkey2(keys,player){
	//tocar som de pegar chave
	amountKeys2++;
	keys.kill();
}

function pressButton2(){
		var id=0;
		for(var i=0;i<3;i++){
			if(i==1) id=1;
			else id=0;
			if(group[id].player.body.touching.down && buttons[i].buttonSprite.body.touching.up && !buttons[i].isPressed){
				buttons[i].buttonSprite.animations.play('press');
				buttons[i].isPressed = true;
				buttons[i].buttonSprite.body.height = buttons[i].buttonSprite.body.height - (20*.6);
				buttons[i].buttonSprite.body.offset.y = 20*.6;
				buttons[i].buttonSprite.body.reset(buttons[i].buttonSprite.x,buttons[i].buttonSprite.y);
			}else if(group[id].player.body.touching.down && !buttons[i].buttonSprite.body.touching.up && buttons[i].isPressed){
				buttons[i].buttonSprite.animations.play('unpress');
				buttons[i].isPressed = false;
				buttons[i].buttonSprite.body.height = buttons[i].buttonSprite.body.height + (20*.6);
				buttons[i].buttonSprite.body.offset.y = 0;
				buttons[i].buttonSprite.body.reset(buttons[i].buttonSprite.x,buttons[i].buttonSprite.y);
		}
	}
}


function enemysDamageTaken2(enemys,arrow){
	if(enemysInfo[enemysId].enemysDie) return;
	enemysInfo[enemysId].enemysLife-=1;
	arrow.kill();
	enemysHit.play();
	enemysInfo[enemysId].hitAnimation=true;
	enemys.body.velocity.x=0;
	enemys.animations.play('hit');

}

function playerDamageTaken2(player,enemyss){
	player.body.position.x=0;
	player.body.velocity.x=0;
	for(var i=0;i<2;i++){
		enemys[i].body.position.x=enemysLimitRight[i];
		enemysInfo[i].enemysLife=3;
	}
}

function hitAnimationControll2(){
	for(var i=0;i<2;i++){
		if(enemysInfo[i].hitAnimation==false){
			enemysBehaviour(i);
		}else if(enemysInfo[i].hitAnimation==true){
			if(enemysInfo[i].hitTime>300){
				enemysInfo[i].hitAnimation=false;
				enemysInfo[i].hitTime=0;
				enemysStart(i);
			}else{
				enemysInfo[i].hitTime+=game.time.elapsed;
			}
		}
	}
	
}

function enemysBehaviour(ID){
	
		//movimentacao
		if(playing&&enemysInfo[ID].enemysLife>0){
			if(enemys[ID].position.x>=enemysLimitRight[ID]){
				enemys[ID].body.velocity.x=-150;
				enemys[ID].scale.x=Math.abs(enemys[ID].scale.x);
			}else if(enemys[ID].position.x<=enemysLimitLeft[ID]){
				enemys[ID].body.velocity.x=150;
			enemys[ID].scale.x=-Math.abs(enemys[ID].scale.x);
			}
			enemys[ID].animations.play('walks');
		}

		if(playing!=1)
			enemys[ID].body.velocity.x=0;


		if(!enemys[ID].animations.isplaying){
			enemysInfo[ID].hitAnimation=false;
		} 
		if(playing!=1) {
			enemys[ID].animations.play('stand');
		}



		if((enemysInfo[ID].enemysLife<=0)&&(!enemysInfo[ID].enemysDie)){
			//createKey2(enemys.body.position.x);
			if(amountenemysDeaths>=1){
				group[1].keys.x=enemys[ID].body.position.x;
				group[1].keys.y=enemys[ID].body.position.y;
				group[1].keys.body.gravity.y=900;
			}
			enemys[ID].body.velocity.x=0;
			enemys[ID].animations.play('death');
			enemysInfo[ID].enemysDieTime=0;
			enemysInfo[ID].enemysDie=true;
			amountenemysDeaths+=1;
		}

		if(enemysInfo[ID].enemysDie){
			enemysInfo[ID].enemysDieTime+=game.time.elapsed;
			if(enemysInfo[ID].enemysDieTime>=1100){
			enemys[ID].kill();
			} 
		}	

	
}

function createKey2(xPosition){
	group[1].keys=group[1].all.create(xPosition,628.3,'mykey');
	group[1].keys.scale.setTo(0.10,0.10);
	game.physics.arcade.enable(group[1].keys);
	group[1].keys.enableBody = true;
	group[1].keys.body.gravity.y = 900;
	group[1].keys.body.collideWorldBounds = true;
	group[1].keys.visible=true;
}

function enemysStart(ID){
	if(enemys[ID].scale.x>0) enemys[ID].body.velocity.x=-150;
	else if(enemys[ID].scale.x<0) enemys[ID].body.velocity.x=150;
}

function lightBeamsUpdateL(){
	reflectorL[0].start.x = group[2].player.x + group[2].player.width / 2;
	reflectorL[0].start.y = group[2].player.y;
	reflectorL[0].end.x = group[2].player.x - group[2].player.width / 2;
	reflectorL[0].end.y = group[2].player.y + group[2].player.height;

	for (var i = 0; i < lineL.length; i++) {
		if(isReflecting2){
			q = lineL[0].intersects(reflectorL[0]);
			if(q){
				lineL[0].end.y = q.y;
				var side = group[playing].player.scale.x / Math.abs(group[playing].player.scale.x);
				lineL[1].start.x = q.x;
				lineL[1].start.y = q.y
				lineL[1].end.y = q.y;
				lineL[1].end.x = side * -1000;
			}
		}else{
			lineL[0].end.y = 640;
			lineL[1].start.x = 0;
			lineL[1].start.y = 0
			lineL[1].end.y = 0;
			lineL[1].end.x = 0;
		}

		q = lineL[1].intersects(reflectorL[1]);

		if(q && buttons[0].isPressed && buttons[1].isPressed){
			cristalL.animations.play('glow');
			group[0].wallT.visible=false;
			group[0].wallT.enableBody=false;
			group[2].wallL.visible=false;
			group[2].wallL.enableBody=false;
			wallsActive[0]=false;

		}

		for (var j = 0; j < lineboundsL.length; j++) {
			q = lineL[i].intersects(lineboundsL[j]);
			if(q){
				lineL[i].end.x = q.x;
				lineL[i].end.y = q.y;
			}
		}
		if(buttons[0].isPressed && buttons[1].isPressed){
			lightsL[i].x = lineL[i].start.x;
			lightsL[i].y = lineL[i].start.y;
			lightsL[i].height = lineL[i].length;
			lightsL[i].angle = Math.atan2((lineL[i].end.y - lineL[i].start.y), (lineL[i].end.x - lineL[i].start.x)) * 180 / Math.PI - 90;
		}else{
			lightsL[i].height=0;
		}
	}
}

function lightBeamsUpdateR(){
	reflectorR[0].start.x = group[2].player.x + group[2].player.width / 2;
	reflectorR[0].start.y = group[2].player.y;
	reflectorR[0].end.x = group[2].player.x - group[2].player.width / 2;
	reflectorR[0].end.y = group[2].player.y + group[2].player.height;

	for (var i = 0; i < lineR.length; i++) {
		if(isReflecting2){
			p2 = lineR[0].intersects(reflectorR[0]);
			if(p2){
				lineR[0].end.y = p2.y;
				var side = group[playing].player.scale.x / Math.abs(group[playing].player.scale.x);
				lineR[1].start.x = p2.x;
				lineR[1].start.y = p2.y
				lineR[1].end.y = p2.y;
				lineR[1].end.x = side * -1000;
			}
		}else{
			lineR[0].end.y = 640;
			lineR[1].start.x = 0;
			lineR[1].start.y = 0
			lineR[1].end.y = 0;
			lineR[1].end.x = 0;
		}

		p2 = lineR[1].intersects(reflectorR[1]);

		if(p2 && buttons[2].isPressed){
			cristalR.animations.play('glow');
			group[2].wallR.visible=false;
			group[2].wallR.enableBody=false;
			wallsActive[1]=false;

		}

		for (var j = 0; j < lineboundsR.length; j++) {
			p2 = lineR[i].intersects(lineboundsR[j]);
			if(p2){
				lineR[i].end.x = p2.x;
				lineR[i].end.y = p2.y;
			}
		}
		if(buttons[2].isPressed){
			lightsR[i].x = lineR[i].start.x;
			lightsR[i].y = lineR[i].start.y;
			lightsR[i].height = lineR[i].length;
			lightsR[i].angle = Math.atan2((lineR[i].end.y - lineR[i].start.y), (lineR[i].end.x - lineR[i].start.x)) * 180 / Math.PI - 90;
		}else{
			lightsR[i].height=0;
		}
	}

}

function gameAnimations2(){

	for(var i = 0; i < 3; i++){
		if( group[i].player.body.velocity.x == 0 && standAnim2) group[i].player.animations.play('stand');
		if( !group[i].player.body.touching.down ) group[i].player.animations.play('jump');
	}
}

function audioControll2(){
	if(playing==0){
		if(!torchSound.isplaying) torchSound.loopFull(2.0);

	}else{
		torchSound.pause();
	}
}

function actionControll2(){
		if(cursor.action.isDown){
				switch (playing) {
					case 1:
						if(!isShooting2 && group[playing].player.body.touching.down && group[playing].player.body.velocity.x == 0 && canShoot2){
							group[playing].player.animations.play('shoot');

							var h = group[playing].player.body.position.y + ( group[playing].player.height / 2 );
							var side = group[playing].player.scale.x / Math.abs(group[playing].player.scale.x)

							a = arrow.create(group[playing].player.body.position.x + side * ( group[playing].player.width / 2  - 10), h+5 ,'arrow');
							a.body.velocity.x = side;
							a.anchor.setTo(.5,.5);
							a.scale.setTo(side * 0.7, 0.7);
							isShooting2 = true;
							canShoot2 = false;
							standAnim2 = false;
							canMove2 = false;
							shootAnimationTime2 = 0;
							//game.sound.play('arrow');
							arrowShootSound.play('',0,8,false,true);
						}
						break;
					case 2:
					if(group[playing].player.body.touching.down && group[playing].player.body.velocity.x == 0 && canDefend2){
						isReflecting2 = !isReflecting2;
						canMove2 = !canMove2;
						standAnim2 = !standAnim2;
						canDefend2 = false;
						reflectAnimationTime2 = 0;

						group[playing].player.animations.play('defend');
					}
					break;
				}
			}
}

function pause2Controll(){
	if(cursor.esc.isDown){
			pause2.visible = true;
			game.pause2d = true;

			for (var i = 0; i < 3; i++) {
				group[i].all.filters = filters;
				group[i].wallsR.filters=filters;
				group[i].wallsL.filters=filters;
			}

			var unpausePre = setInterval(function(){
				if(cursor.esc.isUp){
					var unpausePos = setInterval(function(){
						if(cursor.esc.isDown){
							pause2.visible = false;
							this.game.paused = false;

							for (var i = 0; i < 3; i++) {
								group[i].all.filters = null;
								group[i].wallsR.filters = null;
								group[i].wallsL.filters = null;
							}
							clearInterval(unpausePos);
						}
					}, 1000/60);
					clearInterval(unpausePre);
				}
			},1000/60);
		}
}

function filterControll2(){
	// set the correct filters and stuff
		for (var i = 0; i < 3; i++) {
				if(i == playing){
					group[i].all.filters = null;
					group[i].wallR.filters = null;
					group[i].wallL.filters = null;
					group[i].wallT.filters = null;
					group[i].bg.animations.play('color');
					group[i].platformforms.forEach(function(sprite){
				  	sprite.animations.play('color');
				 	});
				 	group[i].wallR.forEach(function(sprite){
				  	sprite.animations.play('color');
				 	});
				 	group[i].wallT.forEach(function(sprite){
				  	sprite.animations.play('color');
				 	});
				 	group[i].wallL.forEach(function(sprite){
				  	sprite.animations.play('color');
				 	});

				}else{
					group[i].all.filters = [filters[0]];
					group[i].wallR.filters = [filters[0]];
					group[i].wallL.filters = [filters[0]];
					group[i].wallT.filters = [filters[0]];
					group[i].bg.animations.play('default');
					group[i].platformforms.forEach(function(sprite){
				  	sprite.animations.play('default');
				 	});
				 	group[i].wallR.forEach(function(sprite){
				  	sprite.animations.play('default');
				 	});
				 	group[i].wallT.forEach(function(sprite){
				  	sprite.animations.play('default');
				 	});
				 	group[i].wallL.forEach(function(sprite){
				  	sprite.animations.play('default');
				 	});
				}
		}
}

function switchPlayer2(){
	// switch players
		if (cursor.change[0].isDown) {
			group[playing].player.body.velocity.x = 0;
			playing = 0;
			enemys[0].body.velocity.x = 0;
			enemys[1].body.velocity.x = 0;
			//audioControll2();
		} else if (cursor.change[1].isDown) {
			group[playing].player.body.velocity.x = 0;
			playing = 1;
			enemysStart(0);
			enemysStart(1);
			//audioControll2();
		} else if (cursor.change[2].isDown) {
			group[playing].player.body.velocity.x = 0;
			playing = 2;
			enemys[0].body.velocity.x = 0;
			enemys[1].body.velocity.x = 0;
			//audioControll2();
		}
}

function movementControll2(){
		// Move left & right
		if (cursor.left.isDown && canMove2) {
			group[playing].player.body.velocity.x = -150;
			group[playing].player.scale.x = Math.abs(group[playing].player.scale.x);
			group[playing].player.animations.play('walk');
		} else if (cursor.right.isDown && canMove2) {
			group[playing].player.body.velocity.x = 150;
			group[playing].player.scale.x = -Math.abs(group[playing].player.scale.x);
			group[playing].player.animations.play('walk');
		}

		//  Jump
		if (cursor.up.isDown && group[playing].player.body.touching.down && canMove2){
			group[playing].player.body.velocity.y = -350;
		}
	}

function actionStatusControll2(){
	if(isShooting2 || !canShoot2) {
				shootAnimationTime2 += game.time.elapsed;



				if(isShooting2 && shootAnimationTime2 > 600){
					a.body.velocity.x *= -500;
					isShooting2 = false;
					standAnim2 = true;
					canMove2 = true;
				}else if(shootAnimationTime2 > 1000){
					canShoot2 = true;
				}
			}

			
			if(!canDefend2) {
				reflectAnimationTime2 += game.time.elapsed;

				if(reflectAnimationTime2 > 500){
					canDefend2 = true;
				}
			}

			lf.position.x = group[0].player.position.x
			lf.position.y = group[0].player.position.y

}
