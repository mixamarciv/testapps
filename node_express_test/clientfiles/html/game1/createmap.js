
function createMap(){
  let game = window.game;
  //game.add.image(100, 100, 'hex1');
  let scale = 0.9;
  let cntX = 5;
  let cntY = 10;

  let objSize = 128;
  window.gamedata.objSize = 128;
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
    x: offsetX + objSize*2, 
    y: offsetY + objSize*4 
  }

  window.gamedata.maphexbuttons = maphexbuttons;
  createuserobj();
}

function createHexButton(x,y,xpos,ypos,scale){
  var maingamedata = window.gamedata;

  const hs = window.GOptions.images.hexsprite.sprites;
  
  var hexbtn = game.add.button(xpos, ypos, 'hexsprite', hexClick,hs.neutral,hs.neutral,hs.neutral);

  hexbtn.scale.setTo(scale,scale);
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

  let hexButtonTextStyle = { 
    font: "bold 32px Arial", 
    fill: "#ffff22", 
    wordWrap: false, 
    wordWrapWidth: maingamedata.objSize, 
    //align: "center",
    boundsAlignH: "center", 
    boundsAlignV: "middle",
    //backgroundColor: "#ffff00" 
  };
  hexbtn.text = game.add.text(hexbtn.x, hexbtn.y,'*', hexButtonTextStyle);
  hexbtn.text.setTextBounds(-5, -5, maingamedata.objSize, maingamedata.objSize);


  const hs = window.GOptions.images.hexsprite.sprites;
  
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
    hexbtn.text.setText(gd.value);
    if(gd.owner==maingamedata.user1.id){
      hexbtn.text.setStyle(hexButtonTextStyle,updateImmediately=1);
    }
  }
  gd.getVal = ()=>{ return gd.value; }

  gd.setNeutral = function(){
    hexbtn.setFrames(hover=hs.neutral, deflt=hs.neutral, click=hs.neutral);
  }
  gd.setActiveUser1 = function(){
    hexbtn.setFrames(hover=hs.active1, deflt=hs.active1, click=hs.active1);
    gd.owner = maingamedata.user1.id;
    maingamedata.activeuser1btn = hexbtn;
  }
  gd.setOwnerUser1 = function(){
    hexbtn.setFrames(hover=hs.user1, deflt=hs.user1, click=hs.active1);
    gd.owner = maingamedata.user1.id;
  }
  gd.setActiveUser2 = function(){
    hexbtn.setFrames(hover=hs.active2, deflt=hs.active2, click=hs.active2);
    gd.owner = maingamedata.user2.id;
    window.gamedata.activeuser2btn = hexbtn;
  }
  gd.setOwnerUser2 = function(){
    hexbtn.setFrames(hover=hs.user2, deflt=hs.user2, click=hs.active2);
    gd.owner = maingamedata.user2.id;
  }

  //возвращает 1 если можно переместиться в соседнюю tobtn
  gd.canMoveTo = function(to){ 
    var f = gd;
    var t = to.gd;
    if(f.owner==t.owner){
      console.log('нельзя ходить по уже захваченным объектам');
      return 0;
    }
    let chet;
    let rzx = t.x - f.x;
    if(rzx<-1 || rzx>1){
      console.log('по оси X можем ходить только +/-1 ');
      return 0;  
    }
    let rzy = t.y - f.y;
    if(rzy<-2 || rzy>2){
      console.log('по оси Y если можем ходить только не более +/-2');
      return 0;  
    }
    if(rzx!=0 && (rzy<-1 || rzy>1)){
      console.log('по оси Y можем ходить не более +/-1 если по оси X +/-1');
      return 0;  
    }
    if(rzx!=0 && rzy==0){
      console.log('по оси X можем ходить только если по оси X +/-1');
      return 0;  
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
  var maingamedata = window.gamedata;
  var activeBtn = maingamedata.activeuser1btn;
  if(activeBtn==hexbtn){//если нажали итак активную кнопку
    console.log('нажали уже активную кнопку');
    return; 
  }

  if(hexbtn.gd.getOwner() == maingamedata.user1.id){  //если нажали на кнопку юзера1
    console.log('нажали на кнопку юзера1');
    if(hexbtn.gd.getVal()>1){
      console.log('там больше 1 - делаем её активной');
      hexbtn.gd.setActiveUser1();  //и если там больше 1 то делаем её активной
    }
    return;
  }

  if(activeBtn.gd.canMoveTo(hexbtn)==0){ //если не можем переместиться на эту кнопку из текущей
    console.log('не можем переместиться на эту кнопку из текущей');
    return;
  }

  let val = activeBtn.gd.getVal();
  if( val > 1 ){
    console.log('захватываем выбранный объект');
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
  btn.gd.setVal(9);
  btn.gd.setActiveUser1();
}

//random >=min && <max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

