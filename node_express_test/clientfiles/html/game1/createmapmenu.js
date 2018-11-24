
function createMapMenu(){  
  //var maingamedata = window.gamedata;
  var group = window.gamedata.groupmenu;
  
  //const mapMenuClickTurn = 
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
    var msgText1 = game.add.text(0, -200, "-",style);
    msgText1.alpha = 0;
    group.add(msgText1);
    window.gamedata.menu.msgText1 = msgText1;

    var msgText2 = game.add.text(0, -200, "-",style);
    msgText2.alpha = 0;
    group.add(msgText2);
    window.gamedata.menu.msgText2 = msgText2;

    var msgText3 = game.add.text(0, -200, "-",style);
    msgText3.alpha = 0;
    group.add(msgText3);
    window.gamedata.menu.msgText3 = msgText3;
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

function gameUser1EndTurn(){
  var st = window.gamedata.status;
  if(st.turnuser!='user1') return gameUser1ShowAlertWait();
  if(st.turntype=='move') {
    gameUser1ShowAlertTurnTypeInc();
  }
}

function gameUser1ShowAlertWait(){
  gameShowMessageAlert(window.gamedata.menu.msgText1, 'жди своей очереди',1500,400);
}

function gameUser1ShowAlertTurnTypeInc(){
  var st = window.gamedata.status;
  gameShowMessageAlert(window.gamedata.menu.msgText1, 'ход завершен','#fff',0,1500,400);
  gameShowMessageAlert(window.gamedata.menu.msgText2, 'раздай +'+st.cntuser1+' силы','#11c9d7',800,1500,1500);
}

function gameShowMessageAlert(msgt,message,color,ms_wait,ms_show,ms_hide){
  if(ms_wait){
      setTimeout(() => {
        gameShowMessageAlert(msgt,message,color,ms_wait=0,ms_show,ms_hide);
      }, ms_wait);
      return;
  }

  if(msgt._idmsg){ // если уже выполняется какая то анимация по этой кнопке
    //останавливаем все анимации и возвращаем исходное состояние
    msgt._tweens.forEach(element => {
      element.stop(false);
    });
    msgt.alpha = 0;
    msgt.scale.x = 1;
    msgt.scale.y = 1; 
  }
  var idmsg = Math.random()*10000000+1;
  msgt._idmsg = idmsg;
  msgt._tweens = [];

  var menu = window.gamedata.menu;
  var cam = game.camera;
  //var msgt = window.gamedata.menu.msgText1;
  var textSize = round(menu.mainBtn.height)/1.2;
  var style = {
    font: "bold "+textSize+"px Verdana", 
    fill: color,//"#fff", 
    wordWrap: true, 
    wordWrapWidth: 5000, 
    boundsAlignH: "center", 
    boundsAlignV: "middle",
  };
  msgt.setText(message);
  msgt.setStyle(style, updateImmediately=1);
  
  msgt.fixedToCamera = false;
  msgt.x = cam.x+cam.width/2;
  msgt.y = cam.y+(cam.height - menu.settingsBtn.height)/1.5;
  msgt.setTextBounds(0, 0, 0, 0);
  //msgt.fixedToCamera = true;  //только с нефиксированной камерой можно двигать объекты!!!!


  var scaleMax = (cam.width-cam.width/10)/msgt.width;

  
  addTween(msgt, msgt, { x: msgt.x, y: cam.y+(cam.height - menu.settingsBtn.height - msgt.height) }, ms_show, ()=>{}); //перемещаем вниз
  
  addTween(msgt, msgt, { alpha:1 }, 100,()=>{});

  addTween(msgt, msgt.scale, { x:scaleMax, y:scaleMax }, ms_show*0.2, ()=>{
      addTween(msgt, msgt.scale, { x:scaleMax*0.92, y:scaleMax*0.92 }, ms_show*0.8, ()=>{
        addTween(msgt, msgt, { alpha: 0 }, ms_hide, ()=>{
          msgt.scale.x = 1;
          msgt.scale.y = 1;
          msgt._idmsg = 0;
        });
      });
  });

}

function addTween(msgt,toobj,to,time,fnc){
  var t = game.add.tween(toobj).to( to, time, Phaser.Easing.Linear.None, true);
  msgt._tweens.push(t);
  t.onComplete.add(fnc);
  return t;
}

function game_update_mapmenu(){

}
