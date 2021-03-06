//console.clear();

window.round = Math.round;

window.PIXEL_RATIO = 1;

window.worldScale = 1;

window.lastIncTime = 0; // время последнего инкремента при зажатии на хексе

window.debugData = {};
window.debugObj = {};

window.game = {};
window.game.start_game = start_game;

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

  //game.input.addPointer();
  //game.input.addPointer();

  //game.input.addMoveCallback(moveCursor, this);
  //game.input.addTouchLockCallback(movePointerBegin, this, movePointerEnd)
  //game.input.pointer2.start(movePoiterStart);

  var maingamedata = window.gamedata;
  maingamedata.groupmap = new Phaser.Group(game, game.world, 'z100map');
  maingamedata.groupmenu = new Phaser.Group(game, game.world, 'z500menu');
  
  game.scale.refresh();

  window.gametouch.init(); //отлавливаем нажатия по экрану
  create(this);
}

function game_update() {
  const countTouch = window.gametouch.contTouches();
  if(countTouch==0){
      if      (this.cursors.up.isDown   ) setCamPos(0, -5);
      else if (this.cursors.down.isDown ) setCamPos(0, +5);
      if      (this.cursors.left.isDown ) setCamPos(-5, 0);
      else if (this.cursors.right.isDown) setCamPos(+5, 0);

      // zoom
      var oldScale = worldScale, newScale = worldScale;
      if (   game.input.keyboard.isDown(Phaser.Keyboard.PLUS)
          || game.input.keyboard.isDown(Phaser.Keyboard.EQUALS)
          || game.input.keyboard.isDown(Phaser.Keyboard.NUMPAD_ADD)
      ) {
          newScale *= 1.01;
      }else 
      if (   game.input.keyboard.isDown(Phaser.Keyboard.MINUS)
          || game.input.keyboard.isDown(Phaser.Keyboard.NUMPAD_SUBTRACT)
      ) {
          newScale *= 0.99;
      }
      if(oldScale != newScale){
        game_world_resize(newScale);
      }
  }

  if(countTouch==1){
    var isinc = game_isTimeoutTapDownIncUserHex();
    if(isinc){
      hexClick(window.gamedata.lastClickHex_gd.bntobj);
      //var time = window.gametouch.lastTouchTime();
      window.lastIncTime = window.gametouch.lastTouchTime();
    }
  }
  
}

function game_world_resize(new_worldScale){
  var newWorldScale = Phaser.Math.clamp(new_worldScale, min=0.25, max=2);
  var oldWorldScale = worldScale;
  if(newWorldScale==oldWorldScale) return; // ничего не изменилось, расходимся
  worldScale = newWorldScale;
  var groupmap = window.gamedata.groupmap;
  
  const cam = game.camera;
  var b = window.gamedata.mapsize;
  
  var x = cam.x;
  var y = cam.y;

  groupmap.scale.set(worldScale);
  game.world.setBounds(0, 0, b.width*worldScale, b.height*worldScale);

  var s = oldWorldScale - newWorldScale;
  cam.setPosition( x - x*s, y - y*s );

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
  if(window.gamedata.status.turntype != 'inc') return 0;

  // если небыло ещё последнего нажатого хекса
  if(!window.gamedata.lastClickHex_gd) return 0;

  // если последний раз нажимал не по своему хексу
  if(act_currentUser().id != window.gamedata.lastClickHex_gd.owner) return 0;

  var time = window.gametouch.lastTouchTime();
  if( window.lastIncTime > time ) window.lastIncTime = 0;

  //если еще не прошел нужный таймаут
  if( time - window.lastIncTime < GOptions.inputTimeoutInc ) return 0;

  // если двинул камеру более чем на distance
  if(1){
    // тут будут проверки из window.gametouch
  }

  return 1;
}

function moveCursor(poh,x,y) {
  //if(movePointerFromMenu) return;
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
        //movePointerFromMenu = 1;
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
  //console.log('GOptions: ');
  //console.log(GOptions);

  //createmap.clearMap();
  createmap.createMap();
  //createmap.createuserobj();
  //game.camera.flash( '#ff0',300 );//[color] [, duration] [, force] [, alpha])
  
  var gd = window.gamedata;
  game.world.setBounds(0, 0, gd.mapsize.width, gd.mapsize.height);
  
  var focusbutton = gd.activeuser1btn; //кнопка текущего юзера
  if(focusbutton){
    game.camera.focusOn(focusbutton);
  }
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
