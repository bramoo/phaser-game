export class LevelData {
    /**
     * @param {Phaser.Scene} scene
     */
    constructor(scene) {
        this.scene = scene;
    }

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
            this.platforms = this.scene.physics.add.staticGroup();

            for (var platformData of this.data['platforms']) {
                this.platforms.add(this.createPlatform(platformData));
            }

            this.scene.physics.add.collider(this.player, this.platforms);
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
}