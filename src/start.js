//https://www.patchesoft.com/phaser-3-title-screen-tutorial
export default class start extends Phaser.Scene {

    constructor() {
        super({ key: "StartScene"});
    }

    preload() {}

    create() {
        this.add.text(this.game.config.width/3.7, this.game.config.height/4,
        "Welcome to play!\n Try to get as much coins as you can\n before you lose all your lives\n watchout for the spikes",
        {align: 'center'})
        var text = this.add.text(this.game.config.width/2.5, this.game.config.height/3, 'press to play');
        text.setInteractive({ useHandCursor: true });
        text.on('pointerdown', () => this.clickButton());
    }

    clickButton() {
        this.scene.start('LevelOne', {score: 0, heart: 3});
    }

    update() {}

}
