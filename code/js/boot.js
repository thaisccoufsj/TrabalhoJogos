var filters;
var fs = require('fs');

var bootState = {
  preload : function(){
    game.load.spritesheet('back','../../assets/img/BG.png', 2662, 356);
  	game.load.spritesheet('ground','../../assets/img/Ground.png',1600,77);
  	game.load.spritesheet('hero0', '../../assets/img/HeroRed.png', 99, 71);
    game.load.spritesheet('hero1', '../../assets/img/HeroGreen.png', 56, 72);
    game.load.spritesheet('hero2', '../../assets/img/HeroBlue.png', 56, 68);

    game.load.image('arrow','../../assets/img/arrow.png');
    game.load.image('lfx','../../assets/img/Light.png');
    game.load.image('lbeam','../../assets/img/Beam.png');

    game.load.image('logo','../../assets/img/Logo.png');
    game.load.spritesheet('story', '../../assets/img/StorySlides.png', 392, 452);
    game.load.image('storyBG', '../../assets/img/StoryBack.png')

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
