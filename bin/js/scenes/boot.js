export class Boot extends Phaser.Scene {
    constructor() {
        super('boot');
    }

    preload(){        
        this.load.image('platform', 'assets/platform.png');
    }

    create(){
        this.scene.start('load');
    }
}