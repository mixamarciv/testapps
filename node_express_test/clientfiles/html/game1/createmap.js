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
      var hexbutton = new createHexButton(ix,iy,offsetX,offsetY,scale);
      offsetX += objSize*1.5;
      if(!maphexbuttons[ix]) maphexbuttons[ix] = [];
      maphexbuttons[ix][iy] = hexbutton;
    }
  }
  /**********************/
  window.gamedata.mapsize = {
    cntX: cntX,
    cntY: cntY,
    width: offsetX + objSize*2, 
    height: offsetY + objSize*4 
  }

  window.gamedata.maphexbuttons = maphexbuttons;
  window.gamedata.timeload.createMap = time_long_str(start_load);
  
}


function clearMap(){
  const debug = window.GOptions.debug;
  
  window.gamedata.maphexbuttons = [];
  var mapObjects = window.gamedata.mapObjects;
  
  var cnt = 0;
  for(let i=0;i<mapObjects.gdlist.length;i++){
      var gd = mapObjects.gdlist[i];
      const id = gd.id;
      gd.bntobj.destroy();
      cnt++;
      mapObjects.gdmap[id] = null;
      mapObjects.gdlist[i] = null;
  }
  mapObjects.gdmap = {};
  mapObjects.gdlist = [];
  if(debug.showClearMapInfo) console.log('удалено объектов: '+cnt);
}


//генерим случайное число или пустой блок
function getInitHexValue(){
  var rnd = getRandomInt(0, 15);
  if(rnd==0) return 0;
  rnd = round(rnd/4);
  return rnd;
}

//создаем пользовательские объекты:
function createuserobj(){
  const map = GOptions.gameMap;

  //задаем случайные позиции игроков
  var posU1 = {x:getRandomInt(0,map.cntX/3.3),y:getRandomInt(0,map.cntY/3.3)}
  {
    if(getRandomInt(0,2)) posU1.x = map.cntX-posU1.x-1;
    if(getRandomInt(0,2)) posU1.y = map.cntY-posU1.y-1;
  }
  var posU2 = { x: map.cntX-posU1.x-1, y: map.cntY-posU1.y-1}  // позиция игрока2 противоположна игроку1


  //console.log('posU1: ',posU1);
  var gd1 = get_gdhexbypos(posU1.x,posU1.y);
  //console.log('user1: ',gd1);
  window.gamedata.mainuser1btn_id = gd1.id;
  gd1.setActiveUser1(18);


  var gd2 = get_gdhexbypos(posU2.x,posU2.y);
  //console.log('user2: ',gd2);
  
  window.gamedata.mainuser2btn_id = gd2.id;
  gd2.setActiveUser2(20);


  setstatus_new_map();
  animate_new_map();
}

function setstatus_new_map(){
  var st = window.gamedata.status;
  st.cntuser1 = 1;
  st.cntuser2 = 1;
  st.turnuser = 'user1'; // кто сейчас ходит
  st.turntype = 'move';  
  menuMainUpdateStatus();
}

function animate_new_map(){
  const map = GOptions.gameMap;
  var timeouti = 0.2;
  var timeoutj = 0.2;
  var timeoutms = 300;

  //gd_setVal(gd,rnd);
  var cntx2 = map.cntX/2;
  var cnty2 = map.cntY/2;
  for(let i=0;i<cntx2;i++){
    timeoutj = timeouti;
    timeouti += 0.5;
    for(let j=0;j<cnty2;j++){
     
      var gd1 = get_gdhexbypos(cntx2+i,cnty2+j);
      var gd2 = get_gdhexbypos(cntx2-i-1,cnty2-j-1);

      var gd3 = get_gdhexbypos(cntx2-i-1,cnty2+j);
      var gd4 = get_gdhexbypos(cntx2+i,cnty2-j-1);
      
      var timeout = timeoutj*timeoutms;
      timeoutj += 0.15;

      var rnd0 = getInitHexValue();
      if(gd1.owner==0 && gd2.owner==0){
        var rnd1 = getInitHexValue();
        rnd1 = rnd0;
        gd1.setVal(rnd1);
        gd2.setVal(rnd1);
        game.add.tween(gd1.bntobj).to( { alpha: 1 }, timeout, Phaser.Easing.Linear.None, true);
        game.add.tween(gd2.bntobj).to( { alpha: 1 }, timeout, Phaser.Easing.Linear.None, true);
      }else{
        gd1.bntobj.alpha = 1;
        gd2.bntobj.alpha = 1;
      }

      if(gd3.owner==0 && gd4.owner==0){
        var rnd2 = getInitHexValue();
        rnd2 = rnd0;
        gd3.setVal(rnd2);
        gd4.setVal(rnd2);
        game.add.tween(gd3.bntobj).to( { alpha: 1 }, timeout, Phaser.Easing.Linear.None, true);
        game.add.tween(gd4.bntobj).to( { alpha: 1 }, timeout, Phaser.Easing.Linear.None, true);
      }else{
        gd3.bntobj.alpha = 1;
        gd4.bntobj.alpha = 1;
      }

    }
  }
}

function gl_endTurn(){
}
