
var GOptions = {
  debug: {
    main: 0,
    loader: 0,
    userMoveHex: 0,   // пишем лог перемещения по клеткам
    showHexInfo: 0,    // выводим позиции клеток внутри хексов
    showClearMapInfo: 0, // выводить информацию по очистке карты
  },
  usePlugin: {
    kineticScrolling: 1
  },
  fullScreen: 1,
  width: window.screen.availWidth,
  height: window.screen.availHeight,
}

GOptions.width  = 600;
GOptions.height = 800;

{//определяем размер перед загрузкой
  //вот тут док для айфона и ещё немного полезной инфы:
  //  https://www.joshmorony.com/how-to-scale-a-game-for-all-device-sizes-in-phaser/
  // и тут:
  //  https://medium.com/slow-cooked-games-blog/how-to-create-a-mobile-game-on-the-cheap-38a7b75999a7
  // надо юзать * window.devicePixelRatio
  var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight|| e.clientHeight|| g.clientHeight;
  //alert(x + ' × ' + y);
  GOptions.width  = x;
  GOptions.height = y;
}

window.GOptions = GOptions;


GOptions.images = {
  baseURL: '/clientfiles/html/img/hex2',
  hexsprite: {
    path: '/hexsprite.png',
    sprites: {
      neutral: 2,
      user1: 0,
      active1: 1,
      user2: 3,
      active2: 4,
    },
    size: 64
  }
}

window.gamedata = {   // основные данные игры
  user1: {
    id: 3000,
    name: 'pro100gamer'
  },
  user2: {
    id: 5000,
    name: 'nagibatelb'
  },
  maphexbuttons: [],   // maphexbuttons[x][y] = button
  mapObjects: {  // данные карты игры (нужны для очистки/пересоздания карты)
    buttons: [],
    text: [],
  }, 
}
