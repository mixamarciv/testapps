//var game = window.game;
//var maingamedata = window.gamedata;

function createMap(){
  var start_load = new Date();
  let game = window.game;
  const GOptions = window.GOptions;
  //game.add.image(100, 100, 'hex1');
  let scale = 1;
  let cntX = GOptions.gameMap.cntX;
  let cntY = GOptions.gameMap.cntY;

  let objSize = window.GOptions.images.hexsprite.size;
  window.gamedata.objSize = objSize;
  window.gamedata.cntX = cntX;
  window.gamedata.cntY = cntY;

  let objOffsetX = objSize; 
  let objOffsetY = objSize/2; 
  
  let offsetXstart = objSize;
  let offsetYstart = objSize;

  let offsetX = offsetXstart;
  let offsetY = offsetYstart;
  //offsetX += 96;
  //offsetY += 64;
  var maphexbuttons = [];

  /*****************  v2: */
  for(let iy=0;iy<cntY;iy++){
    offsetX = offsetXstart;
    if(iy%2==0) offsetX += objSize*3/4;
    offsetY += objSize/2;
    for(let ix=0;ix<cntX;ix++){
      var hexbutton = createHexButton(ix,iy,offsetX,offsetY,scale);
      offsetX += objSize*1.5;
      if(!maphexbuttons[ix]) maphexbuttons[ix] = [];
      maphexbuttons[ix][iy] = hexbutton;
    }
  }
  /**********************/
  window.gamedata.mapsize = { 
    width: offsetX + objSize*2, 
    height: offsetY + objSize*4 
  }


  /*********
  { // пытались создать полигон
    var poly = new Phaser.Polygon([ 
      new Phaser.Point(200, 100), 
      new Phaser.Point(350, 100), 
      new Phaser.Point(375, 200), 
      new Phaser.Point(150, 200) ]);

    var graphics = game.add.graphics(0, 0);

    graphics.beginFill(0xFF33ff);
    graphics.drawPolygon(poly.points);
    graphics.endFill();

    graphics.inputEnabled = true;
    graphics.events.onInputDown.add(clickPolygon, graphics);
    
    window.gamedata.groupmap.add(graphics);
  }
  ******/


  window.gamedata.maphexbuttons = maphexbuttons;
  window.gamedata.time.createMap = time_long_str(start_load);
  createuserobj();
}

function clickPolygon(poly){

}


function clearMap(){
  const debug = window.GOptions.debug;
  var mapObjects = window.gamedata.mapObjects;

  {
    var cnt = 0;
    for(let i=0;i<mapObjects.buttons.length;i++){
      var o = mapObjects.buttons[i];
      var id = o._id;
      o.destroy();
      cnt++;

      var t = mapObjects.text[id];
      if(t){
        t.destroy();
        cnt++;
      }

      mapObjects.gd[id] = null;
    }
    mapObjects.buttons = [];
    mapObjects.text = [];
    mapObjects.gd = [];
    if(debug.showClearMapInfo) console.log('удалено объектов: '+cnt);
  }
}


