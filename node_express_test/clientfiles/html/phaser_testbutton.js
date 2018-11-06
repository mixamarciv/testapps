console.clear();


var images = [
  'balls.png',
  'beball1.png',
  'block.png',
  'blue_ball.png',
]; 

var colors = window.colors;

var GOptions = {
  width: window.screen.availWidth,
  height: window.screen.availHeight,
}

GOptions.width = window.screen.width-100;
GOptions.height = window.screen.height-200;

GOptions.width = 720;
GOptions.height = 850;

var playercursor;

window.game = new Phaser.Game({
  renderer: Phaser.CANVAS,
  height: GOptions.height,
  width: GOptions.width,

  scaleMode:   Phaser.ScaleManager.USER_SCALE,
  scaleH:      1,
  scaleV:      0.9,

  state: {
    init: function() {
      var debug = this.game.debug;
      debug.lineHeight = 20;
      debug.font = '16px monospace';
    },

    preload: function() {
      console.log('preload');
      this.load.maxParallelDownloads = 6;
      this.load.baseURL = 'https://cdn.jsdelivr.net/gh/samme/phaser-examples-assets@v1.0.0/sprites/';
      this.load.crossOrigin = 'anonymous';
      this.load.images(images, images);
      this.load.resetLocked = true;
      this.monitorLoader(this.load);

    },

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
      this.monitorLoaderExtra(this.extraLoader);

      create(this);
    },

    update: function() {

      //if      (this.cursors.up.isDown)    game.camera.setPosition(game.camera.x, game.camera.y-5);
      //else if (this.cursors.down.isDown)  playercursor.y += 5;
      //if      (this.cursors.left.isDown)  playercursor.x -= 5;
      //else if (this.cursors.right.isDown) playercursor.x += 5;
      function setCamPos(x,y){
        game.camera.setPosition(game.camera.x + x, game.camera.y + y);
      }

      if      (this.cursors.up.isDown)    setCamPos(0, -5);
      else if (this.cursors.down.isDown)  setCamPos(0, +5);
      if      (this.cursors.left.isDown)  setCamPos(-5, 0);
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

    monitorLoader: function(loader) {
      loader.onLoadStart   .add(function ()              { console.log(    'start'             ); });
      loader.onLoadStart   .add(function ()              { console.time(   'load complete'     ); });
      loader.onLoadComplete.add(function ()              { console.log(    'complete'          ); });
      loader.onLoadComplete.add(function ()              { console.timeEnd('load complete'     ); });
      loader.onPackComplete.add(function (          key) { console.log(    'pack complete', key); });
      loader.onFileComplete.add(function (progress, key) { console.log(    'file complete', key); });
      loader.onFileStart   .add(function (progress, key) { console.log(    'file started' , key); });
    },
    monitorLoaderExtra: function(loader) {
      loader.onLoadStart   .add(function ()              { console.log(    'start ex'             ); });
      loader.onLoadStart   .add(function ()              { console.time(   'load complete ex'     ); });
      loader.onLoadComplete.add(function ()              { console.log(    'complete ex'          ); });
      loader.onLoadComplete.add(function ()              { console.timeEnd('load complete ex'     ); });
      loader.onPackComplete.add(function (          key) { console.log(    'pack complete ex', key); });
      loader.onFileComplete.add(function (progress, key) { console.log(    'file complete ex', key); });
      loader.onFileStart   .add(function (progress, key) { console.log(    'file started ex' , key); });
      loader.onLoadComplete.add(function (){
        createEx(window.game);
      });
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
  game.camera.flash( '#ff0',300 );//[color] [, duration] [, force] [, alpha])
  //setTimeout(() => {
  createMap();

  var gd = window.gamedata;
  game.world.setBounds(0, 0, gd.mapsize.x, gd.mapsize.y);

  var focusbutton = window.gamedata.maphexbuttons[0][0];
  game.camera.focusOn(focusbutton);
  //}, 1);
}

function createMap(){
    let game = window.game;
    //game.add.image(100, 100, 'hex1');
    let scale = 0.9;
    let cntX = 7;
    let cntY = 7;
    let objOffsetX = 96;
    let objOffsetY = 64;
    
    let offsetXstart = 0;
    let offsetYstart = 0 + cntX*objOffsetY;

    let offsetX = offsetXstart;
    let offsetY = offsetYstart;
    //offsetX += 96;
    //offsetY += 64;
    var maphexbuttons = [];
    for(let ix=0;ix<cntX;ix++){
      //offsetX = offsetXstart + (ix-1)*objOffsetX;
      //offsetY = offsetYstart - (ix+2)*objOffsetY;
      if(ix%2==0){
          offsetX = 0;
      }else{
          offsetX = offsetXstart + objOffsetX;
      }
      offsetY = offsetYstart - (ix+2)*objOffsetY;

      offsetX = offsetXstart + (ix-1)*objOffsetX;
      offsetY = offsetYstart - (ix+2)*objOffsetY;
      maphexbuttons[ix] = [];
      for(let iy=0;iy<cntY;iy++){
        offsetX += objOffsetX;
        offsetY += objOffsetY;
        //frames in this order: over, out, down
        var hexbutton = game.add.button(offsetX, offsetY, 'hexsprite', hexClick, 4,2,2);

        hexbutton.anchor.setTo(0, 0);
        hexbutton.scale.setTo(scale,scale);
        maphexbuttons[ix][iy] = hexbutton;
      }
    }

    window.gamedata.mapsize = { x: offsetX + 128, y: offsetX + 128 }
    window.gamedata.maphexbuttons = maphexbuttons;
}

function hexClick(hexbtn){
  //hexbtn.inputEnabled = false;
  hexbtn.setFrames(4, 3, 3);
}
