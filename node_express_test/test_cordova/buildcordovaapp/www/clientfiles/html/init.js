

window.mainInit = async function(fn){
  await window.loaderjsfiles.load();    // загрузка основных js файлов
  window.GOptions.localStorage_load();  // загрузка основных данных из лок.хранилища
  window.mainMenu.init();
  
  await netGame.init();          // инициализация подключения к игр.серверу
  await netGame.registerUser();
}

$(function(){
  console.log('[ok] start app');
  window.mainInit();
});
