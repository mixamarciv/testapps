
var mainMenu = {

};

mainMenu.init = function(){
  mainMenu.gameHide();
  mainMenu.mainMenuShow();
  setTimeout(function(){
    mainMenu._render_debug_fields();
  },50);

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
    start_game();
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
