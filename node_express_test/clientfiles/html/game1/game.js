//console.clear();

window.round = Math.round;

window.PIXEL_RATIO = 1;

window.worldScale = 1;
window.movePointer = null;
window.movePointerFromMenu = 0;
window.multitouchDistanceToScale = 0;

window.debugData = {};
window.debugObj = {};

function start_game(){
  window.game = new Phaser.Game({
    renderer: Phaser.CANVAS,
    //renderer: Phaser.WEBGL,
    //renderer: Phaser.WEBGL_MULTI,
    height: GOptions.height,
    width: GOptions.width,
  
    scaleMode:   Phaser.ScaleManager.USER_SCALE,
    scaleH:      1,
    scaleV:      1,
    zoom: 3,
  
    state: {
      init: init,
      preload: game_preload,
      loadRender: game_loadRender,
      create: game_create,
      update: game_update,
      render: game_render,
    }
  });
}


function game_loadRender() {
  if(GOptions.debug.loader){
    this.game.debug.loader(this.game.load, 20, 20, colors.red);
    if (this.extraLoader) {
      this.game.debug.loader(this.extraLoader, 20,120, colors.yellow);
    }
  }
}

function game_create() {
  console.log('create');
  //if(GOptions.usePlugin.kineticScrolling) this.game.kineticScrolling.start();

  if(GOptions.fullScreen){
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.scale.onFullScreenChange.add(onFullScreenChange, this);
  }

  this.extraLoader = new Phaser.Loader(this.game);
  this.extraLoader.baseURL = GOptions.images.baseURL;
  this.extraLoader.resetLocked = true;
  monitorLoaderExtra(this.extraLoader);

  game.input.addPointer();
  game.input.addPointer();

  game.input.addMoveCallback(moveCursor, this);
  //game.input.addTouchLockCallback(movePointerBegin, this, movePointerEnd)
  //game.input.pointer2.start(movePoiterStart);

  var maingamedata = window.gamedata;
  maingamedata.groupmap = new Phaser.Group(game, game.world, 'z100map');
  maingamedata.groupmenu = new Phaser.Group(game, game.world, 'z500menu');
  
  game.scale.refresh();
  /*********************
  this.game.kineticScrolling.configure({
      kineticMovement: true,
      timeConstantScroll: 325, //really mimic iOS
      horizontalScroll: true,
      verticalScroll: true,
      horizontalWheel: false,
      verticalWheel: true,
      deltaWheel: 40
  });
  *********************/
  create(this);
}

function game_update() {

  if(game.input.mousePointer.isUp && game.input.pointer1.isUp){
    //если отпустили курсор мышки или тап
    movePointer = null;
    movePointerFromMenu = 0; 
  }
  
  if      (this.cursors.up.isDown   ) setCamPos(0, -5);
  else if (this.cursors.down.isDown ) setCamPos(0, +5);
  if      (this.cursors.left.isDown ) setCamPos(-5, 0);
  else if (this.cursors.right.isDown) setCamPos(+5, 0);

  // zoom
  if (   game.input.keyboard.isDown(Phaser.Keyboard.PLUS)
      || game.input.keyboard.isDown(Phaser.Keyboard.EQUALS)
      || game.input.keyboard.isDown(Phaser.Keyboard.NUMPAD_ADD)
  ) {
      worldScale *= 1.01;
  }else 
  if (   game.input.keyboard.isDown(Phaser.Keyboard.MINUS)
      || game.input.keyboard.isDown(Phaser.Keyboard.NUMPAD_SUBTRACT)
  ) {
      worldScale *= 0.99;
  }

  if(game.input.pointer1.isDown && game.input.pointer2.isDown){
    if(multitouchDistanceToScale==0) { //если только сделали двойной тап
      multitouchDistanceToScale = game.input.pointer1.position.distance(game.input.pointer2);
    }else{
      var newdist = game.input.pointer1.position.distance(game.input.pointer2) - multitouchDistanceToScale;
      var msize = Math.max(game.scale.width,game.scale.height);
      worldScale += newdist*PIXEL_RATIO/msize;
      multitouchDistanceToScale = game.input.pointer1.position.distance(game.input.pointer2);
    }
  }else{
    multitouchDistanceToScale = 0;
  }

  worldScale = Phaser.Math.clamp(worldScale, min=0.25, max=2);
  var groupmap = window.gamedata.groupmap;

  groupmap.scale.set(worldScale);
  var b = window.gamedata.mapsize;
  game.world.setBounds(0, 0, b.width*worldScale, b.height*worldScale);
}

