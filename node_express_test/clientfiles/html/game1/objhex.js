

function createHexButton(x,y,xpos,ypos,scale){
  const hs = GOptions.images.hexsprite.sprites;
  var mapObjects = window.gamedata.mapObjects;
  const id =  mapObjects.gdlist.length;
  
  //создаем спрайт хекса
  var hexbtn = window.gamedata.groupmap.create(xpos, ypos, 'hexsprite');
  hexbtn.inputEnabled = true;
  hexbtn.events.onInputDown.add(hexClick, hexbtn);
  hexbtn.frame = hs.neutral;
  hexbtn._id = id; // сохраняем id для нашего спрайта (так будем находить данные по этому хексу)
  hexbtn.alpha = 0;

  var gd = {
    id: id,
    bntobj: hexbtn,
    x: x,
    y: y,
    xpos: xpos,
    ypos: ypos,
    value: 0, // значение силы по умолчанию 0 - нельзя ходить
    owner: 0, // владелец по умолчанию
  };
  mapObjects.gdmap[id] = gd;
  mapObjects.gdlist.push(gd);

  gd.setVal         = gd_setVal;
  gd.getVal         = gd_getVal;
  gd.setNeutral     = gd_setNeutral;
  gd.setActiveUser1 = gd_setActiveUser1;
  gd.setOwnerUser1  = gd_setOwnerUser1;
  gd.setActiveUser2 = gd_setActiveUser2;
  gd.setOwnerUser2  = gd_setOwnerUser2;
  gd.canMoveTo      = gd_canMoveTo;
  gd.moveUser1      = gd_moveUser1;


  return gd;
}

function gd_setVal(val){
    this.value = val;
    const hs = GOptions.images.hexsprite.sprites;
    //console.log(this.id+': '+this.bntobj);
    if(val==0){
      this.bntobj.frame = hs.neutral;
      this.bntobj.visible = false;
      this.bntobj.alpha = 0;
      return;
    }
    
    this.bntobj.visible = true;
    var frame = hs.neutral;
    if(this.owner==window.gamedata.user1.id) frame = hs.user1;
    else if(this.owner==window.gamedata.user2.id) frame = hs.user2;
    frame = frame*20 + val-1;
    //console.log('SET FRAME '+gd.bntobj.frame+'->'+frame);
    this.bntobj.frame = frame;
    if(frame<20){
      this.bntobj.tint = 0xbbbbbb;
    }else{
      this.bntobj.tint = 0xffffff;
    }

    {
      var scale = hs.scaleMin + (hs.scaleMax - hs.scaleMin)/hs.scaleMaxVal*val;
      if(val==1) scale = hs.scaleMin;
      else if(val>=hs.scaleMaxVal) scale = hs.scaleMax;
      
      this.bntobj.scale.x = scale;
      this.bntobj.scale.y = scale;

      var sz = window.gamedata.objSize;
      var offset = (sz - sz * scale)/2;
      console.log(offset);
      this.bntobj.x = this.xpos + offset;
      this.bntobj.y = this.ypos + offset;
    }
}

function gd_getVal(){ return this.value; }

function gd_setNeutral(val){
  this.owner = 0;
  return this.setVal(val||this.value);
}

function gd_setActiveUser1(val){
  this.owner = window.gamedata.user1.id;
  window.gamedata.activeuser1btn = this.bntobj;
  return this.setVal(val||this.value);
}

function gd_setOwnerUser1(val){
  this.owner = window.gamedata.user1.id;
  return this.setVal(val||this.value);
}

function gd_setActiveUser2(val){
  this.owner = window.gamedata.user2.id;
  window.gamedata.activeuser2btn = this.bntobj;
  //console.log(this.id+': '+this.bntobj);
  return this.setVal(val||this.value);
}

function gd_setOwnerUser2(val){
  this.owner = window.gamedata.user2.id;
  return this.setVal(val||this.value);
}

  //возвращает 1 если можно переместиться в соседнюю tobtn
