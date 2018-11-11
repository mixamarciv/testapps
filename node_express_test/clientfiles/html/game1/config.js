
var GOptions = {
  width: window.screen.availWidth,
  height: window.screen.availHeight,
}

GOptions.width  = 600;
GOptions.height = 800;

window.GOptions = GOptions;


GOptions.images = {
  baseURL: '/clientfiles/html/img/hex1',
  hexsprite: {
    path: '/hexsprite.png',
    sprites: {
      neutral: 2,
      user1: 0,
      active1: 1,
      user2: 3,
      active2: 4,
    },
    size: 128
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
  maphexbuttons: []   // maphexbuttons[x][y] = button
}
