var game;
var player;
var gameWidth = 384;
var gameHeight = 224;
var bg_1;
var bg_2;
var bg_3;
var globalMap;
var jumpingFlag;
var crouchFlag = false;
var music;
var titleMusic;
var audioJump
var audioCoin
var stompAudio
var deadAudio
var score = 0
var scoreText
var bossLives = -1;

window.onload = function() {
  game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, "");
  game.state.add("Boot", boot);
  game.state.add("Preload", preload);
  game.state.add("TitleScreen", titleScreen);
  game.state.add("GameOver", gameOver);
  game.state.add("PlayGame", playGame);
  game.state.add("PlayGame2",playGame2)
  //
  game.state.start("Boot");
};
var boot = function(game) {};
boot.prototype = {
  preload: function() {
    this.game.load.image("loading", "assets/sprites/loading.png");
  },
  create: function() {
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.renderer.renderSession.roundPixels = true;
    this.game.state.start("Preload");
  }
};
var preload = function(game) {};
preload.prototype = {
  preload: function() {
    var loadingBar = this.add.sprite(
      game.width / 2,
      game.height / 2,
      "loading"
    );
    loadingBar.anchor.setTo(0.5);
    game.load.setPreloadSprite(loadingBar);
    // load title screen
    game.load.image("title", "assets/sprites/title-screen.png");
    game.load.image("enter", "assets/sprites/press-enter-text.png");
    //game.load.image("instructions", "assets/sprites/instructions.png");
    game.load.image("game-over", "assets/sprites/game-over.png");
    // environment
    game.load.image("bg-1", "assets/environment/bg-1.png");
    game.load.image("bg-2", "assets/environment/bg-2.png");
    
    // tileset


    // audio
    game.load.audio("music", [
      "assets/sounds/Maxime Abbey - Super Mario Bros. - Underground Theme (Remix).ogg"
    ]);
    game.load.audio("titleMusic", ["assets/sounds/titleMusic.ogg"]);
    game.load.audio('jump', ['assets/sounds/Mario-jump-sound.mp3']);
    game.load.audio('coin', ['assets/sounds/Mario-coin-sound.mp3']);
    game.load.audio('stomp', ['assets/sounds/smb_stomp.wav']);
    game.load.audio('dead', ['assets/sounds/smb_mariodie.wav'])
    game.load.audio('complete', ['assets/sounds/complete.mp3'])

    game.load.spritesheet(
      "tiles",
      "assets/maps/tiles_dctsfk.png",
      16,
      16
    );

    game.load.spritesheet(
      "tiles2",
      "assets/maps/Overworld.png",
      16,
      16,
    )

    game.load.spritesheet(
      "goomba",
      "assets/maps/goomba_nmbtds.png",
      16,
      16
    );
    game.load.spritesheet(
      "goomba_boss",
      "assets/maps/goomba_nmbtds.png",
      16,
      16
    );
    game.load.spritesheet(
      "mario",
      "assets/maps/mario_wjlfy5.png",
      16,
      16
    );
    game.load.spritesheet(
      "coin",
      "assets/maps/coin_iormvy.png",
      16,
      16
    );

    game.load.tilemap(
      "level",
      "assets/maps/map.json",
      null,
      Phaser.Tilemap.TILED_JSON
    );

    game.load.tilemap(
      "level2",
      "assets/maps/map2.json",
      null,
      Phaser.Tilemap.TILED_JSON
    )

  },
  create: function() {
    //this.game.state.start('PlayGame');
    this.game.state.start("TitleScreen");
  }
};
var titleScreen = function(game) {};
titleScreen.prototype = {
  create: function() {
    bg_1 = game.add.tileSprite(0, 0, gameWidth, gameHeight, "bg-1");
    bg_2 = game.add.tileSprite(0, 0, gameWidth, gameHeight, "bg-2");
    this.title = game.add.image(gameWidth / 2, 100, "title");
    this.title.anchor.setTo(0.5);
    this.pressEnter = game.add.image(game.width / 2, game.height - 60, "enter");
    this.pressEnter.anchor.setTo(0.5);
    game.time.events.loop(700, this.blinkText, this);
    var startKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    startKey.onDown.add(this.startGame, this);
    titleMusic = game.add.audio("titleMusic");
    titleMusic.loop = true;
    titleMusic.play();
    this.state = 1;
  },
  blinkText: function() {
    if (this.pressEnter.alpha) {
      this.pressEnter.alpha = 0;
    } else {
      this.pressEnter.alpha = 1;
    }
  },
  update: function() {
    bg_2.tilePosition.x -= 0.2;
  },
  startGame: function() {
    // if (this.state == 1) {
    //   this.state = 2;
    //   this.title2 = game.add.image(game.width / 2, 40, "instructions");
    //   this.title2.anchor.setTo(0.5, 0);
    //   this.title.destroy();
    // } else {
      this.title.destroy();
       this.state = 2;
      this.game.state.start("PlayGame");
    //}
  }
};

