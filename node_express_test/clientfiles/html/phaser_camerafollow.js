console.clear();

var player;
var YELLOW = 'rgba(255,255,0,0.75)';
var RED = 'rgba(255,0,0,0.75)';

var game = new Phaser.Game({
  antialias: false,
  // height:      600,
  // renderer:    Phaser.AUTO,
  // resolution:  1,
  // scaleMode:   Phaser.ScaleManager.RESIZE,
  // transparent: false,
  // width:       800,
  state: {
    preload: preload,
    create: create,
    update: update,
    render: render
  }
});

function preload() {
  this.load.baseURL =
    "https://cdn.jsdelivr.net/gh/samme/phaser-examples-assets@v1.0.0/";
  this.load.crossOrigin = "anonymous";
  this.load.image("grid", "tests/debug-grid-1920x1920.png");
  this.load.image("player", "sprites/phaser-dude.png");
}

function create() {
  var debug = game.debug;
  var view = this.camera.view;
  
  debug.font = "16px monospace";
  debug.lineHeight = 20;

  game.world.setBounds(0, 0, 1920, 1920);

  var grid = game.add.image(0, 0, "grid");
  grid.alpha = 0.5;

  player = game.add.sprite(
    game.world.centerX,
    game.world.centerY,
    "player"
  );
  player.name = "Player";

  this.cursors = game.input.keyboard.createCursorKeys();

  this.camera.focusOn(player);
  this.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN, 0.1, 0.1);
  $follow.value = Phaser.Camera.FOLLOW_TOPDOWN;
}

function update() {
  if      (this.cursors.up.isDown)    player.y -= 5;
  else if (this.cursors.down.isDown)  player.y += 5;
  if      (this.cursors.left.isDown)  player.x -= 5;
  else if (this.cursors.right.isDown) player.x += 5;

  this.world.wrap(player);
}

function render() {
  var debug = game.debug;
  var camera = game.camera;
  
  debug.camera(camera, (camera.atLimit.x || camera.atLimit.y) ? RED : YELLOW, false);
  debug.cameraInfo(camera, 20, 20);
  debug.spriteCoords(player, 20, 320);
}

$follow = document.getElementById('follow');
$follow
  .addEventListener('change', function (event) {
    game.camera.follow(player, Number(event.target.value));
  });
