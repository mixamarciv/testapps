//var game = window.game;
//var maingamedata = window.gamedata;

function createMap(){
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

  window.gamedata.maphexbuttons = maphexbuttons;
  createuserobj();
}

function clearMap(){
  const debug = window.GOptions.debug;
  var mapObjects = window.gamedata.mapObjects;

  {
    var cnt = 0;
    var buttons = mapObjects.buttons;
    for(let i=0;i<buttons.length;i++){
      var o = buttons[i];
      o.gd = null;
      o.destroy();
      cnt++;
    }
    mapObjects.buttons = [];
    if(debug.showClearMapInfo) console.log('удалено хексов: '+cnt);
  }
  {
    var cnt = 0;
    var text = mapObjects.text;
    for(let i=0;i<text.length;i++){
      var o = text[i];
      o.destroy();
      cnt++;
    }
    mapObjects.text = [];
    if(debug.showClearMapInfo) console.log('удалено текстовых блоков: '+cnt);
  }

}

function createHexButton(x,y,xpos,ypos,scale){
  var maingamedata = window.gamedata;
  var mapObjects = window.gamedata.mapObjects;
  const GOptions = window.GOptions;
  const hs = GOptions.images.hexsprite.sprites;
  const debug = GOptions.debug;

  var hexbtn = null
  
  if(GOptions.gameMap.loadType==0){
    hexbtn = game.add.button(xpos, ypos, 'hexsprite', hexClick,hs.neutral,hs.neutral,hs.neutral);
    maingamedata.groupmap.add(hexbtn);
  }else
  if(GOptions.gameMap.loadType==1){

    var hexbtn = maingamedata.groupmap.create(xpos, ypos, 'hexsprite');
    //gem.name = 'gem' + i.toString() + 'x' + j.toString();
    hexbtn.inputEnabled = true;
    hexbtn.events.onInputDown.add(hexClick, hexbtn);
    hexbtn.frame = hs.neutral;
  }

  mapObjects.buttons.push(hexbtn);
  //hexbtn.scale.setTo(scale,scale);
  var hexButtonTextStyle = {};
  //hexbtn.text.anchor.set(1);
  
  hexbtn.gd = new makeHexObjectData(hexbtn,x,y);

  var rnd = getRandomInt(1, 3);
  hexbtn.gd.setVal(rnd);

  return hexbtn;
}

