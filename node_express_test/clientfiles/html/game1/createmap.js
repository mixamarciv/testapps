
function createMap(){
  let game = window.game;
  //game.add.image(100, 100, 'hex1');
  let scale = 0.9;
  let cntX = 10;
  let cntY = 10;

  let objSize = 128;

  let objOffsetX = objSize; 
  let objOffsetY = objSize/2; 
  
  let offsetXstart = objSize;
  let offsetYstart = objSize;

  let offsetX = offsetXstart;
  let offsetY = offsetYstart;
  //offsetX += 96;
  //offsetY += 64;
  var maphexbuttons = [];

  var textstyle = { 
    font: "32px Arial", 
    fill: "#ffff22", 
    wordWrap: false, 
    wordWrapWidth: objSize, 
    align: "center", 
    //backgroundColor: "#ffff00" 
  };

  /*****************  v2: */
  for(let iy=0;iy<cntY;iy++){
    offsetX = offsetXstart;
    if(iy%2==0) offsetX += objSize*3/4;
    offsetY += objSize/2;
    maphexbuttons[iy] = [];
    for(let ix=0;ix<cntX;ix++){
      
      //offsetY += objOffsetY;
      //frames in this order: over, out, down
      var hexbutton = game.add.button(offsetX, offsetY, 'hexsprite', hexClick, 4,2,2);
      offsetX += objSize*1.5;
      //hexbutton.anchor.setTo(0, 0);
      hexbutton.scale.setTo(scale,scale);
      maphexbuttons[iy][ix] = hexbutton;
      hexbutton.gd = {x: ix, y: iy};
      hexbutton.text = game.add.text(hexbutton.x, hexbutton.y, ix+':'+iy, textstyle);
      hexbutton.text.anchor.set(-0.8,-1);
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

function hexClick(hexbtn){
  //hexbtn.inputEnabled = false;
  hexbtn.setFrames(4, 3, 3);
}

function createuserobj(){
  var btns = window.gamedata.maphexbuttons;
}
