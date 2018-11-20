
function show_debug_info() {
  {
    var text = 'PIXEL_RATIO: '+PIXEL_RATIO+'; '+
    ' w.dPR: '+window.devicePixelRatio+
    ' Wscale: '+Math.round(worldScale*100)/100+' ';
    this.game.debug.text(text, 2, 28, "#00ff00"); 
  }
  {
    var b = window.gamedata.mapsize;
    var text = 'map width: '+Math.round(b.width*worldScale)+' height: '+Math.round(b.height*worldScale);
    this.game.debug.text(text, 2, 40, "#00ff00");  
  }
  {
    var o = debugObj;
    if(o.scale){
      var text = 'debugObj: '+o.x+':'+o.y+` size: ${o.width}:${o.height} scale: ${o.scale.x}:${o.scale.y}`;
      this.game.debug.text(text, 2, 60, "#00ff00"); 
    }
  }
  {
    var t = window.gamedata.time;
    this.game.debug.text('createMap: '+t.createMap, 2, 80, "#00ff00"); 
  }
  {
    var t = movePointer;
    if( t) debugData._lastmovePointer = t;
    if(!t) t = debugData._lastmovePointer;
    if( t){
      this.game.debug._lastmovePointer = t;
      this.game.debug.text('movePointer: '+round(t.x)+','+round(t.y),
         2, 100, "#00ff00"); 
    }
  }
  
  if(GOptions.debug.main==1){
    var debug = this.game.debug;
    //this.loadRender();
    debug.text(game.time.fps || '--', 2, 14, "#00ff00");  
    debug.cameraInfo(game.camera, 20, 150);

    debug.inputInfo(20, 300, colors.lime);
    //debug.pointer(this.input.activePointer, colors.aqua);
    debug.device(420, 20, colors.aqua);
    //debug.phaser(10, 580, colors.gray);
    game.debug.body(window.gamedata.groupmap);
  }
}
