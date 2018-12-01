
var mainMenu = {};

$(function(){
  mainMenu.gameHide();
  mainMenu.mainMenuShow();

  $('#newgame').click(function(){
    if(mainMenu.gameIsCreated()) createGameObjects();
    mainMenu.gameShow();
  });

  $('#resumegame').click(function(){
    mainMenu.gameShow();
  });


  $('[go_to_menu]').click(function(event){
    console.log(event);
    console.log(event.target);
    console.log(event.target.id);
    var go_to_menu = $( event.target ).attr('go_to_menu');
    console.log('go_to_menu:  '+go_to_menu);
    $('.main_menu_item').hide();
    $('#'+go_to_menu).show();
  });

});

mainMenu.gameHide = function(){
  var canv = $('canvas');
  if(canv) canv.hide();
}

mainMenu.gameIsCreated = function(){
  var canv = $('canvas');
  if(!canv.length) return 0;
  return 1;
}

mainMenu.gameShow = function(){
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


