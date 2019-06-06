import { LevelData } from './leveldata.js';

export class Editor {
    /**
     * @param {Phaser.Scene} scene 
     * @param {LevelData} levelData
     */
    constructor(scene, levelData) {
        this.scene = scene;
        this.levelData = levelData;

        this.cursor = scene.add.sprite(0, 0, 'cursor');
        this.cursor.setVisible(false);
        this.enabled = false;
    }

    enable() {
        this.enabled = true;
        this.cursor.setVisible(true);

        for (var object of this.levelData.platformObjects){
            object.setInteractive();
            object.on('pointerdown', this.objectPointerDown);
        }
    }

    /**
     * @param {Phaser.Input.Pointer} pointer 
     * @param {number} localX 
     * @param {number} localY 
     * @param {Phaser.Types.Input.EventData} event 
     */
    objectPointerDown(pointer, localX, localY, event){
        /**@type {Phaser.GameObjects.GameObject} */
        let object = this;
        object.destroy();
    }

    disable() {

    }

    update() {
        if (this.enabled) {
            let pointer = this.scene.input.activePointer;
            this.cursor.setPosition(pointer.worldX, pointer.worldY);
        }
    }
}