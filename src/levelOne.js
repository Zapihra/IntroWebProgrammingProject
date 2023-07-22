import Phaser from "phaser";

import ground from "./assets/platform.png";
import player from "./assets/character.png";
import coin from "./assets/coin.png"
import bCoin from "./assets/coinblue.png"
import spike from "./assets/spike.png"
import heartPix from "./assets/heartPix.png"
import breaking from "./assets/breaking.png"
import jump from "./audio/jump.mp3"
import shoot from "./audio/shoot.mp3"
import bre from "./audio/breaking.mp3"
import coinS from "./audio/coin.mp3"
//https://stackoverflow.com/questions/66878947/image-is-not-getting-added-to-the-scene-phaser-3-5
// having the pictures show in the web browser


const gameOptions = {
    dudeGravity: 800,
    dudeSpeed: 300
}

export default class LevelOne extends Phaser.Scene {
    
    //game = new Phaser.Game(gameConfig);

    constructor() {
      super({ key: "LevelOne"});
      this.score = 0;
      this.heart = 3;
      this.level = 1;
    }
  
    preload() {
      
      this.load.image("ground", ground);
      this.load.image("coin", coin);
      this.load.image("blue", bCoin);
      this.load.image("spike", spike);
      this.load.image("heart", heartPix);
      this.load.image("break", breaking);
      this.load.audio("jump", jump);
      this.load.audio("shoot", shoot);
      this.load.audio("bre", bre);
      this.load.audio("coinS", coinS);
      this.load.spritesheet("player", player, 
      {frameWidth: 32, frameHeight: 48});
      this.cameras.main.setBackgroundColor("#336633");
      //coin from https://clipground.com/pics/get
      //blue coin just colored to blue
      // heart from https://pixabay.com/fi/illustrations/pixel-syd%C3%A4n-syd%C3%A4n-pikseli%C3%A4-symboli-2779422/
      //spikes were made by me

      // audio from openGameArt.org
      // help to add audio https://www.youtube.com/watch?v=COncYQLGJS8&ab_channel=LuisZuno
    }
  
    create() {
      this.count = 0;
      this.jumpSound = this.sound.add("jump");
      this.breakSound = this.sound.add("bre");
      this.coinSound = this.sound.add("coinS");
      
      this.groundGroup = this.physics.add.group({
        immovable: true,
        allowGravity: false
      })
      let coin2 = this.add.image(16, 16,"coin");
      coin2.setScale(0.08);
      let hearted = this.add.image(16, 48, "heart");
      hearted.setScale(0.05)
  
      for (let i = 0; i < 20; i++) {
        this.groundGroup.create(Phaser.Math.Between(0, 
          this.game.config.width), Phaser.Math.Between(0, 
            this.game.config.height), "ground");
      }
      this.player = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height /2, "player");
      this.player.body.gravity.y = gameOptions.dudeGravity;
      this.physics.add.collider(this.player, this.groundGroup);
  
      this.coinGroup = this.physics.add.group({});
      this.physics.add.collider(this.coinGroup, this.groundGroup);
  
      this.bCoinGroup = this.physics.add.group({});
      this.spikes = this.physics.add.group({});
      this.physics.add.collider(this.spikes, this.groundGroup);
      
      this.breakGroup = this.physics.add.group({});
      this.breakGroup = this.physics.add.group({
        immovable: true,
        allowGravity: true
      })
      this.physics.add.collider(this.breakGroup, this.coinGroupGroup);

      this.physics.add.overlap(this.player, this.breakGroup, 
        this.breaksGround, null, this);
        this.physics.add.collider(this.breakGroup, this.player);

      this.physics.add.overlap(this.player, this.coinGroup, 
        this.collectCoin, null, this);
  
      this.physics.add.overlap(this.player, this.bCoinGroup, 
        this.collectCoinBlue, null, this);
  
        this.physics.add.overlap(this.player, this.spikes, 
          this.spikesHurt, null, this);
  
