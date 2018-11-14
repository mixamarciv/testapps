console.clear();

var colors = window.colors;
var GOptions = window.GOptions;

var worldScale = 1;
var gameWorld;
var multitouchDistanceToScale = 0;

var debugObj = {};

window.game = new Phaser.Game({
  //renderer: Phaser.CANVAS,
  renderer: Phaser.CANVAS,
  height: GOptions.height,
  width: GOptions.width,

  scaleMode:   Phaser.ScaleManager.USER_SCALE,
  scaleH:      1,
  scaleV:      1,

  state: {
    init: init,
    preload: preload,

    loadRender: function() {
      if(GOptions.debug.loader){
        this.game.debug.loader(this.game.load, 20, 20, colors.red);
        if (this.extraLoader) {
          this.game.debug.loader(this.extraLoader, 20,120, colors.yellow);
        }
      }
    },

    create: function() {
      console.log('create');
      //Load the plugin
      //this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);
      if(GOptions.usePlugin.kineticScrolling) this.game.kineticScrolling.start();

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
      //game.input.pointer2.start(movePoiterStart);

      var maingamedata = window.gamedata;
      maingamedata.goupmap = new Phaser.Group(game, game.world, 'z100map');
      maingamedata.goupmenu = new Phaser.Group(game, game.world, 'z500menu');
      
      this.game.kineticScrolling.configure({
          kineticMovement: true,
          timeConstantScroll: 325, //really mimic iOS
          horizontalScroll: true,
          verticalScroll: true,
          horizontalWheel: false,
          verticalWheel: true,
          deltaWheel: 40
      });
      create(this);
    },

    update: function() {
      var goupmap = window.gamedata.goupmap;
      function setCamPos(x,y){
        game.camera.setPosition(game.camera.x + x, game.camera.y + y);
        //game.camera.setPosition(goupmap.x + x, goupmap.y + y);
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
          worldScale += newdist/msize;
          multitouchDistanceToScale = game.input.pointer1.position.distance(game.input.pointer2);
        }
      }else{
        multitouchDistanceToScale = 0;
      }

      worldScale = Phaser.Math.clamp(worldScale, min=0.25, max=2);
      //game.world.scale.set(worldScale);
      goupmap.scale.set(worldScale);
      //var oldCameraScale = game.camera.scale.clone();
      //var cameraScaleRatio = Phaser.Point.divide(game.camera.scale, oldCameraScale);
      //game.camera.focusOn(Phaser.Point.multiply(center, cameraScaleRatio));
    },

    render: function() {
      this.game.debug.text(debugObj.x+':'+debugObj.y, 2, 14, "#00ff00");  
      if(GOptions.debug.main){
        var debug = this.game.debug;
        //this.loadRender();
        debug.text(game.time.fps || '--', 2, 14, "#00ff00");  
        debug.cameraInfo(game.camera, 20, 150);

        debug.inputInfo(20, 300, colors.lime);
        //debug.pointer(this.input.activePointer, colors.aqua);
        debug.device(420, 20, colors.aqua);
        //debug.phaser(10, 580, colors.gray);
      }
    },

  }
});


function create(game){

  //game.extraLoader.image("hex1", "/hex.gif");    
  game.extraLoader.spritesheet('hexsprite', GOptions.images.hexsprite.path,128,128);
  game.extraLoader.start();

  game.cursors = game.input.keyboard.createCursorKeys();
  
  //game.camera.setSize(240, 320);
}

function createEx(game){
  //game.camera.flash( '#ff0',300 );//[color] [, duration] [, force] [, alpha])

  createMap();

  var gd = window.gamedata;
  game.world.setBounds(0, 0, gd.mapsize.x, gd.mapsize.y);

  var focusbutton = gd.activeuser1btn; //кнопка текущего юзера
  game.camera.focusOn(focusbutton);


  createMainObjects();
  //setGameScale();
}

function createMainObjects(){
  const hs = window.GOptions.images.hexsprite.sprites;
  var maingamedata = window.gamedata;
  var group = maingamedata.goupmenu;
  //goup.left = 0;
  //goup.top = 0;
  //goup.fixedToCamera = true;
  {
    var hexbtn = game.add.button(0, 0, 'hexsprite', 
      setGameFullScreen,hs.user1,hs.user1,hs.user1);
    hexbtn.fixedToCamera = true;
    //hexbtn.cameraOffset.setTo(0, 0);
    group.add(hexbtn);
    debugObj = hexbtn;
  }
  {
    var hexbtn = game.add.button(128, 0, 'hexsprite', 
      clickButton_TEST1,hs.user1,hs.user1,hs.user1);
    hexbtn.fixedToCamera = true;
    //hexbtn.cameraOffset.setTo(128, 0);
    group.add(hexbtn);
  }
  {
    var hexbtn = game.add.button(256, 0, 'hexsprite', 
      clickButton_TEST2,hs.user1,hs.user1,hs.user1);
    hexbtn.fixedToCamera = true;
    //hexbtn.cameraOffset.setTo(256, 0);
    group.add(hexbtn);
  }
  {
    var hexbtn = game.add.button(382, 0, 'hexsprite', 
      clickButton_destroyMap,hs.user2,hs.user2,hs.user2);
    hexbtn.fixedToCamera = true;
    //hexbtn.cameraOffset.setTo(382, 0);
    group.add(hexbtn);
  }
  {
    var t = game.add.text(200, 500, "this text is fixed to the camera",
      { font: "32px Arial", fill: "#ffffff", align: "center" });
    t.fixedToCamera = true;
    //t.cameraOffset.setTo(200, 500);
    group.add(t);
  }
}

function onFullScreenChange() {
  if (!game.scale.isFullScreen){
    const GOptions = window.GOptions
    var width = GOptions.width;
    var height = GOptions.height;
    console.log('выход из полноэкранного режима '+width+'x'+height);
    game.scale.setGameSize(width, height);
  }else{
    var width = window.screen.width;
    var height = window.screen.height;
    console.log('переход в полноэкранный режим '+width+'x'+height);
    game.scale.setGameSize(width, height);
  }
}

function setGameFullScreen() {
  //game.scale.startFullScreen();
  //game.scale.x = 1;
  //game.scale.y = 1;
  //game.camera.scale.x = 1;
  //game.camera.scale.y = 1;
  if (game.scale.isFullScreen){
      game.scale.stopFullScreen();
  }else{
      game.scale.startFullScreen(false);
  }
}

function clickButton_TEST1(hexbtn){
  hexbtn.tint = Math.random() * 0xFFFFFF;
  game.camera.scale.x -= 0.01;
  game.camera.scale.y -= 0.01;
  //game.camera.scale.x -= 0.1;
  //game.camera.scale.y -= 0.1;
  //game.scale.setupScale(1.3, 1.5);
}

function clickButton_TEST2(btn){
  console.log('анимация исчезновения спрайта');
  game.add.tween(btn).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
}

function clickButton_destroyMap(){
  console.log('очистка карты');
  clearMap();
  console.log('создание карты');
  createMap();
}
