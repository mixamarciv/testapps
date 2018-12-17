
var mainMenu = {

};

mainMenu.init = function(){
  mainMenu.gameHide();
  mainMenu.mainMenuShow();
  
  setTimeout(function(){
    mainMenu.loadButtonsForMapSize();
    mainMenu._render_debug_fields();
  },200);

  setTimeout(function(){
    $('#loader').hide();
  },2000);

  $('#newgame').click(function(){
    if(mainMenu.gameIsCreated()) createGameObjects();
    mainMenu.gameShow();
  });

  $('#resumegame').click(function(){
    mainMenu.gameShow();
  });

  $('#exitgame').click(function(){
    if (navigator.app) {
        navigator.app.exitApp();
    } else if (navigator.device) {
        navigator.device.exitApp();
    } else {
        window.close();
    }
  });

  $('[go_to_menu]').click(function(event){
    console.log(event);
    console.log(event.target);
    console.log(event.target.id);
    var go_to_menu = $( event.target ).attr('go_to_menu');
    console.log('go_to_menu:  '+go_to_menu);
    $('.main_menu_item').hide();
    $('#'+go_to_menu).show();
    load_eduser();
  });

  $('#edituser_save').click(save_eduser);
  $('#createnetgamebtn').click(mainMenu.createNetGame);
};

mainMenu.gameHide = function(){
  window.GOptions.localStorage_save(); // сохраняем настройки каждый раз при смене состояния игры
  var canv = $('canvas');
  if(canv) canv.hide();
}

mainMenu.gameIsCreated = function(){
  var canv = $('canvas');
  if(!canv.length) return 0;
  return 1;
}

mainMenu.gameShow = function(){
  window.GOptions.localStorage_save(); // сохраняем настройки каждый раз при смене состояния игры
  mainMenu.mainMenuHide();
  if(mainMenu.gameIsCreated()){
    var canv = $('canvas');
    canv.show();
  }else{
    game.start_game();
  }
}

mainMenu.mainMenuHide = function(){
  $('#game_menu_main').hide();
}

mainMenu.mainMenuShow = function(){
  $('#game_menu_main').show();
}


mainMenu._render_debug_fields = function(){
  var f = $('#debug_fields');
  var html = '';
  var dbg = window.GOptions.debug;
  for(var key in dbg){
    const val = dbg[key];
    var checked = 'checked';
    if(!val) checked = '';
    var objid = 'objid_'+key;
    html += `
    <p><label>
    <input type="checkbox" id='${objid}'
           onchange="mainMenu_change_dbg_field('#${objid}','${key}')"
           name="${key}" ${checked}
    > ${key} </label></p>
    `;
  }
  f.html(html);
}

function mainMenu_change_dbg_field(idobj,field){
  var val = $(idobj).prop('checked');
  if(val) val = 1;
  else val = 0;
  window.GOptions.debug[field] = val;
}


// выводим данные юзера
function load_eduser() {
  var u = GOptions.user;
  $('.username').html(u.name);
  $('#eduserName').val(u.name);
  $('#eduserPass').val(u.pass);
  $('#eduserEmail').val(u.email);
  $('#userinfo').html(`
    дата регисрации: ${u.datecreate} <br>
    id: ${u.id} / uuid: ${u.uuid}
  `);
  $('#edituser_save_info').html('');
}

// сохраняем данные юзера
async function save_eduser() {
  var user = GOptions.user;
  var u = GOptions.copy_object1lvl(user,{});
  u.name = $('#eduserName').val();
  u.pass = $('#eduserPass').val();
  u.email = $('#eduserEmail').val();

  $('#edituser_save_info').html('отправка..');
  var user = await netGame.updateUser(u);
  if(user==0){
    $('#edituser_save_info').html('во время отправки произошла ошибка (');
    return;
  }
  load_eduser();
  $('#edituser_save_info').html('данные успешно обновлены');
}

