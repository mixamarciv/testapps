window.gametouch = {
  //count:0,
  //movecount: 0, 

  ismouse: -1, // флаг определяет есть ли на девайсе мышка -1 - неопределено, 0 - нет, 1 - есть
               // события мыши срабатывают вместе с тапами
               //  поэтому при наличии тапов не реагируем на события мыши 

  touches:[],
  actiontype: 'none',
  actiondata: {},
  //touchStartTime: 0,
  lastTouchStartTime: 0,
  debugCallfnc: {}, //какие функции и сколько раз вызывали
  contTouches: function(){ return this.touches.length; },
  cntTouch: function(){ return this.touches.length; } ,
};

window.gametouch.debugCallCntInc = function(name){
  var t = window.gametouch.debugCallfnc;
  if(!t[name]) t[name] = 1;
  else t[name]++;
  return;
}

window.gametouch.debugCallCntInfoText = function(name){
  var t = window.gametouch.debugCallfnc;
  var msg = '';
  var cnt = 0;
  for(i in t){
    cnt++;
    if(cnt>=2 && cnt%2==0) msg += "\n";
    msg += i+':'+t[i]+' ';
  }
  return msg;
}

window.gametouch.init =  function(){ 
  //отлавливаем нажатия по экрану
  var el = document.getElementsByTagName("canvas")[0];
  el.addEventListener("touchstart",  handle_touchstart, false);
  el.addEventListener("touchend",    handle_touchend, false);
  el.addEventListener("touchcancel", handle_touchcancel, false);
  el.addEventListener("touchmove",   handle_touchmove, false);
   
  el.addEventListener("mousedown",   handle_mousedown, false);
  el.addEventListener("mouseup",     handle_mouseup, false);
  el.addEventListener("mousemove",   handle_mousemove, false);
  el.addEventListener("wheel",       handle_mousewheel, false);
  el.addEventListener("mousewheel",  handle_mousewheel, false);
}

function copyTouch(touch) {
  var id = touch.identifier;
  if(typeof id == "undefined") id = -3000;
  return { identifier: id, pageX: touch.pageX, pageY: touch.pageY };
}

