//used the video in course material and talks with Viia Mäntymäki and Ida Kirveskoski
//trying to solve the pictures not showing problem
import Phaser from "phaser";
import LevelOne from "./levelOne";
import LevelTwo from "./levelTwo";
import StartScene from "./start";
import EndScene from "./end";


//how to use multiple scenes
//https://flaviocopes.com/phaser-multiple-scenes/
//https://phaser.discourse.group/t/facing-error-as-uncaught-typeerror-cannot-read-property-config-of-undefined/6574

window.onload = function() {
  let gameConfig = {
    type: Phaser.AUTO,
    backgroundColor: "#336633",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 1000,
    },
    pixelArt:true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: {
          y: 0
        }
      }
    },
    scene: [StartScene, LevelOne, LevelTwo, EndScene]
  }

  var game = new Phaser.Game(gameConfig);
}




