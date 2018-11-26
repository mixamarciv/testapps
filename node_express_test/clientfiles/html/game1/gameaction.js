//возвращает текущего Юзера который выполняет ход
function act_currentUser(){
  return window.gamedata.status.turnuser;
}

//текущий юзер раздал одну единицу силы
function act_currentUserIncVal(){
  var u = act_currentUser();
  u.cansend--;
}

//сколько силы у текущего юзера
function act_currentUserCntEnergy(){
  var u = act_currentUser();
  return u.cansend;
}


// gameStartTurnEnemy - начинаем ход компуктера
async function gameStartTurnEnemy(){
  window.gamedata.status.turnuser = window.gamedata.user2;
  await act_EnemyMove();
  await act_EnemyInc();
  window.gamedata.status.turnuser = window.gamedata.user1;
}

//двигаем все клетки которые только можно
async function act_EnemyMove(){
  var curUserid = act_currentUser().id;
  console.log('двигается игрок: '+curUserid);
  var gdlist = act_getEnemyHexesWhoCanMove(curUserid);
  for(let i in gdlist){
    let gd = gdlist[i];
    await act_moveEnemyHex(gd);
  }
}

//возвращает все клетки которые могут двигаться
function act_getEnemyHexesWhoCanMove(user_id){
  var gdlist = window.gamedata.mapObjects.gdlist;
  var usergdlist = [];
  for(let i=0;i<gdlist.length;i++){
    let gd = gdlist[i];
    if(user_id==gd.owner && gd.getVal()>1){
      usergdlist.push(gd);
    }
  }
  return usergdlist;
}

//двигаем нашу клетку
async function act_moveEnemyHex(gd){
  await sleep_ms(GOptions.turnSleep);
  gd.setActiveUser2();
  await sleep_ms(GOptions.turnSleep);
  
  while( gd.getVal() > 1 ){
    var nextgd = act_getNextMovePointWithMinVal(gd);
    if(!nextgd) break;
    await sleep_ms(GOptions.turnSleep);
    gd.moveUser2(nextgd);
    gd = nextgd;
  }
  return;
}

//выбираем следующую цель для движения с минимальной силой/сопротивлением
function act_getNextMovePointWithMinVal(gd){
  //выбираем первую соседнюю клетку с наименьшем значением(сопротивлением)
  var gdhexes = gd.nearHexesToCanMove();
  var gd = 0;
  var minval = 10000;
  for (var i in gdhexes){
    let h = gdhexes[i];
    if( h.getVal() < minval ){
      minval = h.getVal();
      gd = h;
    }
  }
  return gd;
}

//----------------------------------------------------------------------
//увеличиваем силы клеток после хода
async function act_EnemyInc(){
  var curUserid = act_currentUser().id;
  console.log('раздает силы игрок: '+curUserid);
  var gdlist = act_getEnemyHexesWithHexesToCanMove(curUserid);
  console.log(gdlist);
  for(let i in gdlist){
    let gd = gdlist[i];
    await act_incEnemyHex(gd);
  }
  if(act_currentUserCntEnergy()>0){
    for(let i in gdlist){
      let gd = gdlist[i];
      await act_incEnemyHex2(gd);
    }
  }
}

//возвращает все клетки игрока у которых есть соседние клетки к которым можно двигаться
function act_getEnemyHexesWithHexesToCanMove(user_id){
  var gdlist = window.gamedata.mapObjects.gdlist;
  var usergdlist = [];
  for(let i in gdlist){
    let gd = gdlist[i];
    if(user_id==gd.owner){
      if(gd.nearHexesToCanMove().length>0){
        usergdlist.push(gd);
      }
    }
  }
  return usergdlist;
}

//увеличиваем силы нашей клетки что бы захватить соседнюю
async function act_incEnemyHex(gd){
  var neargd = act_getNextMovePointWithMinVal(gd);
  var val = neargd.getVal();
  await sleep_ms(GOptions.turnSleep);
  while(gd.incVal()){
    await sleep_ms(GOptions.turnSleep);
    if(val < gd.getVal()) return;
  }
  return;
}

//увеличиваем силы до упора первой попавшейся клетке
async function act_incEnemyHex2(gd){
  await sleep_ms(GOptions.turnSleep);
  while(gd.incVal()){
    await sleep_ms(GOptions.turnSleep);
    if(val < gd.getVal()) return;
  }
  return;
}