function makeHexObjectData(hexbtn,x,y){
  let game = window.game;
  var maingamedata = window.gamedata;
  var mapObjects = window.gamedata.mapObjects;
  const GOptions = window.GOptions;
  const hs = GOptions.images.hexsprite.sprites;
  const debug = GOptions.debug;

  let hexButtonTextStyle = { 
    font: "bold 28px Arial", 
    fill: "#bbb", 
    wordWrap: false, 
    wordWrapWidth: maingamedata.objSize, 
    //align: "center",
    boundsAlignH: "center", 
    boundsAlignV: "middle",
    //backgroundColor: "#ffff00" 
  };
  hexbtn.text = game.add.text(hexbtn.x, hexbtn.y,'*', hexButtonTextStyle);
  maingamedata.groupmap.add(hexbtn.text);
  hexbtn.text.setTextBounds(0, 0, maingamedata.objSize-2, maingamedata.objSize+2);
  mapObjects.text.push(hexbtn.text);
  
  var gd = {
    bntobj: hexbtn,
    x: x,
    y: y,
    value: 1, // значение силы по умолчанию
    owner: 0, // владелец по умолчанию
  };
  gd.getOwner = ()=>{ 
    return gd.owner; 
  }
  gd.setVal = function(val){
    gd.value = val;
    let showValue = val;
    if(debug.showHexInfo){
      showValue += `[${gd.x}:${gd.y}]`;
    }
    hexbtn.text.setText(showValue);
    if(gd.owner==maingamedata.user1.id){
      hexButtonTextStyle.fill = '#aeaeff';
      //hexbtn.text.setStyle(hexButtonTextStyle,updateImmediately=0);
      hexbtn.text.addColor(hexButtonTextStyle.fill, 0);
    }
  }
  gd.getVal = ()=>{ return gd.value; }

  gd.setNeutral = function(){
    if(GOptions.gameMap.loadType==0){
      hexbtn.setFrames(hover=hs.neutral, deflt=hs.neutral, click=hs.neutral);
    }else
    if(GOptions.gameMap.loadType==1){
      hexbtn.frame = hs.neutral;
    }
  }
  gd.setActiveUser1 = function(){
    if(GOptions.gameMap.loadType==0){
      hexbtn.setFrames(hover=hs.active1, deflt=hs.active1, click=hs.active1);
    }else
    if(GOptions.gameMap.loadType==1){
      hexbtn.frame = hs.active1;
    }
    gd.owner = maingamedata.user1.id;
    maingamedata.activeuser1btn = hexbtn;
  }
  gd.setOwnerUser1 = function(){
    if(GOptions.gameMap.loadType==0){
      hexbtn.setFrames(hover=hs.user1, deflt=hs.user1, click=hs.user1);
    }else
    if(GOptions.gameMap.loadType==1){
      hexbtn.frame = hs.user1;
    }
    gd.owner = maingamedata.user1.id;
  }
  gd.setActiveUser2 = function(){
    if(GOptions.gameMap.loadType==0){
      hexbtn.setFrames(hover=hs.active2, deflt=hs.active2, click=hs.active2);
    }else
    if(GOptions.gameMap.loadType==1){
      hexbtn.frame = hs.active2;
    }
    gd.owner = maingamedata.user2.id;
    window.gamedata.activeuser2btn = hexbtn;
  }
  gd.setOwnerUser2 = function(){
    if(GOptions.gameMap.loadType==0){
      hexbtn.setFrames(hover=hs.user2, deflt=hs.user2, click=hs.user2);
    }else
    if(GOptions.gameMap.loadType==1){
      hexbtn.frame = hs.user2;
    }
    gd.owner = maingamedata.user2.id;
  }

  //возвращает 1 если можно переместиться в соседнюю tobtn
  gd.canMoveTo = function(to){ 
    var f = gd;
    var t = to.gd;
    if(f.owner==t.owner){
      if(debug.userMoveHex) console.log('нельзя ходить по уже захваченным объектам');
      return 0;
    }
    
    let rzx = t.x - f.x;
    let rzy = t.y - f.y;
    let nechetY = f.y%2;

    if(debug.userMoveHex) console.log(`проверка хода ${f.x}:${f.y}(${nechetY}) -> ${t.x}:${t.y} rzx:${rzx}, rzy:${rzy}`);
    
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

  gd.moveUser1 = function(to){ 
    let val1 = to.gd.getVal();
    let val2 = gd.getVal();

    hexbtn.gd.setVal(1);

    if( val1 > val2 ){
      to.gd.setVal(val1 - val2);
      return;
    }

    if( val1 < val2 ){
      to.gd.setVal(val2 - val1);
      gd.setOwnerUser1();
      to.gd.setActiveUser1();
      return;
    }

    if( val1 == val2 ){
      to.gd.setVal(1);
      return;
    }
  }
  return gd;
}

function hexClick(hexbtn){
  const GOptions = window.GOptions;
  const debug = GOptions.debug;
  var maingamedata = window.gamedata;
  var activeBtn = maingamedata.activeuser1btn;

  if(activeBtn==hexbtn){ //если нажали итак активную кнопку
    if(debug.userMoveHex) console.log('нажали уже активную кнопку');
    return; 
  }

  if(hexbtn.gd.getOwner() == maingamedata.user1.id){  //если нажали на кнопку юзера1
    if(debug.userMoveHex) console.log('нажали на кнопку юзера1');
    if(hexbtn.gd.getVal()>1){
      if(debug.userMoveHex) console.log('там больше 1 - делаем её активной');
      hexbtn.gd.setActiveUser1();  //и если там больше 1 то делаем её активной
    }
    return;
  }

  if(activeBtn.gd.canMoveTo(hexbtn)==0){ //если не можем переместиться на эту кнопку из текущей
    if(debug.userMoveHex) console.log('не можем переместиться на эту кнопку из текущей');
    return;
  }

  let val = activeBtn.gd.getVal();
  if( val > 1 ){
    if(debug.userMoveHex) {
      console.log('захватываем выбранный объект ['+activeBtn.gd.x+':'+activeBtn.gd.y+' -> '+hexbtn.gd.x+':'+hexbtn.gd.y+']');
    } 
    activeBtn.gd.moveUser1(hexbtn);
  }
}


//создаем пользовательские объекты:
function createuserobj(){
  var gd = window.gamedata;
  var btns = gd.maphexbuttons;


  //задаем случайные позиции объекта
  var pos = {x:getRandomInt(0,gd.cntX),y:getRandomInt(0,gd.cntY)}
  console.log(pos);
  var btn = btns[pos.x][pos.y];
  btn.gd.setVal(12);
  btn.gd.setActiveUser1();
}

//random >=min && <max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

