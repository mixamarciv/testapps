//console.clear();

window.round = Math.round;

window.PIXEL_RATIO = 1;

window.worldScale = 1;
window.movePointer = null;
window.movePointerFromMenu = 0;
window.multitouchDistanceToScale = 0;

window.isIncTapDownStartTime = 0; //является ли нажатие увеличением силы хекса
window.isIncTapDownTapPoint = null; // место первоначального нажатия
window.isIncTapDownTapPointLastDist = 0;
window.gametouch = {
  count:0,
  movecount: 0, 
  toches:[],
};

window.debugData = {};
window.debugObj = {};

function start_game(){
  {//определяем размер перед загрузкой  
    //вот тут док для айфона и ещё немного полезной инфы:
    //  https://www.joshmorony.com/how-to-scale-a-game-for-all-device-sizes-in-phaser/
    // и тут:
    //  https://medium.com/slow-cooked-games-blog/how-to-create-a-mobile-game-on-the-cheap-38a7b75999a7
    // надо юзать * window.devicePixelRatio
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    //alert(x + ' × ' + y);
    GOptions.width  = x;
    GOptions.height = y;
  }

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

  {//отлавливаем нажатия по экрану
    var el = document.getElementsByTagName("canvas")[0];
    el.addEventListener("touchstart",  handle_touchstart, false);
    el.addEventListener("touchend",    handle_touchend, false);
    el.addEventListener("touchcancel", handle_touchcancel, false);
    el.addEventListener("touchmove",   handle_touchmove, false);

    
    el.addEventListener("mousedown",   handle_mousedown, false);
    el.addEventListener("mouseup",     handle_mouseup, false);
    //el.addEventListener("mousemove",   handle_mousemove, false);
    el.addEventListener("wheel",       handle_mousewheel, false);
    el.addEventListener("mousewheel",  handle_mousewheel, false);
    

  }
  create(this);
}

function handle_mousewheel(evt){
  var s = evt.wheelDelta/50;
  s = worldScale/100 * s;
  worldScale += s;
  game_world_resize(worldScale);
}
function handle_mousedown(evt){
  window.gametouch.count += 1;
}
function handle_mouseup(evt){
  window.gametouch.count -= 1;
}


function handle_touchstart(evt){
  var touches = evt.changedTouches;
  window.gametouch.count = touches.length;
}
function handle_touchend(evt){
  var touches = evt.changedTouches;
  window.gametouch.count -= touches.length;
}
function handle_touchcancel(evt){
  var touches = evt.changedTouches;
  window.gametouch.count -= touches.length;
}
function handle_touchmove(evt){
  var touches = evt.changedTouches;
  window.gametouch.movecount = touches.length;
}

function game_update() {

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

  if(game.input.mousePointer.isUp && game.input.pointer1.isUp){
    //если отпустили курсор мышки или тап
    movePointer = null;
    movePointerFromMenu = 0; 
    isIncTapDownStartTime = 0;
    isIncTapDownTapPoint = null;
    game.input.reset();
  }else 
  if((game.input.mousePointer.isDown || game.input.pointer1.isDown) && isIncTapDownStartTime >= 0){
    if(game_isTimeoutTapDownIncUserHex()){
      if(isIncTapDownStartTime==0) isIncTapDownStartTime = new Date();
      t = new Date() - isIncTapDownStartTime;
      if(t > GOptions.inputTimeoutInc){
        hexClick(window.gamedata.lastClickHex_gd.bntobj);
        isIncTapDownStartTime = new Date() - GOptions.inputTimeoutInc/2;
      }
    }
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
  game_world_resize(worldScale);
}

function game_world_resize(new_worldScale){
  worldScale = Phaser.Math.clamp(new_worldScale, min=0.25, max=2);
  var groupmap = window.gamedata.groupmap;

  groupmap.scale.set(worldScale);
  var b = window.gamedata.mapsize;
  game.world.setBounds(0, 0, b.width*worldScale, b.height*worldScale);
  
  //сохраняем настройки пользователя
  //GOptions.gameMap.startWorldScale = worldScale; - но только не здесь
}

//выполняем подготовку к сохранению пользовательских настроек игры
function game_prepare_to_save_options(){
  //сохраняем настройки пользователя
  if(!mainMenu.gameIsCreated()) return 0; //только если игра уже была создана
  GOptions.gameMap.startWorldScale = worldScale; //только тут
}

function game_render() {
  show_debug_info();
}

function setCamPos(x,y){
  game.camera.setPosition(game.camera.x + x, game.camera.y + y);
  //game.camera.setPosition(goupmap.x + x, goupmap.y + y);
}

// определяет все ли условия соблюдены для увеличения силы по таймауту нажатия
function game_isTimeoutTapDownIncUserHex(){
  if(isIncTapDownStartTime<0) return 0;

  // если сейчас не увеличиваем силу клеток
  if(window.gamedata.status.turntype != 'inc') return 0;

  // если небыло ещё последнего нажатого хекса
  if(!window.gamedata.lastClickHex_gd) return 0;

  // если последний раз нажимал не по своему хексу
  if(act_currentUser().id != window.gamedata.lastClickHex_gd.owner) return 0;

  // если двинул камеру более чем на distance
  if(isIncTapDownTapPoint){
    var p = game.input.mousePointer.position;
    if(p && p.x==0 && p.y==0) p = game.input.pointer1.position;
    var distance = round(p.distance(isIncTapDownTapPoint));
    isIncTapDownTapPointLastDist = distance;
    if( distance*PIXEL_RATIO > GOptions.minDistanceToMoveWithoutInc ){
      isIncTapDownStartTime = -1; // то больше не выполняем этих проверок
      return 0;
    }
  }

  return 1;
}

function moveCursor(poh,x,y) {
  if(movePointerFromMenu) return;
  if(game.input.mousePointer.isDown || game.input.pointer1.isDown){
    if(game.input.pointer2.isDown){ // если нажали несколько кнопок
      isIncTapDownStartTime = -1;
      movePointer = null;
      return;
    }
    x *= PIXEL_RATIO;
    y *= PIXEL_RATIO;
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
      isIncTapDownTapPoint = movePointer;
      return;
    }
    
    game.camera.setPosition(game.camera.x + movePointer.x-x, 
                            game.camera.y + movePointer.y-y);
    
    movePointer = {x:x,y:y};
  }else{
    movePointer = null;
    isIncTapDownTapPoint = null;
    isIncTapDownStartTime = 0;
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
  game_world_resize(GOptions.gameMap.startWorldScale);
}


function createGameObjects(){
  console.log('GOptions: ');
  console.log(GOptions);

  clearMap();
  createMap();
  createuserobj();
  //game.camera.flash( '#ff0',300 );//[color] [, duration] [, force] [, alpha])
  
  var gd = window.gamedata;
  game.world.setBounds(0, 0, gd.mapsize.width, gd.mapsize.height);
  
  var focusbutton = gd.activeuser1btn; //кнопка текущего юзера
  game.camera.focusOn(focusbutton);
}


function setGameFullScreen() {
  console.log('setGameFullScreen()');
  var game = window.game;
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