function gd_canMoveTo(togd){ 
    var f = this;
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

function gd_moveUser1(togd){ 
    let valto = togd.value;    // val1
    let valfrom = this.value;  // val2

    //this.setVal(1);
    this.setOwnerUser1(1);

    if( valto > valfrom ){
      return togd.setVal(valto - valfrom);
    }

    if( valto < valfrom ){
      updatehex_catch(this,togd);
      togd.setActiveUser1(valfrom - valto);
      return ;
    }

    if( valto == valfrom ){
      return togd.setVal(1);
    }
}


function hexClick(hexbtn){
  const debug = window.GOptions.debug;
  
  debugObj = hexbtn;
  var st = window.gamedata.status;
  if(st.turntype=='move'){
    if(window.gamedata.activeuser1btn==hexbtn){ //если нажали итак активную кнопку
      if(debug.userMoveHex) console.log('нажали уже активную кнопку');
      return; 
    }

    var gd = get_gdhex(hexbtn._id);
    //console.log('id: '+id);
    //console.log(gd);

    if(gd.owner == window.gamedata.user1.id){  //если нажали на кнопку юзера1
      if(debug.userMoveHex) console.log('нажали на кнопку юзера1');
      if(gd.getVal()>1){
        if(debug.userMoveHex) console.log('значение больше 1 - выставляем активной');
        gd.setActiveUser1();
      }else{
        return gameUser1ShowCanMoveOnlyEnemy();
      }
      return;
    }

    var agd = get_gdhex(window.gamedata.activeuser1btn._id);
    //console.log('active id: '+activebtnId);
    //console.log(agd);

    if(agd.canMoveTo(gd)==0){ //если не можем переместиться на эту кнопку из текущей
      if(debug.userMoveHex) console.log('не можем переместиться на эту кнопку из текущей');
      return gameUser1ShowCanMoveOnlyNearEnemy();
      return;
    }

    let val = agd.getVal();
    if( val > 1 ){
      if(debug.userMoveHex) {
        console.log('захватываем выбранный объект ['+agd.x+':'+agd.y+' -> '+gd.x+':'+gd.y+']');
      } 
      agd.moveUser1(gd);
    }
  }else
  if(st.turntype=='inc'){
    var gd = get_gdhex(hexbtn._id);
    if(gd.owner != window.gamedata.user1.id){  //если нажали на кнопку не юзера1
      return gameUser1ShowCanIncOnlyUser1();
      return;
    }
    var val = gd.getVal();
    if(val<20){
      gd.setVal(val+1);
    }else{
      return gameUser1ShowCantIncOverMax();
      return;
    }
  }
}


function get_gdhex(id){
  return window.gamedata.mapObjects.gdmap[id];
}

function get_gdhexbypos(x,y){
  return window.gamedata.maphexbuttons[x][y];
}

//оформляем захват хекса игрок tohex захватывает fromhex
function updatehex_catch(tohex,fromhex){
  var st = window.gamedata.status;
  if(tohex.owner == window.gamedata.user1.id){
    st.cntuser1++;
  }else
  if(tohex.owner == window.gamedata.user2.id){
    st.cntuser2++;
  }

  if(fromhex.owner == window.gamedata.user1.id){
    st.cntuser1--;
  }else
  if(fromhex.owner == window.gamedata.user2.id){
    st.cntuser2--;
  }
  update_status();
}

function gameUser1ShowCanMoveOnlyEnemy(){
  gameMessageClears(window.gamedata.menu.msgText1);
  gameMessageShow(window.gamedata.menu.msgText1, 'захватить можно только чужие клетки','#fff',0,1500,400);
}

function gameUser1ShowCanMoveOnlyNearEnemy(){
  gameMessageClears(window.gamedata.menu.msgText1);
  gameMessageShow(window.gamedata.menu.msgText1, 'захватить можно только соседние клетки','#fff',0,1500,400);
}

function gameUser1ShowCanIncOnlyUser1(){
  gameMessageClears(window.gamedata.menu.msgText1);
  gameMessageShow(window.gamedata.menu.msgText1, 'увеличивать силу можно только своим клеткам','#fff',0,1500,400);
}

function gameUser1ShowCantIncOverMax(){
  gameMessageClears(window.gamedata.menu.msgText1);
  gameMessageShow(window.gamedata.menu.msgText1, 'у этой клетки уже максимум силы','#fff',0,1500,400);
}
