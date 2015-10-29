var menuState = {

  photos : [],
  pressZ : null,
  logo : null,
  keypress : null,

  create: function(){
    
    var bg = game.add.sprite(0,0,'storyBG');

    for (var i = 0; i < 9; i++) {
      this.photos[i] = game.add.sprite(game.world.width / 2 + (Math.random()*90 - 45) ,game.world.height / 2 + (Math.random()*60 - 30),'story')
      this.photos[i].frame = i;
      this.photos[i].anchor.setTo(0.5, 0.5);
      this.photos[i].rotation = Math.random() - 0.5
      this.photos[i].alpha = 0;
      this.photos[i].scale.setTo(1.3,1.3);
      game.time.events.add(1000 + 4000 * i, function(sprite){
        game.add.tween(sprite).to({alpha: 1.0}, 2000, Phaser.Easing.Linear.None, true);
        game.add.tween(sprite.scale).to({x:1.0, y:1.0}, 1000, Phaser.Easing.Linear.None, true);
      }, this, this.photos[i]);
    }

    this.photos[9] = game.add.sprite(game.world.width / 2 ,game.world.height / 2 ,'story')
    this.photos[9].frame = 9;
    this.photos[9].anchor.setTo(0.5, 0.5);
    this.photos[9].alpha = 0;
    this.photos[9].scale.setTo(1.5,1.5);
    game.time.events.add(1000 + 4000 * 9, function(sprite){
      game.add.tween(sprite).to({alpha: 1.0}, 3000, Phaser.Easing.Linear.None, true);
      game.add.tween(sprite.scale).to({x:1.0, y:1.0}, 2000, Phaser.Easing.Linear.None, true);
    }, this, this.photos[9]);

    var style = { font: "45px Arial", fill: "white", strokeThickness:5, align: "center" };
    this.pressZ = game.add.text(game.world.centerX, game.world.height - 100, "- Pressione Z para iniciar - ", style);
    this.pressZ.updateText();
    this.pressZ.position.x -= ( this.pressZ.width / 2 );
    this.pressZ.alpha = 0;

    this.logo = game.add.sprite(game.world.centerX,100,'logo')
    this.logo.anchor.setTo(0.5, 0.5);
    this.logo.alpha = 0;

    game.time.events.add(42000, function(text,logo){
      game.add.tween(text).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 1000, true);
      game.add.tween(logo).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);

      this.keypress.onDown.addOnce(this.start,this);
    },this,this.pressZ,this.logo);

    //var nameLabel = game.add.text(80,80,'RBG',{font:'50px Arial',fill:'#ffffff'});
    this.keypress = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.keypress.onDown.addOnce(this.skip,this);
  },

  start: function(){
    game.state.start('play');
  },

  skip: function(){
    for (var i = 0; i < 10; i++){
      this.photos[i].alpha = 1;
      this.photos[i].scale.setTo(1,1);
    }

    game.add.tween(this.pressZ).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 1000, true);
    this.logo.alpha = 1;

    this.keypress.onDown.addOnce(this.start,this);
  }
}
