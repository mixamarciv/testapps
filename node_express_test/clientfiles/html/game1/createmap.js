
function createMap(){
  let game = window.game;
  //game.add.image(100, 100, 'hex1');
  let scale = 0.9;
  let cntX = 20;
  let cntY = 40;

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

  for(let iy=0;iy<cntY;iy++){
    offsetX = offsetXstart;
    if(iy%2==0) offsetX += objSize*3/4;
    offsetY += objSize / 2;
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
    }
  }
  /********
  for(let ix=0;ix<cntX;ix++){
    //offsetX = offsetXstart + (ix-1)*objOffsetX;
    //offsetY = offsetYstart - (ix+2)*objOffsetY;
    if(ix%2==0){
        offsetX = 0;
    }else{
        offsetX = offsetXstart + objOffsetX;
    }
    offsetY = offsetYstart - (ix+2)*objOffsetY;

    offsetX = offsetXstart + (ix-1)*objOffsetX;
    offsetY = offsetYstart - (ix+2)*objOffsetY;
    maphexbuttons[ix] = [];
    for(let iy=0;iy<cntY;iy++){
      offsetX += objOffsetX;
      offsetY += objOffsetY;
      //frames in this order: over, out, down
      var hexbutton = game.add.button(offsetX, offsetY, 'hexsprite', hexClick, 4,2,2);

      //hexbutton.anchor.setTo(0, 0);
      hexbutton.scale.setTo(scale,scale);
      maphexbuttons[ix][iy] = hexbutton;
    }
  }
  ********/

  window.gamedata.mapsize = { 
    x: offsetX + objSize*2, 
    y: offsetY + objSize*4 
  }
  console.log('offsetX: '+offsetX);
  window.gamedata.maphexbuttons = maphexbuttons;
}

function hexClick(hexbtn){
  //hexbtn.inputEnabled = false;
  hexbtn.setFrames(4, 3, 3);
}