function createTextMessages(){
  //var maingamedata = window.gamedata;
  var group = window.gamedata.groupmenu;


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

function gameMessageClears(msgt1,msgt2,msgt3){
  if(msgt1) gameMessageClear(msgt1);
  if(msgt2) gameMessageClear(msgt2);
  if(msgt3) gameMessageClear(msgt3);
}

function gameMessageClear(msgt){
  if(msgt._timeout){
    clearTimeout(msgt._timeout);
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
}

function gameMessageShow(msgt,message,color,ms_wait,ms_show,ms_hide){
  if(ms_wait){
      msgt._timeout = setTimeout(() => {
        gameMessageShow(msgt,message,color,ms_wait=0,ms_show,ms_hide);
      }, ms_wait);
      return;
  }
/*******
  if(msgt._idmsg){ // если уже выполняется какая то анимация по этой кнопке
    //останавливаем все анимации и возвращаем исходное состояние
    msgt._tweens.forEach(element => {
      element.stop(false);
    });
    msgt.alpha = 0;
    msgt.scale.x = 1;
    msgt.scale.y = 1; 
  }
********/
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
    wordWrapWidth: round(cam.width*0.95), 
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

  addTween(msgt, msgt.scale, { x:scaleMax*0.95, y:scaleMax*0.95 }, ms_show, ()=>{
      //addTween(msgt, msgt.scale, { x:scaleMax*0.92, y:scaleMax*0.92 }, ms_show*0.8, ()=>{
        addTween(msgt, msgt, { alpha: 0 }, ms_hide, ()=>{
          msgt.scale.x = 1;
          msgt.scale.y = 1;
          msgt._idmsg = 0;
        });
      //});
  });

}

function addTween(msgt,toobj,to,time,fnc){
  var t = game.add.tween(toobj).to( to, time, Phaser.Easing.Linear.None, true);
  msgt._tweens.push(t);
  t.onComplete.add(fnc);
  return t;
}