mainMenu.loadButtonsForMapSize = function(){
  var s = ''
  $('.mapsizebuttons').html('');

  var arr = [12,16,24,36,48];
  for(var i=0;i<arr.length;i++){
      var m = arr[i];
      var sl = '';
      for(var j=0;j<arr.length;j++){
          var n = arr[j];
          var uniqid = 'i'+m+'x'+n+'_'+getRandomInt(0, 100000);          
          if(i==1 && j==3){
              sl += `
                  <button type="button" class="mapsizebtn btn btn-primary">${m}x${n}</button>
              `;
          }else{
              sl += `
                  <button type="button" class="mapsizebtn btn btn-outline-primary">${m}x${n}</button>
              `;
          }
      }
      sl += '';
      s += sl;
  }
  s = '<center>'+s+'</center>';
  $('.mapsizebuttons').html(s);

  $('.mapsizebtn').click(function(e){
    var t = $(this);
    t.parent().find('.btn-primary')
        .removeClass('btn-primary')
        .addClass('btn-outline-primary');

    t.removeClass('btn-outline-primary');
    t.addClass('btn-primary');

    //alert(val);
  });
}

//возвращает размеры карты с нажатой кнопки в указанном меню obj
mainMenu.getSelectedNetMapSize = function(obj){
  var btns = obj.find('.mapsizebuttons');
  var btn = btns.find('.btn-primary');
  var val = btn.html();
  var t = val.split('x');
  var size = {x: t[0], y: t[1]}
  return size;
}

mainMenu.createNetGame = function(){
  var options = {};
  var obj = $('#menu_createnetgame');
  options.mapsize = mainMenu.getSelectedNetMapSize(obj);

  mainMenu.createNetGameStatusShow('подключаемся к серверу');
  netGame.createNetGame(options,function(){});
}

mainMenu.createNetGameStatusShow = (msg)=>{
  $('#createnetgamebtn_container').hide();
  $('#createnetgamecancelbtn_container').show();
  $('#createnetgame_msg').show();
  $('#createnetgame_msg').html(`
    <b>${msg}</b>
  `);
}

mainMenu.createNetGameStatusShowError = (msg)=>{
  $('#createnetgamebtn_container').show();
  $('#createnetgamecancelbtn_container').hide();
  $('#createnetgame_msg').show();
  $('#createnetgame_msg').html(`
    <b>${msg}</b>
  `);
}

mainMenu.createNetGameStatusHide = (msg)=>{
  $('#createnetgamebtn_container').show();
  $('#createnetgamecancelbtn_container').hide();
  $('#createnetgame_msg').hide();
  $('#createnetgame_msg').html('');
}


mainMenu.updateListNetGames = (d) => {
  var o = $('#netgameslist').html('');
  var s = '';
  for(i in d.gamelist){
    var m = d.gamelist[i];
    var time = date_to_str_format(m.startTime,'h:m:s');
    var mapsize = m.mapsize;
    if(!mapsize) mapsize = {x:'?',y:'?'};

    s += `<a href='#' id="m${m.id}" 
           onclick="mainMenu.connectToNetGame('${m.id}')"
           >
    <li class="list-group-item d-flex 
               justify-content-between 
               align-items-center"
    >
    <big><b>${m.name}</b></big>
    ${time} / id:${m.id}
      <span class="badge badge-primary badge-pill">
      <big><big> ${mapsize.x} x ${mapsize.y} </big></big>
      </span>
    <span class=status></span>
    </li>
    </a>
    `;
  }
  o.html(s);
  
  var info = 'в ожидании/матчей: '
        +d.gamelist.length+' / '+d.cntmatchesplay+' / '+d.playcnt2
        +'<br>время сервера: '+d.time;
  $('#netgameslistinfo').html(info);
  $('.connectToNetGameBtn').click();
}

mainMenu.connectToNetGame = (id)=>{
  //var obj = $(e);
  //var idmatch = obj.attr('id');
  netGame.connectNetGame(id,function(){});
}

mainMenu.connectNetGameStatusShow = (id,msg)=>{
  $('#netgameslistinfo').html(msg);
}

mainMenu.connectNetGameStatusShowError = (id,msg)=>{
  $('#netgameslistinfo').html(msg);
}