function touchIndexById(idToFind) {
  var gametouches = window.gametouch.touches;
  for (var i in gametouches) {
    var id = gametouches[i].identifier;
    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}

window.gametouch.lastTouchTime = function() {
  if(this.lastTouchStartTime==0) return -1;
  return new Date() - this.lastTouchStartTime;
}

function handle_mousewheel(evt){
  if(window.gametouch.ismouse==0) return;
  if(window.gametouch.ismouse==-1) window.gametouch.ismouse = 1;
  var s = evt.wheelDelta/50;
  s = worldScale/100 * s;
  var newWorldScale = worldScale + s;
  game_world_resize(newWorldScale);
  window.gametouch.debugCallCntInc('mousewheel');
}

function handle_mousedown(evt){
  if(window.gametouch.ismouse==0) return;
  if(window.gametouch.ismouse==-1) window.gametouch.ismouse = 1;
  window.gametouch.touches = [copyTouch(evt)];
  window.gametouch.start();
  
  window.gametouch.debugCallCntInc('mousedown');
}

function handle_mousemove(evt){
  if(window.gametouch.ismouse==0) return;
  if(window.gametouch.contTouches()==0) return;
  //console.log(evt);
  var from = window.gametouch.touches[0];
  var to = copyTouch(evt);
  window.gametouch.moveCamera(from,to);
  window.gametouch.debugCallCntInc('mousemove');
}

function handle_mouseup(evt){
  if(window.gametouch.ismouse==0) return;
  if(window.gametouch.ismouse==-1) window.gametouch.ismouse = 1;
  window.gametouch.lastTouchStartTime = 0;
  window.gametouch.touches = [];
  window.gametouch.end();
  window.gametouch.debugCallCntInc('mouseup');
}

function check_valid_touch(t){
  if(typeof t.identifier == "undefined") return 0;
  if(typeof t.pageX == "undefined") return 0;
  if(typeof t.pageY == "undefined") return 0;
  return 1;
}

function handle_touchstart(evt){
  if(window.gametouch.ismouse==-1) window.gametouch.ismouse = 0;
  var touches = evt.changedTouches;
  var gametouches = window.gametouch.touches;
  for(var i in touches){
    var touch = touches[i];
    if(!check_valid_touch(touch)) continue;
    gametouches.push(copyTouch(touch));
  }
  window.gametouch.start();
  window.gametouch.debugCallCntInc('touchstart');
}

function handle_touchend(evt){
  var touches = evt.changedTouches;
  var gametouches = window.gametouch.touches;
  for(i in touches){
    var touch = touches[i];
    if(!check_valid_touch(touch)) continue;
    var idx = touchIndexById(touch.identifier);
    gametouches.splice(idx, 1);
  }
  window.gametouch.end();
  window.gametouch.debugCallCntInc('touchend');
}

function handle_touchcancel(evt){
  handle_touchend(evt);
  window.gametouch.debugCallCntInc('touchcancel');
}

function handle_touchmove(evt){
  window.gametouch.debugCallCntInc('touchmove');
  
  window.gametouch.touchStartTime = 0;
  var gametoches = window.gametouch.touches;

  var origtouches = evt.changedTouches;
  var touches = new Array();
  for(var i in origtouches){
    var touch = origtouches[i];
    if(!check_valid_touch(touch)) continue;
    touches.push(copyTouch(touch));
  }

  if(gametoches.length==0){  // если до этого не отловили ни одного нажатия
    //console.log('ERROR: handle_touchstart not call');
    return;
  }
  if(gametoches.length==1){  // если до этого отловили одно нажатие
    if(touches.length!=1){
      //console.log('ERROR: handle_touchstart not call ('+gametoches.length+'/'+touches.length+')');
      return;
    }
    var from = gametoches[0];
    var to = copyTouch(touches[0]);
    window.gametouch.moveCamera(from,to);
  }
  if(gametoches.length==2){  // если до этого отловили два нажатия
    if(touches.length>2) return;
    var from1 = gametoches[0];
    var from2 = gametoches[1];
    var to1 = copyTouch(touches[0]);
    var to2 = from2;
    if(touches.length==1){  // если изменили положение только одного тапа
      if(to1.identifier == from2.identifier){
        to1 = copyTouch(from1);
        to2 = copyTouch(touches[0]);
      }
    }else
    if(touches.length==2){  // если изменилось положение двух тапов
      to2 = copyTouch(touches[1]);
      if(to1.identifier == from2.identifier){
        to1 = copyTouch(touches[1]);
        to2 = copyTouch(touches[0]);
      }
    }
    window.gametouch.resizeCamera(from1,from2,to1,to2);
  }
}

window.gametouch.start = function(){ // нажали 
  var gt = window.gametouch;
  gt.lastTouchStartTime = new Date();
  if(gt.cntTouch()==1){ //обрабатываем одно нажатие
    return gt.oneTouchFnc();
  }
}

window.gametouch.oneTouchFnc = async function(){ //обрабатываем одно нажатие/тап
  var gt = window.gametouch;
  var touch = window.gametouch.touches[0];
  var x = touch.pageX * PIXEL_RATIO; 
  var y = touch.pageY * PIXEL_RATIO;

  const cam = game.camera;
  var menuPos = cam.height - cam.height * GOptions.gameMenu.screenHSize;
  if( y > menuPos ){
    console.log('gametouch -> mapMenuClick('+x+','+y+')');
    //await sleep_ms(150);  // нужно для того что бы успела отжаться клавиша мыши
    return mapMenuClick(x,y);
  }
}

window.gametouch.end = function(){ // отжали 
  window.gametouch.lastTouchStartTime = 0;
}

window.gametouch.moveCamera = function(from,to){ // обрабатываем перемещение камеры
  var gt = window.gametouch;
  gt.actiontype = 'move';
  gt.actiondata = {from:from,to:to};

  var x1 = from.pageX, x2 = to.pageX;
  var y1 = from.pageY, y2 = to.pageY;
  
  x1 *= PIXEL_RATIO;
  y1 *= PIXEL_RATIO;
  x2 *= PIXEL_RATIO;
  y2 *= PIXEL_RATIO;

  const cam = game.camera;
  cam.setPosition(cam.x + x1 - x2, cam.y + y1 - y2);

  gt.endAction();
}

window.gametouch.resizeCamera = function(from1,from2,to1,to2){
  var gt = window.gametouch;
  gt.actiontype = 'resize';
  gt.actiondata = {from1:from1,from2:from2,to1:to1,to2:to2};

  var f1 = new Phaser.Point(from1.pageX,from1.pageY);
  var f2 = new Phaser.Point(from2.pageX,from2.pageY);
  var t1 = new Phaser.Point(to1.pageX,to1.pageY);
  var t2 = new Phaser.Point(to2.pageX,to2.pageY);
  
  
  var dfrom = f1.distance(f2);
  var dto = t1.distance(t2);
  var newdist = dto - dfrom;
  var msize = Math.max(game.scale.width,game.scale.height);
  var oldWorldScale = worldScale;
  var newWorldScale = oldWorldScale + newdist*PIXEL_RATIO/msize;

  game_world_resize(newWorldScale);

  //var centr = Phaser.centroid(t1,t2);

  //cam.setPosition(centr.x, centr.y);

  gt.endAction();
}

window.gametouch.endAction = function(){
  var gt = window.gametouch;
  var gametoches = gt.touches;
  if(gt.actiontype == 'move'){
    gametoches[0] = gt.actiondata.to;
  }
  if(gt.actiontype == 'resize'){
    gametoches[0] = gt.actiondata.to1;
    gametoches[1] = gt.actiondata.to2;
  }
  gt.actiontype = 'none';
}
