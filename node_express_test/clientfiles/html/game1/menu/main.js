
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
  $('#menu_main').hide();
}

mainMenu.mainMenuShow = function(){
  $('#menu_main').show();
}

