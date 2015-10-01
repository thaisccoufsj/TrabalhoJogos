// create the game canvas
var game = new Phaser.Game(960, 642, Phaser.AUTO, 'gameArea');

// game states
game.state.add('boot',bootState);
game.state.add('menu',menuState);
game.state.add('play',playState);

// boot the game up
game.state.start('boot');
