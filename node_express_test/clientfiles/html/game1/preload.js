console.clear();

var GOptions = window.GOptions;

function init() {
  var debug = this.game.debug;
  debug.lineHeight = 20;
  debug.font = '16px monospace';
}

function preload() {
  console.log('preload');
  /***
  this.load.maxParallelDownloads = 6;
  this.load.baseURL = 'https://cdn.jsdelivr.net/gh/samme/phaser-examples-assets@v1.0.0/sprites/';
  this.load.crossOrigin = 'anonymous';
  var images = [
    'balls.png',
    'beball1.png',
    'block.png',
    'blue_ball.png',
  ]; 
  this.load.images(images, images);
  this.load.resetLocked = true;
  
  monitorLoader(this.load);
  ***/
}




function monitorLoader(loader) {
  loader.onLoadStart   .add(function ()              { console.log(    'start'             ); });
  loader.onLoadStart   .add(function ()              { console.time(   'load complete'     ); });
  loader.onLoadComplete.add(function ()              { console.log(    'complete'          ); });
  loader.onLoadComplete.add(function ()              { console.timeEnd('load complete'     ); });
  loader.onPackComplete.add(function (          key) { console.log(    'pack complete', key); });
  loader.onFileComplete.add(function (progress, key) { console.log(    'file complete', key); });
  loader.onFileStart   .add(function (progress, key) { console.log(    'file started' , key); });
}

function monitorLoaderExtra(loader) {
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
}