function game_render() {
  show_debug_info();
}

function setCamPos(x,y){
  game.camera.setPosition(game.camera.x + x, game.camera.y + y);
  //game.camera.setPosition(goupmap.x + x, goupmap.y + y);
}

function moveCursor(poh,x,y) {
  if(movePointerFromMenu) return;
  x *= PIXEL_RATIO;
  y *= PIXEL_RATIO;
  if(game.input.mousePointer.isDown || game.input.pointer1.isDown){
    if(game.input.pointer2.isDown){ // если нажали несколько кнопок
      movePointer = null;
      return;
    }
    //console.log('mousePointer isDown');
    //const {x,y} = game.input.pointer1;
    if(!movePointer){
      const cam = game.camera;
      var menuPos = cam.height - cam.height*GOptions.gameMenu.screenHSize;
      if( y > menuPos){
        movePointerFromMenu = 1;
        console.log('mapMenuClick('+x+','+y+')');
        return mapMenuClick(x,y);
      } 
      movePointer = {x:x,y:y};
      return;
    }
    game.camera.setPosition(game.camera.x + movePointer.x-x, 
                            game.camera.y + movePointer.y-y);
    movePointer = {x:x,y:y};
  }else{
    movePointer = null;
  }
}


function create(game){
  let objSize = window.GOptions.images.hexsprite.size;
  //game.extraLoader.image("hex1", "/hex.gif");    
  game.extraLoader.spritesheet('hexsprite', GOptions.images.hexsprite.path, objSize, objSize);
  game.extraLoader.image('button', '/button.png');
  game.extraLoader.image('settings', '/settings.png');
  game.extraLoader.start();

  game.cursors = game.input.keyboard.createCursorKeys();
  
  //game.camera.setSize(240, 320);
}

//запускается в preload.js после загрузки всех объектов
function createEx(game){
  UPDATE_PIXEL_RATIO();
  createGameObjects();
  createMapMenu();
}


function createGameObjects(){
  console.log('GOptions: ');
  console.log(GOptions);

  clearMap();
  createMap();
  //game.camera.flash( '#ff0',300 );//[color] [, duration] [, force] [, alpha])
  
  var gd = window.gamedata;
  game.world.setBounds(0, 0, gd.mapsize.width, gd.mapsize.height);
  
  var focusbutton = gd.activeuser1btn; //кнопка текущего юзера
  game.camera.focusOn(focusbutton);
}


function setGameFullScreen() {
  console.log('setGameFullScreen()');
  var game = window.game;
  window.gamedata.menu.settingsBtn.tint = Math.random()* 0xffffff;
  //var test = 'begin';
  //window.gamedata.menu.mainText.setText(test);
  if (game.scale.isFullScreen){
      //test += ' stopFS';
      //window.gamedata.menu.mainText.setText(test);
      game.scale.stopFullScreen();
  }else{
      //test += ' startFS';
      //window.gamedata.menu.mainText.setText(test);
      game.scale.startFullScreen(false);
  }
  //test += ' end';
  //window.gamedata.menu.mainText.setText(test);
}


function onFullScreenChange() {
  var groupmap = window.gamedata.groupmap;
  if (!game.scale.isFullScreen){
    const GOptions = window.GOptions
    var width = GOptions.width;
    var height = GOptions.height;
    console.log('выход из полноэкранного режима '+width+'x'+height);
    game.scale.setGameSize(width, height);
    resizeMenu(1);
    UPDATE_PIXEL_RATIO();
    //groupmap.scale.setGameSize(width, height);
  }else{
    var width = window.screen.width;
    var height = window.screen.height;
    console.log('переход в полноэкранный режим '+width+'x'+height);
    game.scale.setGameSize(width, height);
    resizeMenu(1);
    UPDATE_PIXEL_RATIO();
    //groupmap.scale.setGameSize(width, height);
  }
}

function UPDATE_PIXEL_RATIO() {
  PIXEL_RATIO = window.devicePixelRatio;

  PIXEL_RATIO = Math.floor( PIXEL_RATIO );
  if(PIXEL_RATIO>1){
    if(game.camera.height<=640) return PIXEL_RATIO = 1; 
  }
  /****
  var ctx = document.createElement("canvas");
  
  .getContext("2d"),

      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
      dpr = window.devicePixelRatio || 1,
      // The backing store size in relation to the canvas element
      bsr = ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio || 1

  PIXEL_RATIO = Math.ceil( dpr / bsr );
  *****/
};
