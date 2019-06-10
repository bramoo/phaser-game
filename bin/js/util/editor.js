import { LevelData } from './leveldata.js';
import { ShapeUtil } from './shapeutil.js';

const StateEnum = Object.freeze({ "Select": 0, "AddPlatform": 1 });
const ControlsEnum = Object.freeze({"Select": 's', "AddPlatform": 'p'});
const DefaultColour = 0xFFFFFF;

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
        this.state = StateEnum.Select;
        this.selected = null;
        this.partial = null;
    }

    enable() {
        this.enabled = true;
        this.cursor.setVisible(true);

        for (var object of this.levelData.platformObjects) {
            object.setInteractive();
        }

        this.scene.input.keyboard.on('keydown', this.sceneKeyDown, this);
        this.scene.input.on('pointerdown', this.scenePointerDown, this);
        this.scene.input.on('pointermove', this.scenePointerMove, this);
    }

    /**
     * @param {KeyboardEvent} event 
     */
    sceneKeyDown(event) {
        if (!event.repeat) {
            if (event.key == 's') {
                this.state = StateEnum.Select;
            } else if (event.key == 'p') {
                this.state = StateEnum.AddPlatform;
                this.clearSelected();
                this.partial = null;
            }
        }
    }

    /**
     * @param {Phaser.Input.Pointer} pointer 
     * @param {Phaser.GameObjects.GameObject[]} currentlyOver 
     */
    scenePointerDown(pointer, currentlyOver) {
        if (this.state == StateEnum.Select) {
            this.clearSelected();
            let object = currentlyOver.find(o => 'setFillStyle' in o);
            if (object) {
                this.selected = object;
                this.selected.setFillStyle(this.selected.fillColor, 0);
                this.selected.setStrokeStyle(1, DefaultColour);
            }
        } else if (this.state == StateEnum.AddPlatform) {
            if (!this.partial) {
                this.partial = this.scene.add.rectangle(pointer.worldX, pointer.worldY, 100, 100);
                this.partial.setOrigin(0, 0);
                this.partial.setStrokeStyle(1, DefaultColour);
            } else if (this.partial.type === 'Rectangle') {
                this.partial.setStrokeStyle();
                this.partial.setFillStyle(DefaultColour);
                this.partial.setInteractive();
                this.levelData.addExistingRectangle(this.partial);
                ShapeUtil.normaliseDimensions(this.partial);
                this.partial.body.updateFromGameObject();
                this.partial = null;
            }
        }
    }

    /**
     * @param {Phaser.Input.Pointer} pointer 
     * @param {Phaser.GameObjects.GameObject[]} currentlyOver 
     */
    scenePointerMove(pointer, currentlyOver) {
        if (this.state == StateEnum.AddPlatform && this.partial && this.partial.type === 'Rectangle') {
            let vecTopLeft = this.partial.getTopLeft();
            let vecBottomRight = new Phaser.Math.Vector2(pointer.worldX, pointer.worldY);
            const width = vecBottomRight.x - vecTopLeft.x;
            const height = vecBottomRight.y - vecTopLeft.y;
            this.partial.setPosition(vecTopLeft.x, vecTopLeft.y);
            this.partial.setDisplaySize(width, height);
        }
    }

    clearSelected(){
        if (this.selected){
            this.selected.setFillStyle(this.selected.fillColor, 1);
            this.selected.setStrokeStyle();
            this.selected = null;
        }
    }

    disable() {
        this.enabled = false;
        this.cursor.setVisible(false);

        for (var object of this.levelData.platformObjects) {
            object.disableInteractive();
        }

        this.scene.input.keyboard.off('keydown', this.sceneKeyDown, this);
        this.scene.input.off('pointerdown', this.scenePointerDown, this);
    }

    update() {
        if (this.enabled) {
            let pointer = this.scene.input.activePointer;
            this.cursor.setPosition(pointer.worldX, pointer.worldY);
        }
    }
}