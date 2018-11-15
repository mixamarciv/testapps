function createMapMenu(){
  //var maingamedata = window.gamedata;
  var group = window.gamedata.groupmenu;
  
  //goup.left = 0;
  //goup.top = 0;
  //goup.fixedToCamera = true;
  //group.fixedToCamera = true;
  group.y = game.camera.height - 100;

  //var cam = game.camera.height - 100;
  window.gamedata.menu.buttons = [];
  var btnWidth = 400;
  var btnHeight = 125;
  {
    var btn = null;
    if(GOptions.gameMenu.loadType==0){
      btn = game.add.button(100, 0, 'button',createGameObjects);
      group.add(btn);
    }else
    if(GOptions.gameMenu.loadType==1){
      btn = group.create(100, 0, 'button');
      btn.inputEnabled = true;
      btn.events.onInputDown.add(createGameObjects, btn);
    }
    //btn.fixedToCamera = true;
    //btn.tint = 0x00ff00;
    window.gamedata.menu.mainBtn = btn;
  }
  {
    var btn = null;
    if(GOptions.gameMenu.loadType==0){
      btn = game.add.button(100, 0, 'settings',setGameFullScreen);
      group.add(btn);
    }else
    if(GOptions.gameMenu.loadType==1){
      btn = group.create(100, 0, 'settings');
      btn.inputEnabled = true;
      btn.events.onInputDown.add(setGameFullScreen, btn);
    }
    //btn.fixedToCamera = true;
    //btn.tint = 0xff00ff;
    window.gamedata.menu.settingsBtn = btn;
  }
  {
    var style = {
      font: "bold 28px Arial", 
      fill: "#eee", 
      wordWrap: true, 
      wordWrapWidth: 1000, 
      //align: "center",
      boundsAlignH: "center", 
      boundsAlignV: "middle",
      //backgroundColor: "#ffff00" 
    };
    var t = game.add.text(100, 0, "завершить ход",style);
    //t.setTextBounds(0, 0, 200, 100);
    group.add(t);
    //t.fixedToCamera = true;
    window.gamedata.menu.mainText = t;
    window.gamedata.menu.mainTextStyle = style;
  }
  resizeMenu(1);
}

function resizeMenu(force) {
  if (!force) return;
  var group = window.gamedata.groupmenu;
  var menu = window.gamedata.menu;
  var cam = game.camera;
  var needHSize = cam.height * GOptions.gameMenu.screenHSize;  //нужный размер высоты меню в пикселях
  
  var btnWidth = 400;
  var btnHeight = 125;
  var btn2Size = 512;
  
  debugObj = menu.mainBtn;

  menu.settingsBtn.fixedToCamera = false;
  var scalest = Math.round(needHSize/btn2Size*100)/100;
  menu.settingsBtn.scale.x = scalest;
  menu.settingsBtn.scale.y = scalest;
  menu.settingsBtn.x = Math.round(cam.width - menu.settingsBtn.width);
  menu.settingsBtn.y = 0;
  debugObj = menu.settingsBtn;
  menu.settingsBtn.fixedToCamera = true;


  menu.mainBtn.fixedToCamera = false;
  var scalebh = Math.round(needHSize/btnHeight *100)/100;
  var scalebw = Math.round(Math.round(cam.width - menu.settingsBtn.width - 10)/btnWidth   *100)/100;
  menu.mainBtn.scale.setTo(scalebw, scalebh);
  menu.mainBtn.x = 0;
  menu.mainBtn.y = 0;
  menu.mainBtn.fixedToCamera = true;


  menu.mainText.fixedToCamera = false;
  var textSize = Math.round(menu.mainBtn.height/3);
  menu.mainTextStyle.font = "bold "+textSize+"px Arial"; 
  menu.mainTextStyle.wordWrapWidth = Math.round(menu.mainBtn.width/2); 
  menu.mainText.setStyle(menu.mainTextStyle,updateImmediately=1);
  menu.mainText.setTextBounds(0, 0, menu.mainBtn.width, menu.mainBtn.height);
  menu.mainText.x = 0;
  menu.mainText.y = 0;
  menu.mainText.fixedToCamera = true;


  console.log(`scale: ${scalebh}:${scalebw}  - ${scalest} `+menu.mainTextStyle.font);
  //устанавливаем позицию группы элементов меню на экране
  group.y = game.camera.height - menu.settingsBtn.height;
  //menu.settingsBtn.fixedToCamera = true;
}


function clickButton_TEST1(){
  menu.settingsBtn.fixedToCamera = false;
  menu.settingsBtn.x -= 10;
  menu.settingsBtn.fixedToCamera = true;
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