      this.scoreText = this.add.text(32, 2, "0", {fontSize: "30px", fill: "#ffffff"})
      this.heartText = this.add.text(32, 35, "3", {fontSize: "30px", fill: "#ffffff"})
  
      this.level = this.add.text(5, 70, "lvl: 1", {fontSize: "25px", fill: "#ffffff"});
      this.cursors = this.input.keyboard.createCursorKeys();
  
      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("player", 
        {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
      })
  
      this.anims.create({
        key: "turn",
        frames: [{key: "player", frame: 4}],
        frameRate: 10,
      })
  
      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("player", 
        {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1
      })
  
      this.triggerTimer = this.time.addEvent({
        callback: this.addGround,
        callbackScope: this,
        delay: 700,
        loop: true
      })
  
    }
    
  
    addGround() {
      //console.log("adding stuff");
      this.groundGroup.create(Phaser.Math.Between(0, 
        this.game.config.width), 0, "ground");
      this.groundGroup.setVelocityY(gameOptions.dudeSpeed / 6);
        
      if(Phaser.Math.Between(0,1)) {
        let coins = this.coinGroup.create(Phaser.Math.Between(0, 
          this.game.config.width), 0, "coin");
        coins.setScale(0.08);
  
        this.coinGroup.setVelocityY(gameOptions.dudeGravity);
      }

      if(Phaser.Math.Between(0,1)) {
        this.breakGroup.create(Phaser.Math.Between(0, 
          this.game.config.width), Phaser.Math.Between(100, 
            400), "break");
          this.breakGroup.setVelocityY(gameOptions.dudeSpeed / 6);
      }
      
      if(Phaser.Math.Between(0,0.3)) {
        let coins = this.bCoinGroup.create(Phaser.Math.Between(0, 
          this.game.config.width), Phaser.Math.Between(100, 
            400), "blue");
        coins.setScale(0.08);
      }
  
      if(Phaser.Math.Between(0,0.2)) {
        this.spikes.create(Phaser.Math.Between(0, 
          this.game.config.width), Phaser.Math.Between(100, 
            300), "spike");
        this.spikes.setVelocityY(gameOptions.dudeGravity /10)
      }
    }


    //timer https://phaser.discourse.group/t/delayed-events-problem/3121
    breaksGround(player, breaks) {
      
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.fall(breaks)
        },
        loop: false
      })
    }
    
    fall(breaks) {
      
      breaks.disableBody(true, true);
      if(this.count == 0) {
        this.count = 1;
        this.breakSound.play();
        this.time.addEvent({delay: 500, callback: () => {this.count = 0}, loop: false})
      }
    }
  
    spikesHurt(player, spikes) {
      spikes.disableBody(false, true);
      this.heart -= 1;
      this.heartText.setText(this.heart)
    }
  
    collectCoin(player, coins) {
      coins.disableBody(true, true);
      this.coinSound.play();
      this.score += 1
      this.scoreText.setText(this.score);
    }
  
    collectCoinBlue(player, coinsb) {
      coinsb.disableBody(true, true);
      this.coinSound.play();
      this.score += 2
      this.scoreText.setText(this.score);
    }
  
    update() {
      if(this.cursors.left.isDown) {
        this.player.body.velocity.x = -gameOptions.dudeSpeed;
        this.player.anims.play("left", true);
      }
      else if(this.cursors.right.isDown) {
        this.player.body.velocity.x = gameOptions.dudeSpeed;
        this.player.anims.play("right", true);
      }
      else {
        this.player.body.velocity.x = 0;
        this.player.anims.play("turn", true);
      }
  
      if(this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.body.velocity.y = -gameOptions.dudeGravity / 1.6;
        this.jumpSound.play();
      }
  
      if(this.player.y > this.game.config.height || this.player.y < 0 || this.heart == 0) {
        this.scene.start("LevelOne");
        this.score = 0;
        this.heart = 3;
      }
  
      if(this.score >= 0 ) {
        this.scene.start("LevelTwo");
        this.score = 0;
        this.heart = 3;
      }
    }
  }