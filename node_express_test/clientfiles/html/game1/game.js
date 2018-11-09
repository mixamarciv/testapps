console.clear();

var colors = window.colors;
var GOptions = window.GOptions;
var playercursor;

window.game = new Phaser.Game({
  //renderer: Phaser.CANVAS,
  renderer: Phaser.WEBGL,
  height: GOptions.height,
  width: GOptions.width,

  scaleMode:   Phaser.ScaleManager.USER_SCALE,
  scaleH:      1,
  scaleV:      0.9,

  state: {
    init: init,
    preload: preload,

    loadRender: function() {
      this.game.debug.loader(this.game.load, 20, 20, colors.red);
      if (this.extraLoader) {
        this.game.debug.loader(this.extraLoader, 20,120, colors.yellow);
      }
    },

    create: function() {
      console.log('create');

      this.extraLoader = new Phaser.Loader(this.game);
      this.extraLoader.baseURL = '/clientfiles/html/img/hex1';
      this.extraLoader.resetLocked = true;
      monitorLoaderExtra(this.extraLoader);

      create(this);
    },

    update: function() {
      function setCamPos(x,y){
        game.camera.setPosition(game.camera.x + x, game.camera.y + y);
      }
      if      (this.cursors.up.isDown   ) setCamPos(0, -5);
      else if (this.cursors.down.isDown ) setCamPos(0, +5);
      if      (this.cursors.left.isDown ) setCamPos(-5, 0);
      else if (this.cursors.right.isDown) setCamPos(+5, 0);
      //this.world.wrap(playercursor);
    },

    render: function() {
      var debug = this.game.debug;
      this.loadRender();

      debug.inputInfo(20, 300, colors.lime);
      debug.pointer(this.input.activePointer, colors.aqua);
      debug.device(420, 20, colors.aqua);
      debug.phaser(10, 580, colors.gray);
    },

  }
});

function create(game){
  window.gamedata = {
    maphexbuttons: []   // maphexbuttons[x][y] = button
  }

  game.extraLoader.image("hex1", "/hex.gif");    
  game.extraLoader.spritesheet('hexsprite', "/hexsprite.png",128,128);
  game.extraLoader.start();

  game.cursors = game.input.keyboard.createCursorKeys();
  
  //game.camera.setSize(240, 320);
}

function createEx(game){
  //game.camera.flash( '#ff0',300 );//[color] [, duration] [, force] [, alpha])

  createMap();

  var gd = window.gamedata;
  game.world.setBounds(0, 0, gd.mapsize.x, gd.mapsize.y);

  var focusbutton = window.gamedata.maphexbuttons[0][0];
  game.camera.focusOn(focusbutton);

}

