console.clear();

var colors = window.colors;
var GOptions = window.GOptions;

var worldScale = 1;
var menuScale = 1;
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
      maingamedata.groupmap = new Phaser.Group(game, game.world, 'z100map');
      maingamedata.groupmenu = new Phaser.Group(game, game.world, 'z500menu');
      
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
      var groupmap = window.gamedata.groupmap;
      var groupmenu = window.gamedata.groupmenu;

      //game.world.scale.set(worldScale);
      //groupmap.scale.set(worldScale);
      
      //groupmenu.scale.set(menuScale);
      groupmap.scale.set(worldScale);
      var b = window.gamedata.mapsize;
      //b.width *= worldScale;
      //b.height *= worldScale;
      game.world.setBounds(0, 0, b.width*worldScale, b.height*worldScale);
      //var oldCameraScale = game.camera.scale.clone();
      //var cameraScaleRatio = Phaser.Point.divide(game.camera.scale, oldCameraScale);
      //game.camera.focusOn(Phaser.Point.multiply(center, cameraScaleRatio));
    },

    render: function() {
      
      
      {
        var text = ' Wscale: '+Math.round(worldScale*100)/100+' Mscale: '+Math.round(menuScale*100)/100;
        this.game.debug.text(text, 2, 28, "#00ff00"); 
      }
      {
        var b = window.gamedata.mapsize;
        var text = 'Mwidth: '+Math.round(b.width*worldScale)+' Mheight: '+Math.round(b.height*worldScale);
        this.game.debug.text(text, 2, 40, "#00ff00");  
      }
      {
        var o = debugObj;
        if(o.scale){
          var text = 'debugObj: '+o.x+':'+o.y+` size: ${o.width}:${o.height} scale: ${o.scale.x}:${o.scale.y}`;
          this.game.debug.text(text, 2, 60, "#00ff00"); 
        }
      }

      if(GOptions.debug.main){
        var debug = this.game.debug;
        //this.loadRender();
        debug.text(game.time.fps || '--', 2, 14, "#00ff00");  
        debug.cameraInfo(game.camera, 20, 150);

        debug.inputInfo(20, 300, colors.lime);
        //debug.pointer(this.input.activePointer, colors.aqua);
        debug.device(420, 20, colors.aqua);
        //debug.phaser(10, 580, colors.gray);
        game.debug.body(window.gamedata.groupmap);
      }
    },

  }
});


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
  createGameObjects();
  createMapMenu();
}

function createGameObjects(){
  //game.camera.flash( '#ff0',300 );
  //clearMap();
  createMap();
  //game.camera.flash( '#ff0',300 );//[color] [, duration] [, force] [, alpha])
  
  var gd = window.gamedata;
  game.world.setBounds(0, 0, gd.mapsize.width, gd.mapsize.height);
  
  var focusbutton = gd.activeuser1btn; //кнопка текущего юзера
  game.camera.focusOn(focusbutton);
}


function setGameFullScreen() {
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
    //groupmap.scale.setGameSize(width, height);
  }else{
    var width = window.screen.width;
    var height = window.screen.height;
    console.log('переход в полноэкранный режим '+width+'x'+height);
    game.scale.setGameSize(width, height);
    resizeMenu(1);
    //groupmap.scale.setGameSize(width, height);
  }
}

