//var game = window.game;
//var maingamedata = window.gamedata;
var createmap = {

}

// задаем параметры из net игры
createmap.setOptionsFromNet = ()=>{
  if(GOptions.net.id != 0){
    GOptions.lastGame.gameType = 'netGame';
    GOptions.lastGame.id = GOptions.net.id;
    gamedata.gameType = 'netGame';
    gamedata.status.id = GOptions.net.id;
    var n = GOptions.net;
    if(n.mapsize && n.mapsize.x>0){
      GOptions.gameMap.cntX = n.mapsize.x;
      GOptions.gameMap.cntY = n.mapsize.y; 
    }
  }
}

createmap.createMap = function(){
  var start_load = new Date();
  createmap.clearMap();

  if(  gamedata.gameType !== 'netGame' 
    && gamedata.gameType !== 'localGame'){
      gamedata.gameType = GOptions.lastGame.gameType;
      return createmap.createMap();
  }

  let scale = 1;
  let cntX = GOptions.gameMap.cntX;
  let cntY = GOptions.gameMap.cntY;

  let objSize = window.GOptions.images.hexsprite.size;
  window.gamedata.objSize = objSize;
  
  let offsetXstart = objSize;
  let offsetYstart = objSize;

  let offsetX = offsetXstart;
  let offsetY = offsetYstart;
  //offsetX += 96;
  //offsetY += 64;
  var maphexbuttons = [];

  /*****************  v3: */
  for(let ix=0;ix<cntX;ix++){
    offsetY = offsetYstart;
    if(ix%2==0) offsetY += objSize*0.5;
    offsetX += objSize*0.8;
    for(let iy=0;iy<cntY;iy++){
      var hexbutton = new createHexButton(ix,iy,offsetX,offsetY,scale);
      offsetY += objSize;
      if(!maphexbuttons[ix]) maphexbuttons[ix] = [];
      maphexbuttons[ix][iy] = hexbutton;
    }
  }
  /**********************/
  gamedata.mapsize.cntX = cntX;
  gamedata.mapsize.cntY = cntY;
  gamedata.mapsize.width = offsetX + objSize*2;
  gamedata.mapsize.height = offsetY + objSize*4;


  window.gamedata.maphexbuttons = maphexbuttons;
  window.gamedata.timeload.createMap = time_long_str(start_load);
  
  if(gamedata.gameType == 'netGame'){
    createmap.setMapDataFromNet();
  }

}

createmap.clearMap = function(){
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

  var msg = 'удалено объектов: '+cnt;
  if(debug.showClearMapInfo) console.log(msg);

  //window.service_phone.writeFileLocal('log_clearmap.log',msg);
}


//генерим случайное число или пустой блок
function getInitHexValue(){
  var rnd = getRandomInt(0, 15);
  if(rnd==0) return 0;
  rnd = round(rnd/4);
  return rnd;
}

//создаем пользовательские объекты:
createmap.createuserobj = function(){
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
  st.turnuser = window.gamedata.user1;
  st.turnuser.cansend = 1;
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

createmap.setMapDataFromNet = function(){

  createmap.setOptionsFromNet();

  var curUser = GOptions.user;
  var net = GOptions.net;

  gamedata.changeUser = {1:1, 2:2}; // номера юзера с кем меняем местами
  if(net.user2.id == curUser.id){
    gamedata.changeUser = {1:2, 2:1};
  }
  
  var cu = gamedata.changeUser;
  gamedata.user1 = net['user'+cu[1]];
  gamedata.user2 = net['user'+cu[2]];
  
  if(gamedata.mapsize.cntX !== net.mapsize.x ||
     gamedata.mapsize.cntY !== net.mapsize.y ){
        createmap.createMap();
  }
  
  //задаем данные карты с последней полученной карты сервера 
  var cntx = gamedata.mapsize.cntX;
  var cnty = gamedata.mapsize.cntY;
  var data = net.mapdata;
  console.log(gamedata.mapsize);
  console.log(data);
  
  var map = gamedata.maphexbuttons;
  for(let x=0;x<cntx;x++){
    for(let y=0;y<cnty;y++){
        let v = data[x][y];
        hexmap.set_data(x,y,v);
        continue;
        let gd = map[x][y];
        
        gd.bntobj.alpha = 1;
        if(v-500>0){ // это одна из ячеек юзера

          var user = 1;
          v -= 1000;
          if(v-1000 > 0){
            v -= 1000;
            user = 2;
          }

          var active = 0;
          if(v-100 > 0){
            v -= 100;
            active = 1;
          }

          user = cu[user];
          if(active){
            gd['setActiveUser'+user](v);
          }else{
            gd['setOwnerUser'+user](v);
          }
        }else{
          gd.setVal(v);
        }
    }
  }
  //animate_new_map2();
}
