import {CrtPipeline} from '../pipelines.js';

export class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.setBaseURL('http://labs.phaser.io');

        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('red', 'assets/particles/red.png');

        this.load.webfont({
            google: {
                families: ['Bungee+Outline', 'Bungee+Hairline']
            }
        });

        this.crtPipeline = this.game.renderer.addPipeline('Crt', new CrtPipeline(this.game));
        this.crtPipeline.setFloat3('resolution', this.game.config.width, this.game.config.height, 0);
        this.cameras.main.setRenderToTexture(this.crtPipeline);
        console.log(this.cameras);
    }

    create() {
        this.add.image(400, 300, 'sky');

        var particles = this.add.particles('red');
    
        var emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });
    
        var logo = this.physics.add.image(400, 100, 'logo');
    
        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);
    
        emitter.startFollow(logo);

        let title = this.add.text(0, 0, "GAME", {fontFamily: '"Bungee Outline"'});
        this.fillText(title);
    }

    update(time, delta){
        this.crtPipeline.setFloat1('time', time / 1000);
    }

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