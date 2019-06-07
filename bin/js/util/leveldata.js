import { Editor } from '../util/editor.js';

export class LevelData {
    /**
     * @param {Phaser.Scene} scene
     */
    constructor(scene) {
        this.scene = scene;
        this.platformGroup = this.scene.physics.add.staticGroup();
        this.editor = new Editor(this);

        this.scene.input.keyboard.on('keydown-E', this.toggleEditor, this);
    }

    /**
     * @type {Phaser.Physics.Arcade.StaticGroup}
     */
    platformGroup;

    /**
     * @type {Phaser.GameObjects.GameObject[]}
     */
    platformObjects = [];

    /**
     * @param {Phaser.GameObjects.GameObject} player 
     */
    setPlayer(player) {
        this.player = player;
    }

    /**
     * @param {string} key 
     */
    load(key) {
        this.data = this.scene.cache.json.get(key);

        if ('platforms' in this.data) {
            for (var platformData of this.data['platforms']) {
                let platform = this.createPlatform(platformData);
                this.platformObjects.push(platform);
                this.platformGroup.add(platform);
            }

            this.scene.physics.add.collider(this.player, this.platformGroup);
        }
    }

    /**
     * @param {any} platformData
     * @returns {Phaser.GameObjects.Rectangle}
     */
    createPlatform(platformData) {
        let platform = this.scene.add.rectangle(platformData.x,
            platformData.y,
            platformData.width,
            platformData.height);

        platform.setBlendMode(Phaser.BlendModes.ADD);

        if ('visible' in platformData) { platform.setVisible(platformData.visible); }

        if ('colour' in platformData) {
            let c = platformData.colour;
            if (typeof c === "string"){
                c = parseInt(c);
            }
            platform.setFillStyle(c);
        }

        return platform;
    }

    /**
     * @param {KeyboardEvent} event 
     */
    toggleEditor(event){
        if (this.editor.enabled){
            this.editor.disable();
        } else{
            this.editor.enable();
        }
    }
}