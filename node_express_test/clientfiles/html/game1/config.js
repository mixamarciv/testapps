
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
  gameMap: {
    loadType: 2,  //0 - buttons, 1 - objects, 2 - obj+text
    cntX: 12,    // 8
    cntY: 30,   // 20
    scale: 1,   // 50x50 загружаются за 1,6сек
                // 20x20 - 50-100мс (тел 300мс) теперь 400мс (тел200мс)
  },
  gameMenu: {
    loadType: 1,  //0 - buttons, 1 - objects
    screenHSize: 0.07,   // какую часть экрана будет занимать
  }
}

GOptions.width  = 600;
GOptions.height = 800;

{//определяем размер перед загрузкой  89125552202 9121283621
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
  baseURL: 'clientfiles/html/img/hex4',
  hexsprite: {
    path: '/hexsprite.png',
    sprites: {
      scaleMin: 0.97,
      scaleMax: 1.03,
      scaleMaxVal: 10,
      neutral: 0,
      user1: 1,
      //active1: 1,
      user2: 2,
      //active2: 4,
    },
    size: 64  //20  64
  }
}

window.gamedata = {   // основные данные игры
  status: {
    text: '',      // строка статуса используется для вывода в update_status()
    cntuser1: 0,   // количество захваченных хексов у игрока1
    cntuser2: 0,
    turnuser: 'user1',     // кто сейчас ходит ['user1','user2']
    turntype: 'move',      // тип хода ['move','inc','wait']
  },
  time: {

  },
  menu: {
    mainBtn: null,
    mainText: null,
    statusText: null,
    settingsBtn: null,
    msgText1: null,
    msgText2: null,
    msgText3: null,
  },
  user1: {
    id: 3000,
    name: 'pro100gamer'
  },
  user2: {
    id: 5000,
    name: 'nagibatelb'
  },
  maphexbuttons: [],   // maphexbuttons[x][y] = gd button
  mapObjects: {  // данные карты игры (нужны для очистки/пересоздания карты)
    gdlist: [],  // данные по объектам  {x:1,y:4,val:8,owner:user1,button:->,text:->}
    gdmap: {},   // gd[id]    
  }, 
  mapsize: {
    cntX: 0,   // количество уже созданных объектов
    cntY: 0,  
    width: GOptions.width,
    height: GOptions.height,
  }
}


