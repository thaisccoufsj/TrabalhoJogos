var filters;
var fs = require('fs');

var bootState = {
  preload : function(){
    game.load.spritesheet('back','../../assets/img/BG.png', 2662, 356);
  	game.load.spritesheet('ground','../../assets/img/Ground.png',1600,77);
  	game.load.spritesheet('hero0', '../../assets/img/HeroRed.png',62, 71);
    game.load.spritesheet('hero1', '../../assets/img/HeroGreen.png', 56, 72);
    game.load.spritesheet('hero2', '../../assets/img/HeroBlue.png', 56, 68);
    game.load.spritesheet('dog','../../assets/img/enemy/dog2.png',94,60);
    game.load.spritesheet('button','../../assets/img/button.png', 72, 64);
    game.load.spritesheet('crystal','../../assets/img/cristal.png', 125, 145);

    game.load.image('R0','../../assets/img/Stage1/rmaior.png');
    game.load.image('R1','../../assets/img/Stage1/r1.png');
    game.load.image('R2','../../assets/img/Stage1/r2.png');
    game.load.image('R3','../../assets/img/Stage1/r3.png');

    game.load.image('B0','../../assets/img/Stage1/bmaior.png');
    game.load.image('B1','../../assets/img/Stage1/b1.png');
    game.load.image('B2','../../assets/img/Stage1/b2.png');

    game.load.image('G0','../../assets/img/Stage1/gmaior.png');
    game.load.image('G1','../../assets/img/Stage1/g1.png');

    game.load.image('arrow','../../assets/img/arrow.png');
    game.load.image('lfx','../../assets/img/Light.png');
    game.load.image('lbeam','../../assets/img/Beam.png');

    game.load.image('logo','../../assets/img/Logo.png');
    game.load.spritesheet('story', '../../assets/img/StorySlides.png', 392, 452);
    game.load.image('storyBG', '../../assets/img/StoryBack.png');

    game.load.audio('arrow','../../assets/audio/arrow.wav');
    game.load.audio('torch','../../assets/audio/torch2.wav');
    game.load.audio('bowHit','../../assets/audio/arrowDamage.wav');
    game.load.audio('intro','../../assets/audio/Intro.wav');

  	game.load.script('Gray', '../../assets/filters/Gray.js');
  	game.load.script('filterX', '../../assets/filters/FilterX.js');
  	game.load.script('filterY', '../../assets/filters/FilterY.js');
  },
  create : function(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //Pixel Shaders
		filters = [];
		filters[0] = game.add.filter('Gray');
		filters[1] = game.add.filter('BlurX');
		filters[2] = game.add.filter('BlurY');

    game.state.start('menu');
  }
}
