
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
    cntX: 20,   //12 должно быть четное!
    cntY: 20,  //30 должно быть четное!
    scale: 1,   // 50x50 загружаются за 1,6сек
                // 20x20 - 50-100мс (тел 300мс) теперь 400мс (тел200мс)
  },
  gameMenu: {
    loadType: 1,  //0 - buttons, 1 - objects
    screenHSize: 0.07,   // какую часть экрана будет занимать
  },
  turnSleep: 50,

  inputTimeoutInc: 200,            //минимальное время нажатия за которое переключаемся в hexClick(lastClickHex_gd.bntobj)
  minDistanceToMoveWithoutInc: 30  //минимальная дистанция на которую нужно переместить 
                                   //камеру за inputTimeoutInc что бы не переключиться в hexClick(lastClickHex_gd.bntobj)
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
      scaleMin: 0.80,  // 0.80
      scaleMax: 1.05,  // 1.05
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
    //cntuser1cansend: 0, // количество силы у игрока1 которую он может раздать
    cntuser2: 0,
    //cntuser2cansend: 0, // количество силы у игрока2 которую он может раздать
    turnuser: null,   // кто сейчас ходит [gamedata.user1,gamedata.user2]
    turntype: 'move',      // тип хода ['move','inc','wait']
  },
  timeload: {

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
    name: 'pro100gamer',
    cansend: 0, // количество силы у игрока1 которую он может раздать
  },
  user2: {
    id: 5000,
    name: 'nagibatelb',
    cansend: 0, // количество силы у игрока2 которую он может раздать
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
  },
  lastClickHex_gd: null, // по какому объекту последний раз нажимали
  activeuser1btn: null,
  activeuser2btn: null,
  mainuser1btn_id: null,
  mainuser2btn_id: null,
}


