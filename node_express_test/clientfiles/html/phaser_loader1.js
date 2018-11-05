console.clear();

var images = [
  '32x32.png',
  '50x50.png',
  '128x128.png',
  'a.png',
  'advanced_wars_land.png',
  'advanced_wars_tank.png',
  'aqua_ball.png',
  'arrow.png',
  'arrows.png',
  'asteroids_ship_white.png',
  'asteroids_ship.png',
  'asuna_by_vali233.png',
  'atari130xe.png',
  'atari400.png',
  'atari800.png',
  'atari800xl.png',
  'atari1200xl.png',
  'atlas_array_no_trim.png',
  'atlas_array_trim.png',
  'atlas_hash_no_trim.png',
  'atlas_hash_trim.png',
  'atlas_rotated.png',
  'atlas_with_font.png',
  'atlas-mixed-rotated.png',
  'atlas-mixed.png',
  'b.png',
  'baddie_cat_1.png',
  'balls.png',
  'beball1.png',
  'bikkuriman.png',
  'block.png',
  'blue_ball.png',
  'bluemetal_32x32x4.png',
  'boom32wh12.png',
  'bsquadron1.png',
  'bsquadron2.png',
  'bsquadron3.png',
  'budbrain_chick.png',
  'bullet.png',
  'bunny.png',
  'car.png',
  'car90.png',
  'cards80x112.png',
  'carrot.png',
  'centroid.png',
  'chain.png',
  'chick.png',
  'chunk.png',
  'clown.png',
  'coin.png',
  'cokecan.png',
  'copy-that-floppy.png',
  'darkwing_crazy.png',
  'default.png',
  'diamond.png',
  'diamonds32x5.png',
  'diamonds32x24x5.png',
  'digger.png',
  'dragon_atlas.png',
  'eggplant.png',
  'enemy-bullet.png',
  'exocet_spaceman.png',
  'explosion.png',
  'firstaid.png',
  'flectrum.png',
  'flectrum2.png',
  'fruitnveg32wh37.png',
  'fruitnveg64wh37.png',
  'gameboy_seize_color_40x60.png',
  'gem.png',
  'green_ball.png',
  'healthbar.png',
  'helix.png',
  'hello.png',
  'hotdog.png',
  'humstar.png',
  'ilkke.png',
  'interference_ball_48x48.png',
  'interference_tunnel.png',
  'invaderpig.png',
  'jets.png',
  'kirito_by_vali233.png',
  'lemming.png',
  'longarrow-white.png',
  'longarrow.png',
  'longarrow2.png',
  'loop.png',
  'maggot.png',
  'mana_card.png',
  'master.png',
  'melon.png',
  'metalface78x92.png',
  'metalslug_monster39x40.png',
  'metalslug_mummy37x45.png',
  'mouse_jim_sachs.png',
  'mushroom.png',
  'mushroom2.png',
  'octopus.png',
  'onion.png',
  'orb-blue.png',
  'orb-green.png',
  'orb-red.png',
  'oz_pov_melting_disk.png',
  'p2.jpeg',
  'pacman_by_oz_28x28.png',
  'pangball.png',
  'parsec.png',
  'particle1.png',
  'pepper.png',
  'phaser_tiny.png',
  'phaser-dude.png',
  'phaser-ship.png',
  'phaser.png',
  'phaser1.png',
  'phaser2.png',
  'phaser3-test1.png',
  'pineapple.png',
  'pixi_monsters.png',
  'plane.png',
  'platform.png',
  'player.png',
  'purple_ball.png',
  'pwr2.png',
  'ra_dont_crack_under_pressure.png',
  'rain.png',
  'red_ball.png',
  'rgblaser.png',
  'running_bot.png',
  'saw.png',
  'seacreatures_json.png',
  'seacreatures.png',
  'shinyball.png',
  'ship.png',
  'shmup-baddie-bullet.png',
  'shmup-baddie.png',
  'shmup-baddie2.png',
  'shmup-baddie3.png',
  'shmup-boom.png',
  'shmup-bullet.png',
  'shmup-ship.png',
  'shmup-ship2.png',
  'shoebot.png',
  'shoebox.png',
  'slime.png',
  'slimeeyes.png',
  'snake.png',
  'snowflakes_large.png',
  'snowflakes.png',
  'sonic_havok_sanity.png',
  'soundtracker.png',
  'space-baddie-purple.png',
  'space-baddie.png',
  'spaceman.png',
  'speakers.png',
  'spinObj_01.png',
  'spinObj_02.png',
  'spinObj_03.png',
  'spinObj_04.png',
  'spinObj_05.png',
  'spinObj_06.png',
  'spinObj_07.png',
  'spinObj_08.png',
  'splat.png',
  'stormlord-dragon96x64.png',
  'tetrisblock1.png',
  'tetrisblock2.png',
  'tetrisblock3.png',
  'thrust_ship.png',
  'thrust_ship2.png',
  'tinycar.png',
  'tomato.png',
  'treasure_trap.png',
  'ts-trim.png',
  'tstrim.png',
  'ufo.png',
  'vu.png',
  'wabbit.png',
  'wasp.png',
  'waters.png',
  'wizball.png',
  'x.png',
  'xenon2_bomb.png',
  'xenon2_ship.png',
  'yellow_ball.png',
  'zelda-hearts.png',
  'zelda-life.png',
];

