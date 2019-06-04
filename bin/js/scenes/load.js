import { CrtPipeline } from '../pipelines.js';

export class Load extends Phaser.Scene {
    constructor() {
        super('load');
    }

    preload() {
        this.barBackground = this.add.sprite(400, 300, 'platform');
        this.barBackground.tint = 0x111111;

        this.bar = this.add.sprite(0, 300, 'platform').setOrigin(0, 0.5);
        this.bar.displayWidth = 0;

        this.load.on('progress', this.updateProgress, this);

        this.load.image('sky', 'assets/space3.png');
        this.load.image('logo', 'assets/phaser3-logo.png');
        this.load.image('red', 'assets/red.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 64, frameHeight: 64 });

        this.load.webfont({
            google: {
                families: ['Bungee+Outline', 'Bungee+Hairline']
            }
        });

        this.crtPipeline = this.game.renderer.addPipeline('crt', new CrtPipeline(this.game));
        this.crtPipeline.setFloat3('resolution', this.game.config.width, this.game.config.height, 0);
    }

    updateProgress(value) {
        console.log(value, this.bar);
        if (this.bar) {
            this.bar.displayWidth = Math.floor(800 * value);
        }
    }

    create() {
        this.scene.start('level');
    }
}