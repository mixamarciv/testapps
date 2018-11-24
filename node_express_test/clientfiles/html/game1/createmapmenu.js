
function createMapMenu(){  
  //var maingamedata = window.gamedata;
  var group = window.gamedata.groupmenu;
  
  //var cam = game.camera.height - 100;
  window.gamedata.menu.buttons = [];
  var btnWidth = 400;
  var btnHeight = 125;
  {
    var clickFnc = function(){};
    var btn = null;
    if(GOptions.gameMenu.loadType==0){
      btn = game.add.button(100, 0, 'button',clickFnc);
      group.add(btn);
    }else
    if(GOptions.gameMenu.loadType==1){
      btn = group.create(100, 0, 'button');
      btn.inputEnabled = true;
      btn.events.onInputDown.add(clickFnc, btn);
    }
    //btn.fixedToCamera = true;
    //btn.tint = 0x00ff00;
    window.gamedata.menu.mainBtn = btn;
  }
  {
    var clickFnc = function(){};
    var btn = null;
    if(GOptions.gameMenu.loadType==0){
      btn = game.add.button(100, 0, 'settings',clickFnc);
      group.add(btn);
    }else
    if(GOptions.gameMenu.loadType==1){
      btn = group.create(100, 0, 'settings');
      btn.inputEnabled = true;
      btn.events.onInputDown.add(clickFnc, btn);
    }
    //btn.fixedToCamera = true;
    //btn.tint = 0xff00ff;
    window.gamedata.menu.settingsBtn = btn;
  }
  {
    var style = {
      font: "bold 28px Verdana", 
      fill: "#eee", 
      wordWrap: true, 
      wordWrapWidth: 5000, 
      //align: "center",
      boundsAlignH: "center", 
      boundsAlignV: "middle",
      //backgroundColor: "#ffff00" 
    };
    var maintext = game.add.text(100, 0, "завершить ход",style);
    group.add(maintext);

    var statustext = game.add.text(100, 0, "+1 : +1",style);
    group.add(statustext);

    //t.fixedToCamera = true;
    window.gamedata.menu.mainText = maintext;
    window.gamedata.menu.mainTextStyle = style;
    window.gamedata.menu.statusText = statustext;
  }

  {//блок для вывода разных сообщений
    createTextMessages();
  }
  resizeMenu(1);
}

function mapMenuClickSettings(){
  setGameFullScreen();
}

function mapMenuClickTurn(){
  //createGameObjects();
  gameUser1EndTurn();
}


function resizeMenu(force) {
  if (!force) return;
  var group = window.gamedata.groupmenu;
  var menu = window.gamedata.menu;
  var cam = game.camera;
  var needHSize = cam.height * GOptions.gameMenu.screenHSize;  //нужный размер высоты меню в пикселях
  
  var btnWidth = 400;
  var btnHeight = 125;
  var btn2Size = 125;
  

  menu.settingsBtn.fixedToCamera = false;
  var scalest = Math.round(needHSize/btn2Size*100)/100;
  menu.settingsBtn.scale.x = scalest;
  menu.settingsBtn.scale.y = scalest;
  menu.settingsBtn.x = Math.round(cam.width - menu.settingsBtn.width);
  menu.settingsBtn.y = cam.height - menu.settingsBtn.height;
  menu.settingsBtn.fixedToCamera = true;
  menu.settingsBtn.tint = 0xcccccc;


  menu.mainBtn.fixedToCamera = false;
  var scalebh = Math.round(needHSize/btnHeight *100)/100;
  var scalebw = Math.round(Math.round(cam.width - menu.settingsBtn.width - 10)/btnWidth   *100)/100;
  menu.mainBtn.scale.setTo(scalebw, scalebh);
  menu.mainBtn.x = 0;
  menu.mainBtn.y = cam.height - menu.settingsBtn.height;
  menu.mainBtn.fixedToCamera = true;


  var textSize = Math.round(menu.mainBtn.height/3);
  menu.mainText.fixedToCamera = false;
  menu.mainTextStyle.font = "bold "+textSize+"px Arial"; 
  menu.mainTextStyle.wordWrapWidth = Math.round(menu.mainBtn.width*0.95); 
  menu.mainText.setStyle(menu.mainTextStyle, updateImmediately=1);
  menu.mainText.setTextBounds(0, 0, menu.mainBtn.width, menu.mainBtn.height);
  menu.mainText.x = 0;
  menu.mainText.y = cam.height - menu.settingsBtn.height;
  menu.mainText.fixedToCamera = true;


  menu.statusText.fixedToCamera = false;
  //menu.statusText.setTextBounds(0, 0, menu.statusText.width, menu.statusText.height);
  menu.statusText.x = cam.width - menu.statusText.width - 10;
  menu.statusText.y = 10;
  menu.statusText.fixedToCamera = true;


  
  //console.log(`needHSize ${needHSize}; scale: ${scalebh}:${scalebw}  - ${scalest} `+menu.mainTextStyle.font);
  //устанавливаем позицию группы элементов меню на экране
  //group.y = game.camera.height - menu.settingsBtn.height;
  group.y = 0;
}


function update_status(){
  var stText = window.gamedata.menu.statusText;
  if(!stText) return;
  var st = window.gamedata.status;
  var text = '+'+st.cntuser1+' : +'+st.cntuser2;

  stText.setText(text);
  stText.fixedToCamera = false;
  stText.x = game.camera.width - stText.width - 10;
  stText.y = 10;
  stText.fixedToCamera = true;
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

function mapMenuClick(x,y){ // обработка нажатий меню
  //срабатывает на события во время/вместо перемещения по карте в moveCursor
  // когда пользователь нажимает ниже cam.height - cam.height * GOptions.gameMenu.screenHSize
  var menu = window.gamedata.menu;

  if(x < menu.mainBtn.width) {
    return mapMenuClickTurn();
  }
  console.log(x +' > '+ menu.settingsBtn.x);
  if(x > menu.mainBtn.width) {
    return mapMenuClickSettings();
  }
  
}

//пользователь завершает ход 
function gameUser1EndTurn(){
  var st = window.gamedata.status;
  if(st.turnuser!='user1') return gameUser1ShowAlertWait(); // если сейчас ходит не наш игрок
  if(st.turntype=='move') { // если пользователь ходил 
    st.turntype='inc';
    gameUser1ShowTurnChangeToInc();
    return;
  }

}

function gameUser1ShowAlertWait(){
  gameMessageShow(window.gamedata.menu.msgText1, 'жди своей очереди','#fff',1500,400);
}

function gameUser1ShowTurnChangeToInc(){
  var mainText = window.gamedata.menu.mainText;
  var mainBtn = window.gamedata.menu.mainBtn;
  var st = window.gamedata.status;
  mainText.setText('раздай силы +'+st.cntuser1);
  mainBtn.tint = 0x0fff0f;

  //выводим сообщение:
  gameMessageClears(window.gamedata.menu.msgText1, window.gamedata.menu.msgText2);
  gameMessageShow(window.gamedata.menu.msgText1, 'ход завершен','#fff',0,1500,400);
  gameMessageShow(window.gamedata.menu.msgText2, 'раздай +'+st.cntuser1+' силы','#11c9d7',800,1500,1500);
}

