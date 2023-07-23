import coin from "./assets/coin.png"

export default class start extends Phaser.Scene {

    init (data) {
        this.score = data.score
    }

    constructor() {
        super({ key: "EndScene"});
    }

    preload() {
        this.load.image("coin", coin);
    }

    create() {
        var bling = this.add.image(this.game.config.width/1.75, this.game.config.height/4 +7, "coin");
        bling.setScale(0.05);
        this.add.text(this.game.config.width/2.7, this.game.config.height/4,
        "You died with " + this.score)
        var text = this.add.text(this.game.config.width/2.7, this.game.config.height/3, 'press to try again');
        text.setInteractive({ useHandCursor: true });
        text.on('pointerdown', () => this.clickButton());
    }

    clickButton() {
        this.scene.switch('LevelOne', {score: 0, heart: 3});
    }

    update() {}

}