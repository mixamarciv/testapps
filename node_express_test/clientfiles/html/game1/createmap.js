
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
  console.log('offsetX: '+offsetX);
  window.gamedata.maphexbuttons = maphexbuttons;
  createuserobj();
}

function createHexButton(x,y,xpos,ypos,scale){
  let hexButtonTextStyle = { 
    font: "32px Arial", 
    fill: "#ffff22", 
    wordWrap: false, 
    wordWrapWidth: window.gamedata.objSize, 
    align: "center"
    //backgroundColor: "#ffff00" 
  };
  
  var hexbutton = game.add.button(xpos, ypos, 'hexsprite', hexClick, 4,2,2);

  hexbutton.scale.setTo(scale,scale);
  hexbutton.text = game.add.text(hexbutton.x, hexbutton.y, x+':'+y, hexButtonTextStyle);
  hexbutton.text.anchor.set(-0.8,-1);
  
  hexbutton.gd = {
    x: x,
    y: y,
    value: 0, // значение силы по умолчанию
    owner: 0, // владелец по умолчанию
  };
  
  hexbutton.gd_value = function(val){
    if(val===undefined){
      return this.gd.value;
    }
    this.gd.value = val;
    this.text.setText(val);
  }
  
  return hexbutton;
}

function hexClick(hexbtn){
  //hexbtn.inputEnabled = false;
  hexbtn.setFrames(4, 3, 3);
}

//создаем пользовательские объекты:
function createuserobj(){
  var btns = window.gamedata.maphexbuttons;
  var gd = window.gamedata;

  //задаем случайные позиции объекта
  var pos = {x:getRandomInt(0,gd.cntX),y:getRandomInt(0,gd.cntY)}
  console.log(pos);
  var userbtn = btns[pos.x][pos.y];
  userbtn.setFrames(1, 2, 2);
  userbtn.gd_value(9);
  window.currentbtn = userbtn;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//устанавливаем кнопку пользователя
function setUserBtn(btn){

}
