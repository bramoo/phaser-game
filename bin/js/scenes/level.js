import { Editor } from '../util/editor.js';
import { LevelData } from "../util/leveldata.js";

export class Level extends Phaser.Scene {
    constructor() {
        super('level');
    }

    create() {
        this.crtPipeline = this.game.renderer.getPipeline('crt');
        this.cameras.main.setRenderToTexture(this.crtPipeline);

        // this.add.image(400, 300, 'sky');

        this.player = this.physics.add.sprite(10, 10, 'dude');
        this.player.body.setSize(32, 64);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 5 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'stop',
            frames: [{ key: 'dude', frame: 6 }]
        });

        this.anims.create({
            key: 'fall',
            frames: [{ key: 'dude', frame: 7 }]
        });

        this.leveldata = new LevelData(this);
        this.leveldata.setPlayer(this.player);
        this.leveldata.load('level-01');

        let title = this.add.text(0, -50, "GAME", { fontFamily: '"Bungee Outline"' });
        this.fillText(title);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(time, delta) {
        if (this.leveldata.editor){
            this.leveldata.editor.update();
        }

        this.crtPipeline.setFloat1('time', time / 1000);
        let grounded = this.player.body.touching.down;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play(grounded ? 'run' : 'fall', true);
            this.player.flipX = false;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play(grounded ? 'run' : 'fall', true);
            this.player.flipX = true;
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play(grounded ? 'stop' : 'fall', true);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    /**
     * @param {Phaser.GameObjects.Text} title 
     */
    fillText(title) {
        let min = 100;
        let max = 200;
        let target = this.game.config.width;

        title.setFontSize(min);
        let minDisplay = title.displayWidth;
        while (minDisplay > target) {
            min /= 2;
            title.setFontSize(min);
            minDisplay = title.displayWidth;
        }

        title.setFontSize(max);
        let maxDisplay = title.displayWidth;
        while (maxDisplay < target) {
            max *= 1.5;
            title.setFontSize(max);
            maxDisplay = title.displayWidth;
        }

        let mid = (min + max) / 2;
        title.setFontSize(mid);
        let midDisplay = title.displayWidth;
        while (midDisplay < target - 10 || midDisplay > target) {
            if (midDisplay < target) {
                min = mid;
            }
            else {
                max = mid;
            }
            mid = (min + max) / 2;
            title.setFontSize(mid);
            midDisplay = title.displayWidth;
        }
    }
}