function createHexButton(x,y,xpos,ypos,scale){
  var mapObjects = window.gamedata.mapObjects;
  const GOptions = window.GOptions;
  const hs = GOptions.images.hexsprite.sprites;

  var hexbtn = null
  
  if(GOptions.gameMap.loadType==0){
    hexbtn = game.add.button(xpos, ypos, 'hexsprite', hexClick,hs.neutral,hs.neutral,hs.neutral);
    window.gamedata.groupmap.add(hexbtn);
  }else
  if(GOptions.gameMap.loadType==1){
    hexbtn = window.gamedata.groupmap.create(xpos, ypos, 'hexsprite');
    //gem.name = 'gem' + i.toString() + 'x' + j.toString();
    hexbtn.inputEnabled = true;
    hexbtn.events.onInputDown.add(hexClick, hexbtn);
    hexbtn.frame = hs.neutral;
  }else
  if(GOptions.gameMap.loadType==2){
    hexbtn = window.gamedata.groupmap.create(xpos, ypos, 'hexsprite');
    //gem.name = 'gem' + i.toString() + 'x' + j.toString();
    hexbtn.inputEnabled = true;
    hexbtn.events.onInputDown.add(hexClick, hexbtn);
    hexbtn.frame = hs.neutral;
  }
  


  mapObjects.buttons.push(hexbtn);
  var id =  mapObjects.buttons.length;

  hexbtn._id = id;
  
  var text = null;
  if(GOptions.gameMap.loadType!=2){
    var fontSize = Math.round(window.gamedata.objSize / 2);
    let hexButtonTextStyle = { 
      font: "bold "+fontSize+"px Arial", 
      fill: "#ccc",
      boundsAlignH: "center", 
      boundsAlignV: "middle",
    };
    text = game.add.text(hexbtn.x, hexbtn.y,'*', hexButtonTextStyle);
    window.gamedata.groupmap.add(text);
    text.setTextBounds(0, 0, window.gamedata.objSize, window.gamedata.objSize+window.gamedata.objSize/5);
    mapObjects.text[id] = text;
  }

  var gd = {
    id: id,
    bntobj: hexbtn,
    textobj: text,
    x: x,
    y: y,
    value: 0, // значение силы по умолчанию 0 - нельзя ходить
    owner: 0, // владелец по умолчанию
  };
  mapObjects.gd[id] = gd;
  
  gd_setVal(gd,0);

  return hexbtn;
}

function gd_setVal(gd,val){
    gd.value = val;
    if(GOptions.gameMap.loadType==2){
      const hs = GOptions.images.hexsprite.sprites;
      if(val==0){
        gd.bntobj.frame = hs.neutral;
        gd.bntobj.visible = false;
        gd.bntobj.alpha = 0;
        return;
        //game.add.tween(gd.bntobj).to( { alpha: 1 }, 1, Phaser.Easing.Linear.None, true);
      }
      gd.bntobj.visible = true;
      var frame = hs.neutral;
      if(gd.owner==window.gamedata.user1.id) frame = hs.user1;
      else if(gd.owner==window.gamedata.user2.id) frame = hs.user2;
      frame = frame*20 + val-1;
      //console.log('SET FRAME '+gd.bntobj.frame+'->'+frame);
      gd.bntobj.frame = frame;
      return;
    }
    let showValue = val;
    if(GOptions.debug.showHexInfo){
      showValue += `[${gd.x}:${gd.y}]`;
    }
    gd.textobj.setText(showValue);
    if(gd.owner==window.gamedata.user1.id){
      gd.textobj.addColor('#aeaeff', 0);
    }
}

function gd_getVal(gd){ return gd.value; }

function gd_setNeutral(gd){
  if(GOptions.gameMap.loadType==2) return gd_setVal(gd,gd.value);
  const hs = GOptions.images.hexsprite.sprites;
  var hexbtn = gd.bntobj;
    if(GOptions.gameMap.loadType==0){
      hexbtn.setFrames(hover=hs.neutral, deflt=hs.neutral, click=hs.neutral);
    }else
    if(GOptions.gameMap.loadType==1){
      hexbtn.frame = hs.neutral;
    }
}

function gd_setActiveUser1(gd){
  gd.owner = window.gamedata.user1.id;
  window.gamedata.activeuser1btn = gd.bntobj;
  if(GOptions.gameMap.loadType==2) return gd_setVal(gd,gd.value);
  const hs = GOptions.images.hexsprite.sprites;
  var hexbtn = gd.bntobj;
    if(GOptions.gameMap.loadType==0){
      hexbtn.setFrames(hover=hs.active1, deflt=hs.active1, click=hs.active1);
    }else
    if(GOptions.gameMap.loadType==1){
      hexbtn.frame = hs.active1;
    }
}

