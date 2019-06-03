import {CrtPipeline} from '../pipelines.js';

export class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image('sky', 'assets/space3.png');
        this.load.image('logo', 'assets/phaser3-logo.png');
        this.load.image('red', 'assets/red.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 64, frameHeight: 64});

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

        this.player = this.physics.add.sprite(10, 10, 'dude');
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 5}),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'stop',
            frames: [{key: 'dude', frame: 6}]
        });

        this.anims.create({
            key: 'fall',
            frames: [{key: 'dude', frame: 7}]
        });

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 480, 'platform', null, false);

        this.physics.add.collider(this.player, this.platforms);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(time, delta){
        this.crtPipeline.setFloat1('time', time / 1000);
        let grounded = this.player.body.touching.down;

        if (this.cursors.left.isDown){
            this.player.setVelocityX(-160);
            this.player.anims.play(grounded ? 'run' : 'fall', true);
            this.player.flipX = false;
        } else if (this.cursors.right.isDown){
            this.player.setVelocityX(160);
            this.player.anims.play(grounded ? 'run' : 'fall', true);
            this.player.flipX = true;
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play(grounded ? 'stop' : 'fall', true);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-330);
        }
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