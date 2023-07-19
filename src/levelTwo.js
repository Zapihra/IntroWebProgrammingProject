import Phaser from "phaser";

import ground from "./assets/platform.png";
import player from "./assets/character.png";
import coin from "./assets/coin.png"
import bCoin from "./assets/coinblue.png"
import spike2 from "./assets/spike2.png"
import heartPix from "./assets/heartPix.png"
//https://stackoverflow.com/questions/66878947/image-is-not-getting-added-to-the-scene-phaser-3-5
// having the pictures show in the web browser

const gameOptions = {
    dudeGravity: 800,
    dudeSpeed: 300
}

export default class LevelTwo extends Phaser.Scene {

    constructor() {
      super({key: "LevelTwo"});
      this.score = 0;
      this.heart = 3;
      this.level = 2;
    }
  
    preload() {
      
      this.load.image("ground", ground);
      this.load.image("coin", coin);
      this.load.image("blue", bCoin);
      this.load.image("spike2", spike2);
      this.load.image("heart", heartPix);
      this.load.spritesheet("player", player, 
      {frameWidth: 32, frameHeight: 48});
      //coin from https://clipground.com/pics/get
      //blue coin just colored to blue
      // heart from https://pixabay.com/fi/illustrations/pixel-syd%C3%A4n-syd%C3%A4n-pikseli%C3%A4-symboli-2779422/
      //spikes were made by me
    }    
    
    create() {
    this.cameras.main.setBackgroundColor("#339933");
    this.groundGroup = this.physics.add.group({
      immovable: true,
      allowGravity: false
    })
    let coin2 = this.add.image(16, 16,"coin");
    coin2.setScale(0.08);
    let hearted = this.add.image(16, 48, "heart");
    hearted.setScale(0.05)
  
    for (let i = 0; i < 20 ; i++) {
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
  
    this.physics.add.overlap(this.player, this.coinGroup, 
      this.collectCoin, null, this);
  
    this.physics.add.overlap(this.player, this.bCoinGroup, 
      this.collectCoinBlue, null, this);
  
      this.physics.add.overlap(this.player, this.spikes, 
        this.spikesHurt, null, this);
  
    this.scoreText = this.add.text(32, 2, "0", {fontSize: "30px", fill: "#ffffff"})
    this.heartText = this.add.text(32, 35, "3", {fontSize: "30px", fill: "#ffffff"})
    this.level = this.add.text(32, 70, "lvl: 2", {fontSize: "25px", fill: "#ffffff"});
  
  
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
    this.groundGroup.setVelocityY(gameOptions.dudeSpeed / 4);
      
    if(Phaser.Math.Between(0,1)) {
      let coins = this.coinGroup.create(Phaser.Math.Between(0, 
        this.game.config.width), 0, "coin");
      coins.setScale(0.08);
  
      this.coinGroup.setVelocityY(gameOptions.dudeGravity);
    }
    
    if(Phaser.Math.Between(0,0.3)) {
      let coins = this.bCoinGroup.create(Phaser.Math.Between(0, 
        this.game.config.width), Phaser.Math.Between(100, 
          400), "blue");
      coins.setScale(0.08);
    }
  
    if(Phaser.Math.Between(0,0.4)) {
      this.spikes.create(Phaser.Math.Between(0, 
        this.game.config.width), Phaser.Math.Between(100, 
          300), "spike2");
      this.spikes.setVelocityY(gameOptions.dudeGravity/2.5)
    }
  }
  
  spikesHurt(player, spikes) {
    spikes.disableBody(false, true);
    this.heart -= 1;
    this.heartText.setText(this.heart)
  }
  
  collectCoin(player, coins) {
    coins.disableBody(true, true);
    this.score += 1
    this.scoreText.setText(this.score);
  }
  
  collectCoinBlue(player, coinsb) {
    coinsb.disableBody(true, true);
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
    }
  
    if(this.player.y > this.game.config.height || this.player.y < 0 || this.heart == 0) {
      this.scene.start("LevelOne");
      this.score = 0;
      this.heart = 3;
    }
  }
  }