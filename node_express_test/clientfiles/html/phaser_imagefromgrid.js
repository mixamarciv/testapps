console.clear();


var images = [
  'balls.png',
  'beball1.png',
  'block.png',
  'blue_ball.png',
]; 

var images_map = {};

images_map.alien = [
  '....44........',
  '....44........',
  '......5.......',
  '......5.......',
  '....ABBBBA....',
  '...ABBBBBBA...',
  '..ABB8228BBA..',
  '..BB882288BB..',
  '.ABB885588BBA.',
  'BBBB885588BBBB',
  'BBBB788887BBBB',
  '.ABBB7777BBBA.',
  '.ABBBBBBBBBBA.',
  '.AABBBBBBBBAA.',
  '.AAAAAAAAAAAA.',
  '.5AAAAAAAAAA5.'
];

var colors = window.colors;
var GOptions = {
  width: window.screen.availWidth,
  height: window.screen.availHeight,
}
GOptions.width = window.screen.width-100;
GOptions.height = window.screen.height-200;


window.game = new Phaser.Game({
  height: GOptions.height,
  renderer: Phaser.CANVAS,
  width: GOptions.width,
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
      this.monitorLoader(this.extraLoader);
      

      this.extraLoader.image("hex1", "/hex.gif");

      this.extraLoader.imageFromTexture('alien', images_map.alien, 8, 8);
      this.extraLoader.imageFromGrid('grid', 800, 600, 200, 150, 'rgba(255,127,0,0.5)');
      
      this.extraLoader.start();


      setTimeout(() => {
        let game = window.game;
        game.add.image(200, 150, 'alien');
        game.add.image(0, 0, 'grid');
      
        game.add.image(100, 400, 'hex1');
      }, 500);
      

    },

    update: function() {
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
  }
});
