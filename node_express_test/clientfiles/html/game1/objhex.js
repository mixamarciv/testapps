

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
  gd.incVal         = gd_incVal;
  gd.setNeutral     = gd_setNeutral;
  gd.setActiveUser1 = gd_setActiveUser1;
  gd.setOwnerUser1  = gd_setOwnerUser1;
  gd.setActiveUser2 = gd_setActiveUser2;
  gd.setOwnerUser2  = gd_setOwnerUser2;
  gd.canMoveTo      = gd_canMoveTo;
  gd.moveUser1      = gd_moveUser1;
  gd.moveUser2      = gd_moveUser2;
  gd.nearHexes      = gd_nearHexes;
  gd.nearHexesToCanMove = gd_nearHexesToCanMove;

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
    if(this.owner==window.gamedata.user1.id){
      frame = hs.user1;
      if(this.id == window.gamedata.mainuser1btn_id){ // если это главный хекс
        this.bntobj.tint = 0xb0b0ff;
      }else{
        this.bntobj.tint = 0xffffff;
      }
    }else if(this.owner==window.gamedata.user2.id){
      frame = hs.user2;
      if(this.id == window.gamedata.mainuser2btn_id){ // если это главный хекс
        this.bntobj.tint = 0xb0ffb0;
      }else{
        this.bntobj.tint = 0xffffff;
      }
    }else{ // если это нейтральный хекс
      this.bntobj.tint = 0xbbbbbb;  
    }
    frame = frame*20 + val-1;
    //console.log('SET FRAME '+gd.bntobj.frame+'->'+frame);
    this.bntobj.frame = frame;
    
    {
      var scale = hs.scaleMin + (hs.scaleMax - hs.scaleMin)/hs.scaleMaxVal*val;
      if(val==1) scale = hs.scaleMin;
      else if(val>=hs.scaleMaxVal) scale = hs.scaleMax;
      
      this.bntobj.scale.x = scale;
      this.bntobj.scale.y = scale;

      var sz = window.gamedata.objSize;
      var offset = (sz - sz * scale)/2;
      //console.log(offset);
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
    if(togd.getVal()==0) return 0;
    if(f.owner==t.owner){
      //if(GOptions.debug.userMoveHex) console.log('нельзя ходить по уже захваченным объектам');
      return 0;
    }
    
    let rzx = f.x - t.x;
    let rzy = f.y - t.y;
    let nechetX = f.x%2;

    //if(GOptions.debug.userMoveHex) console.log(`проверка хода ${f.x}:${f.y}(${nechetX}) -> ${t.x}:${t.y} rzx:${rzx}, rzy:${rzy}`);
    
    if(rzx==0 && (rzy==1 || rzy==-1)) return 1;  // ход по вертикали

    if(rzx>1 || rzx<-1) return 0;

    if(!nechetX) {
      if(rzy==0 || rzy==-1) return 1;
    } 
    if(nechetX) { 
      if(rzy==0 || rzy==1 ) return 1; 
    } 

    return 0;
}

//возвращает соседние квадраты
function gd_nearHexes(){
  var h = [];
  var x = this.x, y = this.y;

  h.push(get_gdhexbypos(x,y-1));
  h.push(get_gdhexbypos(x,y+1));

  let nechetX = x%2;
  if(nechetX) {
    h.push(get_gdhexbypos(x+1,y+0));
    h.push(get_gdhexbypos(x+1,y-1));
    h.push(get_gdhexbypos(x-1,y+0));
    h.push(get_gdhexbypos(x-1,y-1));
  }else //if(!nechetY) 
  {
    h.push(get_gdhexbypos(x+1,y+0));
    h.push(get_gdhexbypos(x+1,y+1));
    h.push(get_gdhexbypos(x-1,y+0));
    h.push(get_gdhexbypos(x-1,y+1));
  }

  var h2 = [];
  for(let i in h){
    if(h[i]) h2.push(h[i]); 
  }
  return h2;
}