var gameOver = function(game) {};
gameOver.prototype = {
  create: function() {
    bg_1 = game.add.tileSprite(0, 0, gameWidth, gameHeight, "bg-1");
    bg_2 = game.add.tileSprite(0, 0, gameWidth, gameHeight, "bg-2");
    this.title = game.add.image(game.width / 2, 90, "game-over");
    this.title.anchor.setTo(0.5);
    var credits = game.add.image(gameWidth / 2, game.height - 12, "credits");
    credits.anchor.setTo(0.5);
    this.pressEnter = game.add.image(game.width / 2, game.height - 60, "enter");
    this.pressEnter.anchor.setTo(0.5);
    game.time.events.loop(700, this.blinkText, this);
    var startKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    startKey.onDown.add(this.startGame, this);
    this.state = 2;
  },
  blinkText: function() {
    if (this.pressEnter.alpha) {
      this.pressEnter.alpha = 0;
    } else {
      this.pressEnter.alpha = 1;
    }
  },
  update: function() {
    bg_2.tilePosition.x -= 0.2;
  },
  startGame: function() {
    if (this.state == 1) {
      this.state = 2;
      this.title2 = game.add.image(game.width / 2, 40, "game-over");
      this.title2.anchor.setTo(0.5, 0);
      this.title.destroy();
    } else {
      this.game.state.start("PlayGame");
    }
  }
};

