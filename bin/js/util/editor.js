import { LevelData } from './leveldata.js';

export class Editor {
    /**
     * @param {LevelData} levelData
     */
    constructor(levelData) {
        this.levelData = levelData;
        this.scene = levelData.scene;

        this.cursor = this.scene.add.sprite(0, 0, 'cursor');
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
        this.enabled = false;
        this.cursor.setVisible(false);

        for (var object of this.levelData.platformObjects){
            object.disableInteractive();
            object.off('pointerdown', this.objectPointerDown);
        }
    }

    update() {
        if (this.enabled) {
            let pointer = this.scene.input.activePointer;
            this.cursor.setPosition(pointer.worldX, pointer.worldY);
        }
    }
}