//возвращает соседние квадраты которые можно захватить
function gd_nearHexesToCanMove(){
  var h = this.nearHexes();
  var hm = [];
  for(var i in h){
    let gd = h[i];
    if( gd && this.canMoveTo(gd) ){
      hm.push(gd); 
    }
  }
  return hm;
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

function gd_moveUser2(togd){ 
  let valto = togd.value;    // val1
  let valfrom = this.value;  // val2

  //this.setVal(1);
  this.setOwnerUser2(1);

  if( valto > valfrom ){
    return togd.setVal(valto - valfrom);
  }

  if( valto < valfrom ){
    updatehex_catch(this,togd);
    togd.setActiveUser2(valfrom - valto);
    return ;
  }

  if( valto == valfrom ){
    return togd.setVal(1);
  }
}

function hexClick(hexbtn){
  const debug = window.GOptions.debug;
  var gd = get_gdhex(hexbtn._id);
  window.gamedata.lastClickHex_gd = gd;
  debugObj = gd;
  var st = window.gamedata.status;
  if(st.turntype=='move'){  // если пользователь движется
    if(window.gamedata.activeuser1btn==hexbtn){ //если нажали итак активную кнопку
      if(debug.userMoveHex) console.log('нажали уже активную кнопку');
      return; 
    }
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
    }else{
      gameUser1ShowCantMoveWithoutEnergy();
      return;
    }
  }else
  if(st.turntype=='inc'){ // если увеличивает силы клеток

    if(gd.owner != window.gamedata.user1.id){  //если нажали на кнопку не юзера1
      return gameUser1ShowCanIncOnlyUser1();
      return;
    }

    var st = window.gamedata.status;
    if( act_currentUserCntEnergy() <= 0 ){ //если нет сил на раздачу
      gameUser1ShowCantInc();
      return;
    }

    var val = gd.getVal();
    if(val<20){
      //st.cntuser1cansend--;
      gd.incVal();
      
      menuMainBtnUpdate();
      return;
    }else{
      return gameUser1ShowCantIncOverMax();
      return;
    }
  }
}

//увеличиваем значение силы хекса
function gd_incVal(){
  if( act_currentUserCntEnergy() <= 0 ){
    console.log('act_currentUserCntEnergy() <= 0  ('+act_currentUserCntEnergy()+' <= 0)');
    return 0;
  }
  if( this.owner != act_currentUser().id ){
    console.log('this.owner != act_currentUser().id ('+this.owner+' != '+act_currentUser().id+')');
    return 0;
  }
  if( this.getVal() >= 20 ) return 0;

  var val = this.getVal();
  act_currentUserIncVal();
  this.setVal(val+1);
  return 1;
}

function get_gdhex(id){
  return window.gamedata.mapObjects.gdmap[id];
}

function get_gdhexbypos(x,y){
  var mapsz = window.gamedata.mapsize;
  if( x<0 || y<0 ) return 0;
  if( x >= mapsz.cntX ) return 0;
  if( y >= mapsz.cntY ) return 0;
  //console.log(`get_gdhexbypos(${x},${y})`);
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
  menuMainUpdateStatus();
}

function gameUser1ShowCanMoveOnlyEnemy(){
  gameMessageClears(window.gamedata.menu.msgText1);
  gameMessageShow(window.gamedata.menu.msgText1, 'захватить можно только чужие клетки','#fff',0,1500,400);
}

function gameUser1ShowCanMoveOnlyNearEnemy(){
  gameMessageClears(window.gamedata.menu.msgText1);
  gameMessageShow(window.gamedata.menu.msgText1, 'захватить можно только соседние клетки','#fff',0,1500,400);
}

function gameUser1ShowCantMoveWithoutEnergy(){
  gameMessageClears(window.gamedata.menu.msgText1);
  gameMessageShow(window.gamedata.menu.msgText1, 'нет сил для хода','#fff',0,1500,400);
}

function gameUser1ShowCanIncOnlyUser1(){
  gameMessageClears(window.gamedata.menu.msgText1);
  gameMessageShow(window.gamedata.menu.msgText1, 'увеличить силу можно только своим клеткам','#fff',0,1500,400);
}

function gameUser1ShowCantIncOverMax(){
  gameMessageClears(window.gamedata.menu.msgText1);
  var msg = [
    'достигнут максимум',
    'у этой клетки уже максимум силы',
  ]
  gameMessageShow(window.gamedata.menu.msgText1, msg,'#fff',0,1500,400);
}

function gameUser1ShowCantInc(){
  gameMessageClears(window.gamedata.menu.msgText1);
  var msg = [
    'нет силы',
    'все силы израсходованы',
  ]
  gameMessageShow(window.gamedata.menu.msgText1, msg,'#fff',0,1500,400);
}
