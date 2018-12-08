
function show_debug_info() {
  if(GOptions.debug.debug_total==0) return 0;  // вообще не выводим ничего
  const dbg = GOptions.debug;

  var offsety = 0;
  var offsety_inc = 20;

  if(dbg.gametouch){
    var t = window.gametouch;
    var msg = 'count: '+t.count+' move: '+t.movecount;
    this.game.debug.text('gametouch: '+msg, 2, offsety+=offsety_inc, "#00ff00");  
  }

  if(dbg.fps){
    this.game.debug.text(game.time.fps || '--', 2, offsety+=offsety_inc, colors.yellow);  
  }

  if(dbg.pixel_ratio){
    var text = 'pixel_ratio: '+PIXEL_RATIO+'; '+
    ' w.dPR: '+window.devicePixelRatio+
    ' Wscale: '+Math.round(worldScale*100)/100+' ';
    this.game.debug.text(text, 2, offsety+=offsety_inc, "#00ff00"); 
  }

  if(dbg.create_map_time){
    var t = window.gamedata.timeload;
    this.game.debug.text('createMap: '+t.createMap, 2, offsety+=offsety_inc, "#00ff00"); 
  }

  if(dbg.map_info){
    var b = window.gamedata.mapsize;
    var mapcnt = b.cntX+'x'+b.cntY;
    var text = 'map['+mapcnt+'] width: '+Math.round(b.width*worldScale)+' height: '+Math.round(b.height*worldScale);
    this.game.debug.text(text, 2, offsety+=offsety_inc, "#00ff00");  
  }

  if(dbg.debugObj_info){
    var o = debugObj;
    if(o && o.x!==undefined){
      var text = 'debugObj: '+o.x+':'+o.y+` size: ${o.width}:${o.height} `;
      this.game.debug.text(text, 2, offsety+=offsety_inc, "#00ff00"); 
      text = 'id: '+o._id;
      if(o.scale) text += ` scale: ${o.scale.x}:${o.scale.y}`;
      this.game.debug.text(text, 2, offsety+=offsety_inc, "#00ff00"); 
    }
  }

  if(dbg.movePointer_info){
    var t = movePointer;
    if( t) debugData._lastmovePointer = t;
    if(!t) t = debugData._lastmovePointer;
    if( t){
      this.game.debug._lastmovePointer = t;
      this.game.debug.text('movePointer: '+round(t.x)+','+round(t.y),
         2, offsety+=offsety_inc, "#00ff00"); 
    }
  }

  if(dbg.IncTap_info){
    var t = isIncTapDownStartTime;
    var p = isIncTapDownTapPoint;
    var text = 'IncTap';
    
    if(p) text += '  point: '+p.x+':'+p.y;
    else  text += '  point: 0:0';

    text += '  time: '+isIncTapDownStartTime;
    if( t>0) {
      t = new Date() - isIncTapDownStartTime;
      text += '   Down ms: '+t;
    }
    
    p = game.input.pointer1.position;
    text += '  dist: '+isIncTapDownTapPointLastDist+'('+p.x+':'+p.y+')';
    this.game.debug.text(text,2, offsety+=offsety_inc, "#00ff00"); 
  }

  if(dbg.cameraInfo){
    this.game.debug.cameraInfo(game.camera, 2, offsety+=offsety_inc);
    offsety+=offsety_inc*7;
  }

  if(dbg.inputInfo){
    this.game.debug.inputInfo(2, offsety+=offsety_inc, colors.lime);
    offsety+=offsety_inc*14;
  }

  if(dbg.device){
    this.game.debug.device(2, offsety+=offsety_inc, colors.aqua);
  }

  if(dbg.body){
    this.game.debug.body(window.gamedata.groupmap);
  }
}
