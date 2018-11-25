
async function gameStartTurnEnemy(){
  var gdlist = act_findUserHexes(window.gamedata.user2.id);
  for(let i=0;i<gdlist.length;i++){
    let gd = gdlist[i];
    act_moveEnemyHex(gd);
  }
}

function act_findUserHexes(user_id){
  var gdlist = window.gamedata.mapObjects.gdlist;
  var usergdlist = [];
  for(let i=0;i<gdlist.length;i++){
    let gd = gdlist[i];
    if(user_id==gd.id && gd.getVal()>1){
      usergdlist.push(gd);
    }
  }
  return usergdlist;
}

async function act_moveEnemyHex(gd){

}