var colors = window.colors;


window.game = new Phaser.Game({
  height: 400,
  renderer: Phaser.CANVAS,
  width: 1300,
  state: {
    init: function() {
      var debug = this.game.debug;
      debug.lineHeight = 20;
      debug.font = '16px monospace';
    },

    preload: function() {
      console.log('preload');
      this.load.maxParallelDownloads = 6;
      this.load.baseURL = 'https://cdn.jsdelivr.net/gh/samme/phaser-examples-assets@v1.0.0/sprites/';
      this.load.crossOrigin = 'anonymous';
      this.load.images(images, images);
      this.load.resetLocked = true;
      this.monitorLoader(this.load);
    },

    loadRender: function() {
      this.game.debug.loader(this.game.load, 20, 20, '#f55');
      if (this.extraLoader) {
        this.game.debug.loader(this.extraLoader, 420, 20, '#5f5');
      }
    },

    create: function() {
      console.log('create');
      this.extraLoader = new Phaser.Loader(this.game);
      this.extraLoader.baseURL = 'https://cdn.jsdelivr.net/gh/samme/phaser-examples-assets@v1.0.0/';
      this.extraLoader.image('sky', 'skies/sky1.png');
      this.monitorLoader(this.extraLoader);
      this.extraLoader.resetLocked = true;
      this.extraLoader.start();
      images.forEach(function (imageKey) {
        this.add.image(0, 0, imageKey);
      }, this);
      this.world.align(1, 200, 5, 5);
    },

    update: function() {
    },

    render: function() {
      var debug = this.game.debug;
      this.loadRender();
      debug.phaser(10, 580);

      debug.inputInfo(20, 20, colors.lime);
      debug.pointer(this.input.activePointer, colors.aqua);
      debug.device(420, 20, colors.aqua);
      debug.phaser(10, 580, colors.gray);
    },



    monitorLoader: function(loader) {
      loader.onLoadStart   .add(function ()              { console.log(    'start'             ); });
      loader.onLoadStart   .add(function ()              { console.time(   'load complete'     ); });
      loader.onLoadComplete.add(function ()              { console.log(    'complete'          ); });
      loader.onLoadComplete.add(function ()              { console.timeEnd('load complete'     ); });
      loader.onPackComplete.add(function (          key) { console.log(    'pack complete', key); });
      loader.onFileComplete.add(function (progress, key) { console.log(    'file complete', key); });
      loader.onFileStart   .add(function (progress, key) { console.log(    'file started' , key); });
    },

  }
});