var playGame = function(game) {};
playGame.prototype = {
  create: function() {
    this.startAudios();
    Phaser.Canvas.setImageRenderingCrisp(game.canvas);
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = "#5c94fc";
    texts = game.add.group();

    scoreText = game.add.text( 10 ,10,"0",{ font: "18px Arial", fill: "#ffffff", align: "left" });
    texts.add(scoreText)
    game.world.bringToTop(texts)

    scoreText.fixedToCamera = true;

    map = game.add.tilemap("level");
    map.addTilesetImage("tiles", "tiles");
    map.setCollisionBetween(3, 12, true, "solid");

    map.createLayer("background");

    layer = map.createLayer("solid");
    layer.resizeWorld();

    coins = game.add.group();
    coins.enableBody = true;
    map.createFromTiles(2, null, "coin", "stuff", coins);
    coins.callAll(
      "animations.add",
      "animations",
      "spin",
      [0, 0, 1, 2],
      3,
      true
    );
    coins.callAll("animations.play", "animations", "spin");

    goombas = game.add.group();
    goombas.enableBody = true;
    map.createFromTiles(1, null, "goomba", "stuff", goombas);
    goombas.callAll("animations.add", "animations", "walk", [0, 1], 2, true);
    goombas.callAll("animations.play", "animations", "walk");
    goombas.setAll("body.bounce.x", 1);
    goombas.setAll("body.velocity.x", -20);
    goombas.setAll("body.gravity.y", 500);

    player = game.add.sprite(16, game.world.height - 48, "mario");
    game.physics.arcade.enable(player);
    player.body.gravity.y = 370;
    player.body.collideWorldBounds = true;
    player.animations.add("walkRight", [1, 2, 3], 10, true);
    player.animations.add("walkLeft", [8, 9, 10], 10, true);
    player.goesRight = true;

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
  },

  startAudios: function() {
    // audios
    // sound effects
    this.audioJump = game.add.audio("jump")
    coinAudio = game.add.audio("coin")
    stompAudio = game.add.audio("stomp")
    deadAudio = game.add.audio("dead")
    // stop title music
    titleMusic.stop();

    //music
    music = game.add.audio("music");
    music.loop = true;
    music.play();
  },

  update: function() {
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(goombas, layer);
    game.physics.arcade.overlap(player, goombas, goombaOverlap);
    game.physics.arcade.overlap(player, coins, coinOverlap);

    console.log("pos x",player.position.x)
    console.log("pos y",player.position.y)
    console.log("Cursor",cursors)

    if (player.body.enable) {
      player.body.velocity.x = 0;
      if (cursors.left.isDown) {
        player.body.velocity.x = -90;
        player.animations.play("walkLeft");
        player.goesRight = false;
      } else if (cursors.right.isDown) {
        player.body.velocity.x = 90;
        player.animations.play("walkRight");
        player.goesRight = true;
      } else {
        player.animations.stop();
        if (player.goesRight) player.frame = 0;
        else player.frame = 7;
      }

      if (cursors.up.isDown && player.body.onFloor()) {
        player.body.velocity.y = -190;
        player.animations.stop();
        this.audioJump.play();
      }

      if (player.body.velocity.y != 0) {
        if (player.goesRight) player.frame = 5;
        else player.frame = 12;
      }
    }

    if(player.position.x >= 3024.5 &&
      player.position.x <= 3044.5
      && player.position.y === 144 && 
      cursors.down.isDown) {
        player.body.enable = false;
        
        let downPlayer = setInterval(() => {
          player.y += 2;
          if(player.y > 240){
            clearInterval(downPlayer)
          }
        },200)



        this.game.state.start("PlayGame2")
      }
  }
};

var playGame2 = function(game) {};
playGame2.prototype = {
  create: function() {
    console.log("Started second phase")
    this.startAudios();
    score = 0;
    Phaser.Canvas.setImageRenderingCrisp(game.canvas);
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = "#0a1323";
    texts = game.add.group();

    scoreText = game.add.text( 10 ,10,"0",{ font: "18px Arial", fill: "#ffffff", align: "left" });
    texts.add(scoreText)
    game.world.bringToTop(texts)

    scoreText.fixedToCamera = true;

    map = game.add.tilemap("level");
    map.addTilesetImage("tiles", "tiles");
    map.setCollisionBetween(3, 12, true, "solid");

    map.createLayer("background");

    layer = map.createLayer("solid");
    layer.resizeWorld();

    boss = game.add.sprite(350,game.world.height - 16*3 ,'goomba_boss')
    
    game.physics.arcade.enable(boss);

    boss.animations.add('walk',[0,1],2,true)
    boss.animations.play('walk')
    
    console.log(boss)
    
    boss.body.bounce.x = 1
    boss.body.velocity.x = -60;
    boss.body.gravity.y = 1000

    //goombas.callAll("animations.add", "animations", "walk", [0, 1], 2, true);
    //goombas.callAll("animations.play", "animations", "walk");
    //goombas.setAll("body.bounce.x", 1);
   // goombas.setAll("body.velocity.x", -20);
    //goombas.setAll("body.gravity.y", 500);


    player = game.add.sprite(16, game.world.height - 48, "mario");
    game.physics.arcade.enable(player);
    player.body.gravity.y = 370;
    player.body.collideWorldBounds = true;
    player.animations.add("walkRight", [1, 2, 3], 10, true);
    player.animations.add("walkLeft", [8, 9, 10], 10, true);
    player.goesRight = true;

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
  },

  startAudios: function() {
    // audios
    // sound effects
    this.audioJump = game.add.audio("jump")
    coinAudio = game.add.audio("coin")
    stompAudio = game.add.audio("stomp")
    deadAudio = game.add.audio("dead")
    completeAudio = game.add.audio("complete")
    // stop title music
    titleMusic.stop();

    //music
    music = game.add.audio("music");
    music.loop = true;
    music.play();
  },

  update: function() {
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(boss, layer);
    game.physics.arcade.overlap(player, boss, bossOverlap);
    
    if (player.body.enable) {
      player.body.velocity.x = 0;
      if (cursors.left.isDown) {
        player.body.velocity.x = -90;
        player.animations.play("walkLeft");
        player.goesRight = false;
      } else if (cursors.right.isDown) {
        player.body.velocity.x = 90;
        player.animations.play("walkRight");
        player.goesRight = true;
      } else {
        player.animations.stop();
        if (player.goesRight) player.frame = 0;
        else player.frame = 7;
      }

      if (cursors.up.isDown && player.body.onFloor()) {
        player.body.velocity.y = -190;
        player.animations.stop();
        this.audioJump.play();
      }

      if (player.body.velocity.y != 0) {
        if (player.goesRight) player.frame = 5;
        else player.frame = 12;
      }
    }

    if(player.position.x >= 3024.5 &&
      player.position.x <= 3044.5
      && player.position.y === 144 && 
      cursors.down.isDown) {
        player.body.enable = false;
        
        let downPlayer = setInterval(() => {
          player.y += 2;
          if(player.y > 240){
            clearInterval(downPlayer)
          }
        },200)

        if(player.y > 240){
          game.state.start("PlayGame2")
        }
      }
  }
}; 

