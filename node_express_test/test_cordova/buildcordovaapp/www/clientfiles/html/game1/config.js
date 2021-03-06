
var GOptions = {
  debug: {
    debug_total: 0,
    gametouch: 0,
    fps: 1,
    pixel_ratio: 1,
    create_map_time: 1,
    map_info: 1,
    debugObj_info: 0,
    movePointer_info: 0,
    IncTap_info: 0,

    cameraInfo: 0,
    inputInfo: 0,
    device: 0,
    body: 0,

    loader: 0,
    userMoveHex: 0,   // пишем лог перемещения по клеткам
    showHexInfo: 0,    // выводим позиции клеток внутри хексов
    showClearMapInfo: 0, // выводить информацию по очистке карты
  },
  fullScreen: 1,
  width: window.screen.availWidth,
  height: window.screen.availHeight,
  gameMap: {
    startWorldScale: 0.85,
    loadType: 2,  //0 - buttons, 1 - objects, 2 - obj+text
    cntX: 20,     //12 должно быть четное!
    cntY: 20,     //30 должно быть четное!
    scale: 1,     // 50x50 загружаются за 1,6сек
                  // 20x20 - 50-100мс (тел 300мс) теперь 400мс (тел200мс)
  },
  gameMenu: {
    loadType: 1,  //0 - buttons, 1 - objects
    screenHSize: 0.07,   // какую часть экрана будет занимать
  },
  turnSleep: 50, 
  inputTimeoutInc: 100,            //минимальное время нажатия за которое переключаемся в hexClick(lastClickHex_gd.bntobj)
  minDistanceToMoveWithoutInc: 30, //минимальная дистанция на которую нужно переместить 
                                   //камеру за inputTimeoutInc что бы не переключиться в hexClick(lastClickHex_gd.bntobj)

  user: {
    id: -1,
    uuid: '',
    name: 'anonim',
    pass: '',
    email: '',
    datecreate: date_to_str_format('YMD-hms'),   // время первого запуска игры! (сохраняем это значение)
    uinfo: {},
  },

  net: {  // параметры сетевой игры
    id: 0,
    user1: {},  // данные юзера - автора игры
    user2: {},  
    turnUserid: 0, // юзер который сейчас ходит
    cntmove: 0, // количество перемещений
    cntinc: 0,  //
    cntturn: 0, // количество завершенных ходов
    mapsize: {x:0,y:0},  // размер карты
    mapdata: [], //данные карты
  },

  server: '192.168.0.245:81',
  serverTimeOut: 25 * 1000,         // таймаут после которого возвращаем ошибку

  lastGame: {  // последняя запущенная игра
    gameType: 'localGame or netGame or null',
    id: 0,  // id сетевой игры если была игра
  },
}

GOptions.checkUser = function(u){
  if(u && (u.id>0 || u.id==-1) && u.name!=''){
    return 1;
  }
  return 0;
}

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


GOptions.localStorage_load = function(){
  var opt_set = this._opt_set_data_if_exists;
  var opt = localStorage.getItem('GOptions');
  if(!opt) return;
  opt = JSON.parse(opt);
  if(!opt) return;
  this.turnSleep = opt.turnSleep;
  this.lastGame  = opt_set(this.lastGame,opt.lastGame);
  this.debug     = opt_set(this.debug  ,opt.debug);
  //console.log(this.gameMap.startWorldScale+' LOAD ->'+opt.gameMap.startWorldScale);
  this.gameMap   = opt_set(this.gameMap,opt.gameMap);
  this.user      = opt_set(this.user,opt.user);
  this.net       = opt_set(this.net, opt.net);
  if(this.user.id==-1) this.user.id = getRandomInt(10000, 1000*1000*1000*2000);
}

GOptions.localStorage_save = function(){
  game_prepare_to_save_options();
  const opt_copy = this._opt_copy_data;
  var opt = {
    net: opt_copy(window.GOptions.net, {}),
    user: opt_copy(window.GOptions.user, {}),
    debug: opt_copy(window.GOptions.debug, {}),
    gameMap: opt_copy(window.GOptions.gameMap, {}),
    lastGame: opt_copy(window.GOptions.lastGame, {}),
    turnSleep: window.GOptions.turnSleep,
  };
  //console.log(this.gameMap.startWorldScale+' SAVE ->'+opt.gameMap.startWorldScale);
  opt = JSON.stringify(opt);
  localStorage.setItem('GOptions',opt);
}

//копирует из одного массива в другой
GOptions._opt_copy_data = function(from,to){
  for(var key in from){
    to[key] = from[key]
  }
  return to;
}

GOptions.copy_object1lvl = GOptions._opt_copy_data

//устанавливает значение в объекте to из обьекта from (если и там и там эти значения ещё есть)
GOptions._opt_set_data_if_exists = function(to,from){
  for(var key in from){
    if(from[key] != undefined && to[key] != undefined) to[key] = from[key];
  }
  return to;
}

var gamedata = {   // основные данные игры
  gameType: 'localGame or netGame',
  changeUser:  {1:1, 2:2}, // номера юзеров для сетевой игры, кто с кем меняется
                           // {1:1, 2:2} - если мы создали игру
                           // {1:2, 2:1} - если мы подключились к созданной игре       
  status: {
    id: 0,         // id матча при сетевой игре
    turnn: 0,      // номер хода
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
  user1: {      // игрок1 это всегда текущий игрок!!
    id: 3000,   //  (для сетевой игры они меняются местами и данные 
                //     отправляются на сервер)
    name: 'anonim',
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