function gd_setOwnerUser1(gd){
  gd.owner = window.gamedata.user1.id;
  const hs = GOptions.images.hexsprite.sprites;
  if(GOptions.gameMap.loadType==2) return gd_setVal(gd,gd.value);
  var hexbtn = gd.bntobj;
    if(GOptions.gameMap.loadType==0){
      hexbtn.setFrames(hover=hs.user1, deflt=hs.user1, click=hs.user1);
    }else
    if(GOptions.gameMap.loadType==1){
      hexbtn.frame = hs.user1;
    }
}

function gd_setActiveUser2(gd){
  gd.owner = window.gamedata.user2.id;
  window.gamedata.activeuser2btn = gd.bntobj;
  if(GOptions.gameMap.loadType==2) return gd_setVal(gd,gd.value);
  const hs = GOptions.images.hexsprite.sprites;
  var hexbtn = gd.bntobj;
    if(GOptions.gameMap.loadType==0){
      hexbtn.setFrames(hover=hs.active2, deflt=hs.active2, click=hs.active2);
    }else
    if(GOptions.gameMap.loadType==1){
      hexbtn.frame = hs.active2;
    }
}

function gd_setOwnerUser2(gd){
  gd.owner = window.gamedata.user2.id;
  if(GOptions.gameMap.loadType==2) return gd_setVal(gd,gd.value);
  const hs = GOptions.images.hexsprite.sprites;
  var hexbtn = gd.bntobj;
    if(GOptions.gameMap.loadType==0){
      hexbtn.setFrames(hover=hs.user2, deflt=hs.user2, click=hs.user2);
    }else
    if(GOptions.gameMap.loadType==1){
      hexbtn.frame = hs.user2;
    }
}

  //возвращает 1 если можно переместиться в соседнюю tobtn
function gd_canMoveTo(gd,togd){ 
    var f = gd;
    //var id = toBtn._id;
    //var t = window.gamedata.mapObjects.gd[id];
    var t = togd;
    if(f.owner==t.owner){
      if(GOptions.debug.userMoveHex) console.log('нельзя ходить по уже захваченным объектам');
      return 0;
    }
    
    let rzx = t.x - f.x;
    let rzy = t.y - f.y;
    let nechetY = f.y%2;

    if(GOptions.debug.userMoveHex) console.log(`проверка хода ${f.x}:${f.y}(${nechetY}) -> ${t.x}:${t.y} rzx:${rzx}, rzy:${rzy}`);
    
    if(!nechetY) {
      if(rzx!=0){
        if(rzx<0  || rzx>1) return 0;
        if(rzy<-1 || rzy>1 || rzy==0) return 0;
        return 1;
      }
      if(rzx==0){
        if(rzy<-2  || rzy>2) return 0;
        return 1;
      }
    }
    if(nechetY) {
      if(rzx!=0){
        if(rzx>0  || rzx<-1) return 0;
        if(rzy<-1 || rzy>1 || rzy==0) return 0;
        return 1;
      }
      if(rzx==0){
        if(rzy<-2  || rzy>2) return 0;
        return 1;
      }
    }
    
    return 1;
}

function gd_moveUser1(gd,togd){ 
  //var id = toBtn._id;
  //var togd = window.gamedata.mapObjects.gd[id];
    let val1 = togd.value;
    let val2 = gd.value;

    //gd.value = 1;
    gd_setVal(gd,1);

    if( val1 > val2 ){
      //gd_setVal(gd,1);
      gd_setVal(togd, val1 - val2);
      return;
    }

    if( val1 < val2 ){
      togd.value = val2 - val1;
      //gd_setVal(gd,1);
      gd_setOwnerUser1(gd);
      gd_setActiveUser1(togd);
      return;
    }

    if( val1 == val2 ){
      //gd_setVal(gd,1);
      gd_setVal(togd,1);
      return;
    }
}