function coinOverlap(player, coin) {
  coin.kill();
  score += 1;
  scoreText.text = score;
  coinAudio.play();
}

function goombaOverlap(player, goomba) {
  if (player.body.touching.down) {
    stompAudio.play();
    goomba.animations.stop();
    goomba.frame = 2;
    goomba.body.enable = false;
    player.body.velocity.y = -80;
    game.time.events.add(Phaser.Timer.SECOND, function() {
      goomba.kill();      
    });
  } else {
    deadAudio.play();
    player.frame = 6;
    player.body.enable = false;
    player.animations.stop();
    game.time.events.add(Phaser.Timer.SECOND * 3, function() {
      game.paused = true;
    });
    setTimeout(() => {
         game.state.start("PlayGame");
         game.paused = false;
         player.body.enaled = true;
         
         let downPlayer = setInterval(() => {
          player.y += 2;
          if(player.y > 240){
            clearInterval(downPlayer)
          }
        },200)

    },1000)
  }
}

function bossOverlap(player,boss){
  console.log("ppp",player.body.touching)
  if (player.body.touching.down) {
    stompAudio.play(); 
    player.body.velocity.y = -80;
    if(bossLives < 0){
      
      boss.kill();      
      var text = game.add.text(320 ,80, "YOU WIN",{ font: "18px Arial", fill: "#ffffff", align: "left" });
      music.stop();
      completeAudio.play();
      text.anchor.setTo(0.5);
      setTimeout(() => {
        game.state.start("TitleScreen")
        console.log("called")
      },3000)   
        
      
    } else {
      bossLives--
      console.log(boss)
      boss.tint = 0xff0000;
      setTimeout(() => {
        boss.tint = 16777215
      },100)

    }
  
  } else {
    deadAudio.play();
    player.frame = 6;
    player.body.enable = false;
    player.animations.stop();
    game.time.events.add(Phaser.Timer.SECOND * 3, function() {
      game.paused = true;
    });
    setTimeout(() => {
         game.state.start("PlayGame");
         game.paused = false;
         player.body.enaled = true;
         
         let downPlayer = setInterval(() => {
          player.y += 2;
          if(player.y > 240){
            clearInterval(downPlayer)
          }
        },200)

    },1000)
  }
}