function hexClick(hexbtn){
  const debug = window.GOptions.debug;

  if(window.gamedata.activeuser1btn==hexbtn){ //если нажали итак активную кнопку
    if(debug.userMoveHex) console.log('нажали уже активную кнопку');
    return; 
  }

  var id = hexbtn._id;
  var gd = window.gamedata.mapObjects.gd[id];
  //console.log('id: '+id);
  //console.log(gd);

  if(gd.owner == window.gamedata.user1.id){  //если нажали на кнопку юзера1
    if(debug.userMoveHex) console.log('нажали на кнопку юзера1');
    if(gd.value>1){
      if(debug.userMoveHex) console.log('там больше 1 - делаем её активной');
      gd_setActiveUser1(gd);  //и если там больше 1 то делаем её активной
    }
    return;
  }

  var activebtnId = window.gamedata.activeuser1btn._id;
  var agd = window.gamedata.mapObjects.gd[activebtnId];
  //console.log('active id: '+activebtnId);
  //console.log(agd);

  if(gd_canMoveTo(agd,gd)==0){ //если не можем переместиться на эту кнопку из текущей
    if(debug.userMoveHex) console.log('не можем переместиться на эту кнопку из текущей');
    return;
  }

  let val = agd.value;
  if( val > 1 ){
    if(debug.userMoveHex) {
      console.log('захватываем выбранный объект ['+agd.x+':'+agd.y+' -> '+gd.x+':'+gd.y+']');
    } 
    gd_moveUser1(agd,gd);
  }
}


function get_gd(id){
  return window.gamedata.mapObjects.gd[id];
}

function get_gdpos(x,y){
  var btn = window.gamedata.maphexbuttons[x][y];
  var gd = get_gd(btn._id);
  return gd;
}

//создаем пользовательские объекты:
function createuserobj(){
  const map = GOptions.gameMap;
  var btns = window.gamedata.maphexbuttons;

  //задаем случайные позиции игроков
  var posU1 = {x:getRandomInt(0,map.cntX),y:getRandomInt(0,map.cntY)}
  //console.log('posU1: ',posU1);
  var btn1 = btns[posU1.x][posU1.y];
  var gd1 = get_gd(btn1._id);
  //console.log('user1: ',gd1);
  gd_setVal(gd1,20);
  gd_setActiveUser1(gd1);

  var posU2 = { x: map.cntX-posU1.x-1, y: map.cntY-posU1.y-1}
  //console.log('posU2: ',posU2);
  var btn2 = btns[posU2.x][posU2.y];
  var gd2 = get_gd(btn2._id);
  //console.log('user2: ',gd2);
  gd_setVal(gd2,20);
  gd_setActiveUser2(gd2);


  //задаем значения клеток
  
  //gd_setVal(gd,rnd);
  var cntx2 = map.cntX/2;
  var cnty2 = map.cntY/2;
  for(let i=0;i<cntx2;i++){
    for(let j=0;j<cnty2;j++){
     
      var gd1 = get_gdpos(cntx2+i,cnty2+j);
      var gd2 = get_gdpos(cntx2-i-1,cnty2-j-1);

      var gd3 = get_gdpos(cntx2-i-1,cnty2+j);
      var gd4 = get_gdpos(cntx2+i,cnty2-j-1);
      
      game.add.tween(gd1.bntobj).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
      game.add.tween(gd2.bntobj).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);

      game.add.tween(gd3.bntobj).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
      game.add.tween(gd4.bntobj).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);

      if(gd1.owner==0 && gd2.owner==0){
        var rnd1 = getRandomInt(0, 9);
        gd_setVal(gd1,rnd1);
        gd_setVal(gd2,rnd1);
      }

      if(gd3.owner==0 && gd4.owner==0){
        var rnd2 = getRandomInt(0, 20);
        gd_setVal(gd3,rnd2);
        gd_setVal(gd4,rnd2);
      }
    }
  }

}


